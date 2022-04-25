import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { getDataManager } from 'services/DataManager';

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
  const debouncedValue = useDebounce(value, 500);
  const storeValue = useCallback(async (): Promise<void> => {
    const manager = await getDataManager();
    console.debug(JSON.stringify(debouncedValue));
    await manager.setValue(name, debouncedValue);
  }, [name, debouncedValue]);

  useEffect(() => {
    if (!loading) {
      storeValue().catch(console.error);
    }
  }, [storeValue, loading]);

  return { isLoading: loading, value, setValue };
};
