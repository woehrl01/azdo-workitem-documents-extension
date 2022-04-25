import styles from './style.module.scss';
import './bowtie.css';

import { openAddDocumentDialog } from 'services/OpenDialog';

export const AddButton = (): JSX.Element => {
    return <div className={styles.buttonContainer}>
        <button
            className={styles.addDocument}
            onClick={(): void => { openAddDocumentDialog() }}
        >
            <i className="bowtie-icon bowtie-math-plus"></i>
            <span>Add document</span>
        </button>
    </div>
}
