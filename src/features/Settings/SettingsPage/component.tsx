import { Page } from 'azure-devops-ui/Page';
import styles from './style.module.scss';
import { Explaination } from './Explaination';
import { RulesTable } from './RulesTable/component';
import { RulesHeader } from './RulesHeader/component';
import { Content } from './Content';
import { useEditableRulesList } from './useEditableRulesList';

export const SettingsPage = (): JSX.Element => {
  const { isLoading, rules, addNewItem, deleteItem, changeItem } = useEditableRulesList();

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


