import { IWorkItemFormService } from 'azure-devops-extension-api/WorkItemTracking';
import { isValidUrl } from 'services/UriOptimizer';
import { ILinkedDocument } from './service';
import { ILinkedDocumentSource } from './ILinkedDocumentSource';

export class DescriptionBasedDocumentSource implements ILinkedDocumentSource {
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
