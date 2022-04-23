import { showRootComponent } from 'components/Common';
import { SettingsPage } from './SettingsPage/component';

import * as SDK from 'azure-devops-extension-sdk';
import './styles.scss';

(async (): Promise<void> => {
    await SDK.init();
    showRootComponent(<SettingsPage />);
})();



