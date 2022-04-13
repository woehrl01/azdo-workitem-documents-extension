import { useState, useEffect, useCallback } from "react";
import * as SDK from "azure-devops-extension-sdk";
import { IWorkItemFormService, WorkItemRelation, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { validUrl } from "./UriOptimizer";

export interface ILinkedDocument {
    name: string;
    url: string;
    addedDate?: Date
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
        extractFromRelations,
        extractFromDescriptionField
    ];

    var documents = await Promise.all(extractor.map(f => f(formService)));

    var unique = new Set<string>();
    var result = new Array<ILinkedDocument>();
    for (let doc of documents.flat()) {
        if (unique.has(doc.url)) {
            continue;
        }
        result.push(doc);
    }

    return result;
}

const mapRelationToDocument = (rel: WorkItemRelation): ILinkedDocument => {
    var name = rel.attributes.comment || "";
    if (name.length == 0) {
        name = rel.url;
    }
    return { name: name, url: rel.url, addedDate: rel.attributes.resourceCreatedDate as Date }
};

async function extractFromRelations(formService: IWorkItemFormService): Promise<ILinkedDocument[]> {
    const relations = await formService.getWorkItemRelations();

    const documents = relations
        .filter(f => f.rel == "Hyperlink" && f.attributes.isDeleted == false)
        .map(mapRelationToDocument);
    return documents;
}

const mapDomLinkToDocument = (link: HTMLAnchorElement): ILinkedDocument => {
    var text = link.text;
    if (text.trim().length == 0) {
        text = link.href;
    }
    return { name: text, url: link.href };
};

async function extractFromDescriptionField(formService: IWorkItemFormService): Promise<ILinkedDocument[]> {
    const description = await formService.getFieldValue("System.Description", { returnOriginalValue: false }) as string;

    var parser = new DOMParser();
    var document = parser.parseFromString(description, "text/html");
    var links = document.querySelectorAll("a");

    const crawled = Array.from(links)
        .filter(link => validUrl(link.href))
        .map(mapDomLinkToDocument);
    return crawled;
}
