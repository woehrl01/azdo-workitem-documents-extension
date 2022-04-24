import { showRootComponent } from 'components/Common';
import { Dialog } from './Dialog';
import './styles.scss';
import * as SDK from 'azure-devops-extension-sdk';

/* we load the dialog without directly notifying successs 
 * (loaded=false) so that we can directly set the correct
 * size from the main component. If we don't do this 
 * we will cause a scrollbar flicker on loading. */
SDK.init({ loaded: false }).then(() => {
    showRootComponent(<Dialog />);
});
