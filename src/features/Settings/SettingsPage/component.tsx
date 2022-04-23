import { FC } from 'react';

import { NoProps } from 'components/Common';
import { Page } from 'azure-devops-ui/Page';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import { TextField, TextFieldWidth } from 'azure-devops-ui/TextField';
import styles from './style.module.scss';
import { useStoredValue } from 'hooks/useStoredValue';
import { Loading } from 'components/Loading';
import { IReadonlyObservableValue, ObservableArray } from 'azure-devops-ui/Core/Observable';
import { renderSimpleCell, Table, TableColumnLayout } from 'azure-devops-ui/Table';

type ITableItem = {
  name: string;
  age: number;
  gender: string;
}

const values = Array<ITableItem>({ name: 'Lukas', age: 50, gender: 'M' })

const itemProvider = new ObservableArray<ITableItem | IReadonlyObservableValue<ITableItem | undefined>>(values);

const asyncColumns = [
  {
    columnLayout: TableColumnLayout.singleLinePrefix,
    id: 'name',
    name: 'Name',
    readonly: true,
    renderCell: renderSimpleCell,
    width: -30,
  },
  {
    id: 'age',
    name: 'Age',
    readonly: true,
    renderCell: renderSimpleCell,
    width: -30
  },
  {
    columnLayout: TableColumnLayout.none,
    id: 'gender',
    name: 'Gender',
    readonly: true,
    renderCell: renderSimpleCell,
    width: -40,
  },
];


export const SettingsPage: FC<NoProps> = () => {
  const { isLoading, value, setValue } = useStoredValue<string>('settings', '0');

  if (isLoading) {
    return <Loading />
  }

  return (
    <Page className={styles.page}>
      <Header title="Embedded Documents" titleSize={TitleSize.Large} />
      <div className="page-content">
        <div>{value}</div>
        <TextField
          value={value}
          onChange={(_, newValue): void => setValue(newValue)}
          placeholder="Value"
          width={TextFieldWidth.standard}
        />
        <Table<ITableItem>
          ariaLabel="Table with async"
          className="table-example"
          columns={asyncColumns}
          containerClassName="h-scroll-auto"
          itemProvider={itemProvider}
          role="table"
        />
      </div>
    </Page>
  );
};


