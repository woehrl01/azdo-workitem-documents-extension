import { IWorkItemFormService, WorkItemRelation } from 'azure-devops-extension-api/WorkItemTracking';
import { ILinkedDocument } from './service';
import { ILinkedDocumentSource } from './ILinkedDocumentSource';


export class RelationBasedDocumentSource implements ILinkedDocumentSource {
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
        return { name, url: rel.url, addedDate: rel.attributes.resourceCreatedDate as Date };
    }
}
