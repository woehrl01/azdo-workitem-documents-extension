import { IWorkItemFormService } from 'azure-devops-extension-api/WorkItemTracking';
import { isValidUrl } from 'services/UriOptimizer';
import { ILinkedDocument } from './service';
import { ILinkedDocumentSource } from './ILinkedDocumentSource';
import { IValidRule } from 'services/Rules';



export class DescriptionBasedDocumentSource implements ILinkedDocumentSource {
    constructor(
        private readonly formService: IWorkItemFormService,
        private readonly allowRules: IValidRule[]) { }

    async readDocuments(): Promise<ILinkedDocument[]> {
        const description = await this.formService.getFieldValue('System.Description', { returnOriginalValue: false }) as string;

        const parser = new DOMParser();
        const document = parser.parseFromString(description, 'text/html');
        const links = document.querySelectorAll('a');

        const crawled = Array.from(links)
            .filter(link => this.isValidUrlWithRules(link.href))
            .map(DescriptionBasedDocumentSource.mapDomLinkToDocument);
        return crawled;
    }

    private isValidUrlWithRules(url: string): boolean {
        if (!url.startsWith('https://')) {
            return false;
        }

        if (isValidUrl(url)) {
            return true;
        }

        return this.allowRules.some(r => r.rule.test(url));
    }

    private static mapDomLinkToDocument(link: HTMLAnchorElement): ILinkedDocument {
        let { text } = link;
        if (/^\s*$/.test(text)) {
            text = link.href;
        }
        return { name: text, url: link.href };
    }
}
