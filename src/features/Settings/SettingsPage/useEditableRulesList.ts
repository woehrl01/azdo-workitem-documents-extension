import { useCallback } from 'react';
import { useStoredValue } from 'hooks/useStoredValue';
import { ITableItem } from './RulesTable/types';

interface IUseEditableRulesListState {
  isLoading: boolean;
  rules: Array<ITableItem>;
  addNewItem: () => void;
  deleteItem: (target: ITableItem) => void;
  changeItem: (rowIndex: number, target: ITableItem) => void;
}
export const useEditableRulesList = (): IUseEditableRulesListState => {
  const { isLoading, value: rules, setValue: setRules } = useStoredValue<Array<ITableItem>>('rules', []);

  const addNewItem = useCallback((): void => {
    setRules([...rules, { rule: '', type: 'allow' }]);
  }, [rules, setRules]);

  const deleteItem = useCallback((target: ITableItem): void => {
    setRules([...rules.filter(r => r !== target)]);
  }, [rules, setRules]);

  const changeItem = useCallback((rowIndex: number, target: ITableItem): void => {
    setRules([...rules.map((r, i) => i === rowIndex ? target : r)]);
  }, [rules, setRules]);

  return {
    isLoading,
    rules,
    addNewItem,
    deleteItem,
    changeItem
  };
};
