import { showRootComponent } from 'components/Common';
import { SettingsPage } from './SettingsPage';
import './styles.scss';
import * as SDK from 'azure-devops-extension-sdk';

SDK.init({ loaded: true }).then(() => {
    showRootComponent(<SettingsPage />);
});
