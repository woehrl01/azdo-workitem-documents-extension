import * as SDK from 'azure-devops-extension-sdk';
import { IWorkItemFormService, WorkItemTrackingServiceIds } from 'azure-devops-extension-api/WorkItemTracking';
import { DescriptionBasedDocumentSource } from './DescriptionBasedDocumentSource';
import { RelationBasedDocumentSource } from './RelationBasedDocumentSource';
import { distinctBy } from 'services/distinctBy';

export interface ILinkedDocument {
    name: string;
    url: string;
    addedDate?: Date;
}


export const fetchCurrentDocuments = async (): Promise<ILinkedDocument[]> => {
    const formService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);

    const extractor = [
        new RelationBasedDocumentSource(formService),
        new DescriptionBasedDocumentSource(formService),
    ];

    const documents = await Promise.all(extractor.map(f => f.readDocuments()));
    return distinctBy(documents.flat(), d => d.url);
};
