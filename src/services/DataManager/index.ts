import * as SDK from 'azure-devops-extension-sdk';
import { IExtensionDataManager, IExtensionDataService } from 'azure-devops-extension-api';
import { CommonServiceIds } from 'components/Common';


const dataServicePromise = SDK.ready()
  .then(() =>
    Promise.all([
      SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService),
      SDK.getAccessToken()
    ])
      .then(([dataService, token]) => dataService.getExtensionDataManager(SDK.getContributionId(), token)));

export async function getDataManager(): Promise<IExtensionDataManager> {
  return await dataServicePromise;
}
