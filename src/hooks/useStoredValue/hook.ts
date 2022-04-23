import { useCallback, useEffect, useState } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { CommonServiceIds, IExtensionDataManager, IExtensionDataService } from 'azure-devops-extension-api';


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

  useEffect(() => {
    (async (): Promise<void> => {
      const manager = await getDataManager();
      const storedValue = await manager.getValue<T>(name);
      if (storedValue) {
        setValue(storedValue);
      }
      setLoading(false);
    })();
  }, [name]);

  const setStoredValue = useCallback((s: T): void => {
    (async (): Promise<void> => {
      setValue(s);
      const manager = await getDataManager();
      await manager.setValue(name, s);
    })();
  }, [setValue, name]);

  return { isLoading: loading, value, setValue: setStoredValue };
};
