import * as SDK from 'azure-devops-extension-sdk';

import { IWorkItemChangedArgs, IWorkItemFieldChangedArgs, IWorkItemLoadedArgs, IWorkItemNotificationListener } from 'azure-devops-extension-api/WorkItemTracking';
import { Noop } from 'components/Common';

export const registerWorkItemChangeHandler = async (callback: () => void): Promise<void> => {
    await SDK.init({ loaded: false });
    SDK.register(SDK.getContributionId(), () => ({
        onLoaded(_: IWorkItemLoadedArgs): void {
            Noop();
        },
        onFieldChanged(_: IWorkItemFieldChangedArgs): void {
            callback();
        },
        onSaved(_: IWorkItemChangedArgs): void {
            callback();
        },
        onReset(_: IWorkItemChangedArgs): void {
            callback();
        },
        onRefreshed(_: IWorkItemChangedArgs): void {
            callback();
        },
        onUnloaded(_: IWorkItemChangedArgs): void {
            Noop();
        }
    } as IWorkItemNotificationListener));
    await SDK.notifyLoadSucceeded();
    await SDK.ready();
    /* call the callback initally if events have
     * been missed because of later loading */
    callback();
};
