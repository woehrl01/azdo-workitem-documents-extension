import * as SDK from 'azure-devops-extension-sdk';
import { IHostPageLayoutService, CommonServiceIds } from 'azure-devops-extension-api';

export async function openAddDocumentDialog(): Promise<void> {
    const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);

    const options = {
        title: 'Add Document',
    };

    dialogService.openCustomDialog(`${SDK.getExtensionContext().id}.add-document-dialog`, options);
}
