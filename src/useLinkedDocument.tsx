import { useState, useEffect, useCallback } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { IWorkItemFormService, WorkItemRelation, WorkItemTrackingServiceIds } from 'azure-devops-extension-api/WorkItemTracking';
import { isValidUrl } from './UriOptimizer';

export interface ILinkedDocument {
    name: string;
    url: string;
    addedDate?: Date;
}

export interface IUseLinkedDocument {
    documents: ILinkedDocument[];
    isLoading: boolean;
}


const registerSdk = async (callback: () => void): Promise<void> => {
    await SDK.init({ loaded: true });
    SDK.register(SDK.getContributionId(), () => ({
        onLoaded(): void {
            callback();
        },
        onFieldChanged(): void {
            callback();
        },
        onReset(): void {
            callback();
        },
        onRefresh(): void {
            callback();
        }
    }));
    await SDK.ready();
    /* call the callback initally if events have 
     * been missed because of later loading */
    callback();
};

const fetchCurrentDocuments = async (): Promise<ILinkedDocument[]> => {
    const formService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);

    const extractor = [
        new RelationBasedDocumentSource(formService),
        new DescriptionBasedDocumentSource(formService),
    ];

    const documents = await Promise.all(extractor.map(f => f.readDocuments()));
    return distinctBy(documents.flat(), d => d.url);
}

export const useLinkedDocuments = (): IUseLinkedDocument => {
    const [documents, setDocuments] = useState<ILinkedDocument[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const updateCurrentDocuments = useCallback(async () => {
        setIsLoading(true);
        console.log('fetching and refreshing current documents');
        const fetchedDocuments = await fetchCurrentDocuments();
        console.log(`received ${fetchedDocuments.length} documents`);
        setDocuments(fetchedDocuments);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        registerSdk(updateCurrentDocuments);
    }, []);

    return { documents, isLoading };
};




function distinctBy<T, K>(arr: T[], key: (t: T) => K): T[] {
    const map = new Set<K>();
    const result: T[] = [];
    for (let i = 0; i < arr.length; i++) {
        const k = key(arr[i]);
        if (!map.has(k)) {
            map.add(k);
            result.push(arr[i]);
        }
    }
    return result;
}

interface ILinkedDocumentSource {
    readDocuments: () => Promise<ILinkedDocument[]>;
}

class RelationBasedDocumentSource implements ILinkedDocumentSource {
    constructor(private readonly formService: IWorkItemFormService) { }

    async readDocuments(): Promise<ILinkedDocument[]> {
        const relations = await this.formService.getWorkItemRelations();
        const documents = relations
            .filter(f => f.rel === 'Hyperlink' && f.attributes.isDeleted === false)
            .map(RelationBasedDocumentSource.mapRelationToDocument);
        return documents;
    }

    private static mapRelationToDocument(rel: WorkItemRelation): ILinkedDocument {
        let name = rel.attributes.comment || '';
        if (/^\s*$/.test(name)) {
            name = rel.url;
        }
        return { name, url: rel.url, addedDate: rel.attributes.resourceCreatedDate as Date }
    }
}

class DescriptionBasedDocumentSource implements ILinkedDocumentSource {
    constructor(private readonly formService: IWorkItemFormService) { }

    async readDocuments(): Promise<ILinkedDocument[]> {
        const description = await this.formService.getFieldValue('System.Description', { returnOriginalValue: false }) as string;

        const parser = new DOMParser();
        const document = parser.parseFromString(description, 'text/html');
        const links = document.querySelectorAll('a');

        const crawled = Array.from(links)
            .filter(link => isValidUrl(link.href))
            .map(DescriptionBasedDocumentSource.mapDomLinkToDocument);
        return crawled;
    }

    private static mapDomLinkToDocument(link: HTMLAnchorElement): ILinkedDocument {
        let { text } = link;
        if (/^\s*$/.test(text)) {
            text = link.href;
        }
        return { name: text, url: link.href };
    }
}
