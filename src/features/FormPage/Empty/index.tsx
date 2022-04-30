import { ZeroData, ZeroDataActionType } from 'azure-devops-ui/ZeroData';
import noDocuments from './no_documents.png';
import styles from './style.module.scss';
import { openAddDocumentDialog } from 'services/OpenDialog';


export const Empty = (): JSX.Element => <ZeroData
    primaryText="No documents linked"
    className={styles.emptyData}
    secondaryText={<span>
        There are currently no documents linked. If you want to display a
        document here, add a reference of type <i>Hyperlink</i> to this work item.
    </span>}
    imageAltText="No documents"
    imagePath={noDocuments}
    actionType={ZeroDataActionType.ctaButton}
    actionText="Add document"
    onActionClick={(): void => { openAddDocumentDialog() }}
/>;
