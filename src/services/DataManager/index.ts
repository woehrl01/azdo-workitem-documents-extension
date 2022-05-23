import * as SDK from 'azure-devops-extension-sdk';
import { IExtensionDataManager, IExtensionDataService } from 'azure-devops-extension-api';
import { CommonServiceIds } from 'components/Common';

/*
we preload the data service as soon as the SDK is ready, so we we don't 
have to wait for it when the user interacts with the extension.
*/
const dataServicePromise = SDK.ready()
  .then(() =>
    Promise.all([
      SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService),
      SDK.getAccessToken()
    ])
      .then(([dataService, token]) => dataService.getExtensionDataManager(SDK.getContributionId(), token)));

export async function getDataManager(): Promise<IExtensionDataManager> {
  return dataServicePromise;
}
