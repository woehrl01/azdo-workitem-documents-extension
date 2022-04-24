import { FC, useCallback } from 'react';

import { NoProps } from 'components/Common';
import { Page } from 'azure-devops-ui/Page';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import styles from './style.module.scss';
import { useStoredValue } from 'hooks/useStoredValue';
import { ColumnMore, ITableColumn, Table } from 'azure-devops-ui/Table';
import { IHeaderCommandBarItem } from 'azure-devops-ui/HeaderCommandBar';
import { ArrayItemProvider } from 'azure-devops-ui/Utilities/Provider';
import { DropdownCell } from './DropdownCell';
import { InputCell } from './InputCell';
import { Card } from 'azure-devops-ui/Card';
import { IReadonlyObservableValue, ObservableValue } from 'azure-devops-ui/Core/Observable';

export type ITableItem = {
  rule: string;
  type: RuleType;
}

enum RuleType {
  Allow = 0,
  Block = 1
}

export type ChangeHandler = (rowIndex: number, tableItem: ITableItem) => void

const columns = (onDelete: (target: ITableItem) => void, onChange: (rowIndex: number, target: ITableItem) => void): ITableColumn<ITableItem>[] => {
  return [
    new InputCell('rule', 'Rule (RegEx)', -60, onChange),
    new DropdownCell('type', 'Type', -30, onChange),
    new ColumnMore(target => {
      return {
        id: 'sub-menu',
        items: [
          {
            id: 'delete',
            text: 'Delete',
            iconProps: { iconName: 'Delete' },
            onActivate: () => onDelete(target)
          },
        ],
      };
    }) as ITableColumn<ITableItem>,
  ]
};

const commandBar = (disabled: boolean, onActivate: () => void): IHeaderCommandBarItem[] => {
  return [
    {
      iconProps: {
        iconName: 'Add'
      },
      id: 'create',
      important: true,
      isPrimary: true,
      disabled: disabled,
      onActivate: onActivate,
      tooltipProps: {
        text: 'Add new rule'
      },
    }
  ]
};

const loadingList = new ArrayItemProvider<IReadonlyObservableValue<ITableItem | undefined>>(
  new Array(3).fill(new ObservableValue<ITableItem | undefined>(undefined)));

export const SettingsPage: FC<NoProps> = () => {
  const { isLoading, value: rules, setValue: setRules } = useStoredValue<Array<ITableItem>>('rules', []);

  const addNewItem = useCallback((): void => {
    setRules([...rules, { rule: '', type: 0 }]);
  }, [rules]);

  const deleteItem = useCallback((target: ITableItem): void => {
    setRules([...rules.filter(d => d !== target)]);
  }, [rules]);

  const changeItem = useCallback((rowIndex: number, target: ITableItem): void => {
    setRules([...rules.map((d, i) => i === rowIndex ? target : d)]);
  }, [rules]);

  const itemProvider = new ArrayItemProvider<ITableItem>(rules)

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
          itemProvider={isLoading ? loadingList : itemProvider}
          role="table"
        />

        <Card className={styles.explaination}>
          Blocking rules will hide the documents from showing up in the embedded documents list.
          <br />
          Allow rules will include the documents in the list if they are referenced inside the 'Description' field.
        </Card>
      </div>

    </Page>
  );
};


