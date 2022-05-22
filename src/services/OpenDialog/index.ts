import * as SDK from 'azure-devops-extension-sdk';
import { IHostPageLayoutService } from 'azure-devops-extension-api';
import { CommonServiceIds } from 'components/Common';

const dialogServicePromise = SDK.ready().then(() => SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService));

export async function openAddDocumentDialog(): Promise<void> {
    const dialogService = await dialogServicePromise;

    const options = {
        title: 'Add Document',
    };

    dialogService.openCustomDialog(`${SDK.getExtensionContext().id}.add-document-dialog`, options);
}
