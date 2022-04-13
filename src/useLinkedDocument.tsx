import { useState, useEffect, useCallback } from "react";
import * as SDK from "azure-devops-extension-sdk";
import { IWorkItemFormService, WorkItemRelation, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { isValidUrl } from "./UriOptimizer";

export interface ILinkedDocument {
    name: string;
    url: string;
    addedDate?: Date;
}

export interface IUseLinkedDocument {
    documents: ILinkedDocument[];
    isLoading: boolean;
}


const registerSdk = async (callback: () => void) => {
    await SDK.init();
    SDK.register(SDK.getContributionId(), () => {
        return {
            onLoaded: function () {
                callback();
            },
            onFieldChanged: function () {
                callback();
            },
            onReset: function () {
                callback();
            },
            onRefresh: function () {
                callback();
            }
        };
    });
    /* call the callback initally if events have 
     * been missed because of later loading */
    callback();
};

export const useLinkedDocuments = (): IUseLinkedDocument => {
    var [documents, setDocuments] = useState<ILinkedDocument[]>([]);
    var [isLoading, setIsLoading] = useState<boolean>(true);

    const updateCurrentDocuments = useCallback(async () => {
        setIsLoading(true);
        console.log("fetching and refreshing current documents");
        const documents = await fetchCurrentDocuments();
        console.log(`received ${documents.length} documents`);
        setDocuments(documents);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        registerSdk(updateCurrentDocuments);
    }, []);

    return { documents, isLoading };
};


const fetchCurrentDocuments = async (): Promise<ILinkedDocument[]> => {
    const formService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);

    var extractor = [
        new RelationBasedDocumentSource(formService),
        new DescriptionBasedDocumentSource(formService),
    ];

    var documents = await Promise.all(extractor.map(f => f.readDocuments()));
    return distinctBy(documents.flat(), d => d.url);
}

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
            .filter(f => f.rel == "Hyperlink" && f.attributes.isDeleted == false)
            .map(this.mapRelationToDocument);
        return documents;
    }

    private mapRelationToDocument(rel: WorkItemRelation): ILinkedDocument {
        var name = rel.attributes.comment || "";
        if (/^\s*$/.test(name)) {
            name = rel.url;
        }
        return { name: name, url: rel.url, addedDate: rel.attributes.resourceCreatedDate as Date }
    };
}

class DescriptionBasedDocumentSource implements ILinkedDocumentSource {
    constructor(private readonly formService: IWorkItemFormService) { }

    async readDocuments(): Promise<ILinkedDocument[]> {
        const description = await this.formService.getFieldValue("System.Description", { returnOriginalValue: false }) as string;

        var parser = new DOMParser();
        var document = parser.parseFromString(description, "text/html");
        var links = document.querySelectorAll("a");

        const crawled = Array.from(links)
            .filter(link => isValidUrl(link.href))
            .map(this.mapDomLinkToDocument);
        return crawled;
    }

    private mapDomLinkToDocument(link: HTMLAnchorElement): ILinkedDocument {
        var text = link.text;
        if (/^\s*$/.test(text)) {
            text = link.href;
        }
        return { name: text, url: link.href };
    };
}