import * as SDK from 'azure-devops-extension-sdk';
import { CommonServiceIds, IExtensionDataManager, IExtensionDataService } from 'azure-devops-extension-api';


export async function getDataManager(): Promise<IExtensionDataManager> {
  const service = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
  return await service.getExtensionDataManager(SDK.getContributionId(), await SDK.getAccessToken());
}
