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
                console.debug("onLoad");
                callback();
            },
            onFieldChanged: function () {
                console.debug("fieldChanged");
                callback();
            },
            onReset: function () {
                console.debug("onReset");
                callback();
            },
            onRefresh: function () {
                console.debug("onRefresh");
                callback();
            }
        };
    });
};

export const useLinkedDocuments = (): ILinkedDocument[] => {
    var [documents, setDocuments] = useState<ILinkedDocument[]>([]);

    const updateCurrentDocuments = useCallback(async () => {
        const documents = await fetchCurrentDocuments();
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
        name = rel.url.substring(0, 25) + "...";
    }
    return { name: name, url: rel.url }
};

const fetchCurrentDocuments = async (): Promise<ILinkedDocument[]> => {
    const formService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
    const relations = await formService.getWorkItemRelations();

    const documents = relations
        .filter(f => f.rel == "Hyperlink" && f.attributes.isDeleted == false)
        .map(mapRelationToDocument);

    return documents;
}