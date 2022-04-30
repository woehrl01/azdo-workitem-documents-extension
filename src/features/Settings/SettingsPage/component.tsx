import { useCallback } from 'react';

import { Page } from 'azure-devops-ui/Page';
import styles from './style.module.scss';
import { useStoredValue } from 'hooks/useStoredValue';
import { ITableItem } from './RulesTable/types';
import { Explaination } from './Explaination';
import { RulesTable } from './RulesTable/component';
import { RulesHeader } from './RulesHeader/component';
import { Content } from './Content';

export const SettingsPage = (): JSX.Element => {
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

  return (
    <Page className={styles.page}>
      <RulesHeader
        isLoading={isLoading}
        addNewItem={addNewItem}
      />
      <Content>
        <RulesTable
          isLoading={isLoading}
          rules={rules}
          onDelete={deleteItem}
          onChange={changeItem}
        />
        <Explaination />
      </Content>
    </Page>
  );
};


