import { FC, useCallback } from 'react';

import { NoProps } from 'components/Common';
import { Page } from 'azure-devops-ui/Page';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import styles from './style.module.scss';
import { useStoredValue } from 'hooks/useStoredValue';
import { Table } from 'azure-devops-ui/Table';
import { Card } from 'azure-devops-ui/Card';
import { ITableItem } from './types';
import { commandBar, columns, buildTableItems } from './table.definition';
import { Link } from 'azure-devops-ui/Link';
import { Icon } from 'azure-devops-ui/Icon';

export const SettingsPage: FC<NoProps> = () => {
  const { isLoading, value: rules, setValue: setRules } = useStoredValue<Array<ITableItem>>('rules', []);

  const addNewItem = useCallback((): void => {
    setRules([...rules, { rule: '', type: 'allow' }]);
  }, [rules]);

  const deleteItem = useCallback((target: ITableItem): void => {
    setRules([...rules.filter(r => r !== target)]);
  }, [rules]);

  const changeItem = useCallback((rowIndex: number, target: ITableItem): void => {
    setRules([...rules.map((r, i) => i === rowIndex ? target : r)]);
  }, [rules]);

  return (
    <Page className={styles.page}>
      <Header
        title="Embedded Documents"
        titleSize={TitleSize.Large}
        commandBarItems={commandBar(isLoading, addNewItem)}
      />
      <div className="page-content">
        <Table<ITableItem>
          ariaLabel="Table with async"
          className="table-example"
          columns={columns(deleteItem, changeItem)}
          containerClassName="h-scroll-auto"
          itemProvider={buildTableItems(isLoading, rules)}
          role="table"
        />
        <Card className={styles.explaination}>
          <div>
            Rules needs to be formulated in regular expression format. You can use <Link href="https://regex101.com/" target="_blank">regex101</Link> to test your regular expression.
            <p>
              Example: <code>^https:\/\/somedomain\.com/embedded</code>.
            </p>
            <p>
              <Icon iconName='Accept' className={styles.allowed} /> Allow rules will include the documents in the list if they are referenced inside the <em>Description</em> field.
            </p>
            <Icon iconName='Blocked' className={styles.blocked} /> Block rules will hide the documents from showing up in the embedded documents list. <em>Blocking overrides allow.</em>
          </div>
        </Card>
      </div>

    </Page>
  );
};


