import * as SDK from 'azure-devops-extension-sdk';
import { IWorkItemFormService } from 'azure-devops-extension-api/WorkItemTracking';
import { DescriptionBasedDocumentSource } from './DescriptionBasedDocumentSource';
import { RelationBasedDocumentSource } from './RelationBasedDocumentSource';
import { distinctBy } from 'services/DistinctBy';
import { AllowRules, BlockRules } from 'services/Rules';
import { WorkItemTrackingServiceIds } from 'components/Common';

export interface ILinkedDocument {
    name: string;
    url: string;
    addedDate?: Date;
    isHide?: boolean;
}


export const fetchCurrentDocuments = async (): Promise<ILinkedDocument[]> => {
    const formService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);

    const allowRules = await AllowRules();
    const blockRules = await BlockRules();

    const extractor = [
        new RelationBasedDocumentSource(formService),
        new DescriptionBasedDocumentSource(formService, allowRules),
    ];

    const documents = await Promise.all(extractor.map(f => f.readDocuments()));
    const distinctDocuments = distinctBy(documents.flat(), d => d.url);

    for (const document of distinctDocuments) {
        document.isHide = blockRules.some(r => r.rule.test(document.url));
    }

    return distinctDocuments;
};
