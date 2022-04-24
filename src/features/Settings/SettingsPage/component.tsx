import { FC, useCallback, useEffect, useState } from 'react';

import { NoProps } from 'components/Common';
import { Page } from 'azure-devops-ui/Page';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import styles from './style.module.scss';
import { useStoredValue } from 'hooks/useStoredValue';
import { Loading } from 'components/Loading';
import { ColumnMore, ITableColumn, Table } from 'azure-devops-ui/Table';
import { IHeaderCommandBarItem } from 'azure-devops-ui/HeaderCommandBar';
import { ArrayItemProvider } from 'azure-devops-ui/Utilities/Provider';
import { DropdownCell } from './DropdownCell';
import { InputCell } from './InputCell';
import { Card } from 'azure-devops-ui/Card';

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

const commandBar = (onActivate: () => void): IHeaderCommandBarItem[] => {
  return [
    {
      iconProps: {
        iconName: 'Add'
      },
      id: 'create',
      important: true,
      isPrimary: true,
      onActivate: onActivate,
      tooltipProps: {
        text: 'Add new rule'
      },
    }
  ]
};


export const SettingsPage: FC<NoProps> = () => {
  const { isLoading, value, setValue } = useStoredValue<Array<ITableItem>>('rules', []);
  const [itemProvider, setItemProvider] = useState<ArrayItemProvider<ITableItem>>(new ArrayItemProvider<ITableItem>(value));

  const storeValue = (): void => setValue([...itemProvider.value as ITableItem[]]);

  const addNewItem = useCallback((): void => {
    setItemProvider(new ArrayItemProvider([...itemProvider.value, { rule: '', type: 0 }]));
    storeValue();
  }, [itemProvider]);

  const deleteItem = useCallback((target: ITableItem): void => {
    setItemProvider(new ArrayItemProvider([...itemProvider.value.filter(d => d !== target)]));
    storeValue();
  }, [itemProvider]);

  const changeItem = useCallback((rowIndex: number, target: ITableItem): void => {
    setItemProvider(new ArrayItemProvider([...itemProvider.value.map((d, i) => i === rowIndex ? target : d)]));
    storeValue();
  }, [itemProvider]);

  useEffect(() => {
    if (!isLoading) {
      setItemProvider(new ArrayItemProvider(value));
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <Page className={styles.page}>
      <Header
        title="Embedded Documents"
        titleSize={TitleSize.Large}
        commandBarItems={commandBar(addNewItem)}
      />
      <div className="page-content">
        <Table<ITableItem>
          ariaLabel="Table with async"
          className="table-example"
          columns={columns(deleteItem, changeItem)}
          containerClassName="h-scroll-auto"
          itemProvider={itemProvider}
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


