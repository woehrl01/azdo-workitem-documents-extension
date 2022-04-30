import { useCallback, useState } from 'react'
import * as SDK from 'azure-devops-extension-sdk'
import { Button } from 'azure-devops-ui/Button';
import { TextField } from 'azure-devops-ui/TextField';
import { FormItem } from 'azure-devops-ui/FormItem';
import styles from './style.module.scss'
import { IWorkItemFormService, WorkItemTrackingServiceIds } from 'azure-devops-extension-api/WorkItemTracking';
import { Measure, trackEvent } from 'components/AppInsights';

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

    const closeDialog = useCallback(() => {
        config.dialog.close();
    }, [config.dialog]);

    return {
        closeDialog: closeDialog
    }
}

export const Dialog = (): JSX.Element => {
    const { closeDialog } = useConfiguration();
    const [url, setUrl] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const hasError = url.length === 0;

    const handleSubmit = useCallback(() => {
        trackEvent('addDocumentDialog', { action: 'submit' });
        const measure = new Measure('storeDocument');
        storeDocument({ url, description }).then(() => {
            measure.stop();
            closeDialog();
        });
    }, [url, description, closeDialog]);

    const handleCancel = useCallback(() => {
        trackEvent('addDocumentDialog', { action: 'cancel' });
        closeDialog();
    }, [closeDialog]);

    const urlChanged = useCallback((_: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string) => {
        setUrl(value);
    }, []);

    const descriptionChanged = useCallback((_: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string) => {
        setDescription(value);
    }, []);

    return <div className={styles.dialog}>
        <div className={styles.content}>
            <FormItem label="Document" className={styles.label} error={hasError} >
                <TextField
                    value={url}
                    onChange={urlChanged}
                    placeholder="https://..."
                />
            </FormItem>
            <FormItem label="Title" className={styles.label}>
                <TextField
                    value={description}
                    onChange={descriptionChanged}
                    placeholder="Optional"
                />
            </FormItem>
        </div>
        <div className={styles.footer}>
            <Button onClick={handleSubmit} primary={true} disabled={hasError}>OK</Button>
            <Button onClick={handleCancel}>Cancel</Button>
        </div>
    </div >
}
