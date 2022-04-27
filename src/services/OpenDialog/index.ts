import * as SDK from 'azure-devops-extension-sdk';
import { IHostPageLayoutService, CommonServiceIds } from 'azure-devops-extension-api';
import { trackEvent } from 'components/AppInsights';


export async function openAddDocumentDialog(): Promise<void> {
    trackEvent('addDocumentDialog', { action: 'open' })

    const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    dialogService.openCustomDialog(`${SDK.getExtensionContext().id}.add-document-dialog`, {
        title: 'Add document',
    });
}
