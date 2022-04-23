import { FC } from 'react';

import { NoProps } from 'components/Common';
import { Page } from 'azure-devops-ui/Page';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import { TextField, TextFieldWidth } from 'azure-devops-ui/TextField';
import styles from './style.module.scss';
import * as SDK from 'azure-devops-extension-sdk';
import { CommonServiceIds, IExtensionDataManager, IExtensionDataService } from 'azure-devops-extension-api';
import { useStoredValue } from 'hooks/useStoredValue';

export const SettingsPage: FC<NoProps> = () => {
  const { isLoading, value, setValue } = useStoredValue('settings', '0');

  if (isLoading) {
    return <></>
  }

  return (
    <Page className={styles.page}>
      <Header title="Embedded Documents" titleSize={TitleSize.Large} />
      <div className="page-content">
        <div>{value}</div>
        <TextField
          value={value}
          onChange={(e, newValue): void => setValue(newValue)}
          placeholder="Value"
          width={TextFieldWidth.standard}
        />
      </div>
    </Page>
  );
};

export async function getDataManager(): Promise<IExtensionDataManager> {
  const service = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
  const manager = await service.getExtensionDataManager(SDK.getContributionId(), await SDK.getAccessToken());
  return manager;
}

