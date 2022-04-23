import { useEffect, useState } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { CommonServiceIds, IExtensionDataManager, IExtensionDataService } from 'azure-devops-extension-api';
import { useDebounce } from 'usehooks-ts';

export async function getDataManager(): Promise<IExtensionDataManager> {
  const service = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
  const manager = await service.getExtensionDataManager(SDK.getContributionId(), await SDK.getAccessToken());
  return manager;
}

export type UseStoredValueState<T> = {
  value: T;
  isLoading: boolean;
  setValue: (s: T) => void;
};

export const useStoredValue = <T>(name: string, defaultValue: T): UseStoredValueState<T> => {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);

  /* load the data from data manager */
  useEffect(() => {
    let isLoadData = true;
    const loadValue = async (): Promise<void> => {
      const manager = await getDataManager();
      const storedValue = await manager.getValue<T>(name);
      if (storedValue && isLoadData) {
        setValue(storedValue);
      }
      setLoading(false);
    };
    loadValue().catch(console.error);
    return (): void => { isLoadData = false }
  }, [name]);

  /* store the data in the datamanager in a debounced way */
  const debouncedValue = useDebounce(value, 750);
  useEffect(() => {
    let isSetData = true;
    const storeValue = async (): Promise<void> => {
      const manager = await getDataManager();
      if (isSetData) {
        await manager.setValue(name, debouncedValue);
      }
    };
    if (!loading) {
      storeValue().catch(console.error);
    }
    return (): void => { isSetData = false };
  }, [name, debouncedValue]);

  return { isLoading: loading, value, setValue };
};
