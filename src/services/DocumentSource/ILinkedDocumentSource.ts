import { ILinkedDocument } from './service';

export interface ILinkedDocumentSource {
    readDocuments: () => Promise<ILinkedDocument[]>;
}


