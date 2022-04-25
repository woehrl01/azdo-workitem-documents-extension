import { NoProps } from 'components/Common'
import { FC, useCallback, useEffect, useState } from 'react'
import * as SDK from 'azure-devops-extension-sdk'
import { Button } from 'azure-devops-ui/Button';
import { TextField } from 'azure-devops-ui/TextField';
import { FormItem } from 'azure-devops-ui/FormItem';
import styles from './style.module.scss'
import { IWorkItemFormService, WorkItemTrackingServiceIds } from 'azure-devops-extension-api/WorkItemTracking';
import { useWindowSize } from 'usehooks-ts';

interface IConfigurationState {
    closeDialog: () => void;
}

interface IDocument {
    url: string;
    description: string;
}

const storeDocument = async ({ url, description }: IDocument): Promise<void> => {
    const workItemService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
    await workItemService.addWorkItemRelations([
        {
            rel: 'Hyperlink',
            url: url,
            attributes: {
                comment: description,
            }
        }
    ])
}

const useConfiguration = (): IConfigurationState => {
    const config = SDK.getConfiguration();
    return {
        closeDialog: (): void => { config.dialog.close(); }
    }
}

export const Dialog: FC<NoProps> = () => {
    const { closeDialog } = useConfiguration();
    const [url, setUrl] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const hasError = url.length === 0;
    const { width, height } = useWindowSize()

    const handleSubmit = useCallback(() => {
        storeDocument({ url, description }).then(() => {
            closeDialog();
        });
    }, [url, description]);

    useEffect(() => {
        SDK.resize();
        SDK.notifyLoadSucceeded();

        /* resize after a delay to 'fix' an edgecase behaviour on host frame side */
        const timeout = setTimeout(() => { SDK.resize() }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        SDK.resize();
    }, [width, height]);

    return <div className={styles.dialog}>
        <div className={styles.content}>
            <FormItem label="Document URL" className={styles.label} error={hasError} >
                <TextField
                    value={url}
                    onChange={(_, value): void => setUrl(value)}
                    placeholder="https://..."
                />
            </FormItem>
            <FormItem label="Title" className={styles.label}>
                <TextField
                    value={description}
                    onChange={(_, value): void => setDescription(value)}
                    placeholder="Optional"
                />
            </FormItem>
        </div>
        <div className={styles.footer}>
            <Button onClick={handleSubmit} primary={true} disabled={hasError}>OK</Button>
            <Button onClick={closeDialog}>Cancel</Button>
        </div>
    </div >
}
