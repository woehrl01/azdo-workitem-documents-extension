import * as SDK from 'azure-devops-extension-sdk';

import { IWorkItemChangedArgs, IWorkItemFieldChangedArgs, IWorkItemLoadedArgs, IWorkItemNotificationListener } from 'azure-devops-extension-api/WorkItemTracking';
import { Noop } from 'components/Common';
import { useCallback, useEffect, useRef } from 'react';
import { useEffectOnce } from 'usehooks-ts';

const registerWorkItemChangeHandler = async (callback: () => void): Promise<void> => {
    await SDK.init({ loaded: false });
    SDK.register(SDK.getContributionId(), () => ({
        onLoaded(_: IWorkItemLoadedArgs): void {
            callback();
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
    /* call the callback initially if events have
     * been missed because of later loading */
    callback();
};

export const useWorkItemChangedHandler = (handler: () => void): void => {
    const savedHandler = useRef(handler);
    const lastExecuted = useRef<number>(0);
    const interval = 500;

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    const callback = useCallback(() => {
        const now = Date.now();
        if (now >= lastExecuted.current + interval) {
            lastExecuted.current = now;
            savedHandler.current();
        }
    }, [savedHandler, lastExecuted]);

    useEffectOnce(() => {
        registerWorkItemChangeHandler(callback);
    });
}
