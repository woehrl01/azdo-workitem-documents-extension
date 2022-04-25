import styles from './style.module.scss';
import './bowtie.css';

import { NoProps } from 'components/Common';
import { openAddDocumentDialog } from 'services/OpenDialog';
import { FC } from 'react';

export const AddButton: FC<NoProps> = () => {

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
