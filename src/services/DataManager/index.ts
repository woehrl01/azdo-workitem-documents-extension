import * as SDK from 'azure-devops-extension-sdk';
import { IExtensionDataManager, IExtensionDataService } from 'azure-devops-extension-api';
import { CommonServiceIds } from 'components/Common';

export async function getDataManager(): Promise<IExtensionDataManager> {
  const service = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
  return await service.getExtensionDataManager(SDK.getContributionId(), await SDK.getAccessToken());
}
