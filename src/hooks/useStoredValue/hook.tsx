import { useCallback, useEffect, useState } from 'react';
import { getDataManager } from '../../features/Settings/SettingsPage/component';

export type UseStoredValueState = {
  value: string;
  isLoading: boolean;
  setValue: (s: string) => void;
};

export const useStoredValue = (
  name: string,
  defaultValue: string
): UseStoredValueState => {
  const [value, setValue] = useState<string>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async (): Promise<void> => {
      const manager = await getDataManager();
      const storedValue = await manager.getValue<string>(name);
      if (storedValue) {
        setValue(storedValue);
      }
      setLoading(false);
    })();
  }, [name]);

  const setStoredValue = useCallback((s: string): void => {
    (async (): Promise<void> => {
      setValue(s);
      const manager = await getDataManager();
      await manager.setValue(name, s);
    })();
  }, [setValue, name]);

  return { isLoading: loading, value, setValue: setStoredValue };
};
