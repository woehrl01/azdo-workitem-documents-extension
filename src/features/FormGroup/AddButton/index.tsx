import styles from './style.module.scss';
import '../BowtieIcons/bowtie.css';

import { openAddDocumentDialog } from 'services/OpenDialog';
import { memo } from 'react';

const AddButtonInternal = (): JSX.Element => {
    return <div className={styles.buttonContainer}>
        <button
            className={styles.addDocument}
            onClick={openAddDocumentDialog}
        >
            <i className="bowtie-icon bowtie-math-plus"></i>
            <span>Add document</span>
        </button>
    </div>
}

export const AddButton = memo(AddButtonInternal)
