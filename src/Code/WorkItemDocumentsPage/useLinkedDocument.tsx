import { useState, useEffect, useCallback } from "react";
import * as SDK from "azure-devops-extension-sdk";
import { IWorkItemFormService, WorkItemRelation, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";

export interface ILinkedDocument {
    name: string;
    url: string;
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
};

export const useLinkedDocuments = (): ILinkedDocument[] => {
    var [documents, setDocuments] = useState<ILinkedDocument[]>([]);

    const updateCurrentDocuments = useCallback(async () => {
        console.log("fetching and refreshing current documents");
        const documents = await fetchCurrentDocuments();
        console.log(`received ${documents.length} documents`);
        setDocuments(documents);
    }, []);

    useEffect(() => {
        registerSdk(updateCurrentDocuments);
    }, []);
    return documents;
};

const mapRelationToDocument = (rel: WorkItemRelation): ILinkedDocument => {
    var name = rel.attributes.comment || "";
    if (name.length == 0) {
        name = rel.url;
    }
    return { name: name, url: rel.url }
};

const regex = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;
const unique = function <T>(arr: T[]): T[] { return [...new Set<T>(arr)] };

const fetchCurrentDocuments = async (): Promise<ILinkedDocument[]> => {
    const formService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
    const documents = await extractFromRelations(formService);
    const crawled = await extractFromDescriptionField(formService);

    return ([] as ILinkedDocument[])
        .concat(documents)
        .concat(crawled.filter(e => documents.findIndex(d => d.url == e.url) === -1));
}

async function extractFromRelations(formService: IWorkItemFormService) {
    const relations = await formService.getWorkItemRelations();

    const documents = relations
        .filter(f => f.rel == "Hyperlink" && f.attributes.isDeleted == false)
        .map(mapRelationToDocument);
    return documents;
}

async function extractFromDescriptionField(formService: IWorkItemFormService) {
    const description = await formService.getFieldValue("System.Description", { returnOriginalValue: false }) as string;

    const crawled = unique(description.match(regex) || [])
        .map(v => {
            return {
                name: v,
                url: v
            };
        });
    return crawled;
}
