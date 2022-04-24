import { showRootComponent } from 'components/Common';
import { Dialog } from './Dialog';
import './styles.scss';
import * as SDK from 'azure-devops-extension-sdk';

SDK.init({ loaded: true }).then(() => {
    showRootComponent(<Dialog />);
});
