import { NoProps } from 'components/Common'
import { FC, useEffect, useState } from 'react'
import * as SDK from 'azure-devops-extension-sdk'
import { Button } from 'azure-devops-ui/Button';
import { TextField } from 'azure-devops-ui/TextField';
import { FormItem } from 'azure-devops-ui/FormItem';
import styles from './style.module.scss'

interface IConfigurationState {
    confirmDialog: () => void;
    abortDialog: () => void;
}

const useConfiguration = (): IConfigurationState => {
    const config = SDK.getConfiguration();
    return {
        confirmDialog: (): void => { config.dialog.close(); },
        abortDialog: (): void => { config.dialog.close(); }
    }
}

export const Dialog: FC<NoProps> = () => {
    const { abortDialog, confirmDialog } = useConfiguration();
    const [url, setUrl] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        SDK.resize();
        SDK.notifyLoadSucceeded();
    }, []);

    return <div className={styles.dialog}>
        <div className={styles.content}>
            <FormItem label="Document URL" className={styles.label}>
                <TextField
                    value={url}
                    onChange={(_, value): void => setUrl(value)}
                />
            </FormItem>
            <FormItem label="Description" className={styles.label}>
                <TextField
                    value={description}
                    onChange={(_, value): void => setDescription(value)}
                />
            </FormItem>
        </div>
        <div className={styles.footer}>
            <Button onClick={confirmDialog} primary={true}>OK</Button>
            <Button onClick={abortDialog}>Cancel</Button>
        </div>
    </div >
}
