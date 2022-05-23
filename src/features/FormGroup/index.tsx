import { showRootComponent } from 'components/Common';
import { Group } from './Group';
import './styles.scss';
import * as SDK from 'azure-devops-extension-sdk';

SDK.init({ loaded: false }).then(() => {
    showRootComponent(<Group />);
});
