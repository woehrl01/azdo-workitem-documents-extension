import { FC } from 'react';
import { ZeroData } from 'azure-devops-ui/ZeroData';
import noDocuments from './no_documents.png';
import { NoProps } from '../../Common';
import styles from './WorkItemDocumentsPage.module.scss';


export const Empty: FC<NoProps> = () => <ZeroData
    primaryText="No documents linked"
    className={styles.emptyData}
    secondaryText={<span>
        There are currently no documents linked. If you want to display a
        document here, add a reference of type <i>Hyperlink</i> to this work item.
    </span>}
    imageAltText="No documents"
    imagePath={noDocuments} />;
