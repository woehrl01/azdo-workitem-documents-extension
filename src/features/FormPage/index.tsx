import { showRootComponent } from 'components/Common';
import { DocumentPage } from './DocumentPage/component';
import './styles.scss';
import * as SDK from 'azure-devops-extension-sdk';

SDK.init({ loaded: false }).then(() => {
    showRootComponent(<DocumentPage />);
});
