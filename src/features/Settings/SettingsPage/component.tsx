import { FC } from 'react';

import { NoProps } from 'components/Common';
import { Page } from 'azure-devops-ui/Page';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import { TextField, TextFieldWidth } from 'azure-devops-ui/TextField';
import styles from './style.module.scss';
import { useStoredValue } from 'hooks/useStoredValue';
import { Loading } from 'components/Loading';

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
      </div>
    </Page>
  );
};


