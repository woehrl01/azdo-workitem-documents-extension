import * as SDK from 'azure-devops-extension-sdk';

import { IWorkItemChangedArgs, IWorkItemFieldChangedArgs, IWorkItemLoadedArgs, IWorkItemNotificationListener } from 'azure-devops-extension-api/WorkItemTracking';
import { Noop } from 'components/Common';
import React, { useEffect, useRef } from 'react';
import { useEffectOnce } from 'usehooks-ts';

const registerWorkItemChangeHandler = async (callbackRef: React.MutableRefObject<() => void>): Promise<void> => {
    await SDK.init({ loaded: false });
    SDK.register(SDK.getContributionId(), () => ({
        onLoaded(_: IWorkItemLoadedArgs): void {
            Noop();
        },
        onFieldChanged(_: IWorkItemFieldChangedArgs): void {
            callbackRef.current();
        },
        onSaved(_: IWorkItemChangedArgs): void {
            callbackRef.current();
        },
        onReset(_: IWorkItemChangedArgs): void {
            callbackRef.current();
        },
        onRefreshed(_: IWorkItemChangedArgs): void {
            callbackRef.current();
        },
        onUnloaded(_: IWorkItemChangedArgs): void {
            Noop();
        }
    } as IWorkItemNotificationListener));
    await SDK.notifyLoadSucceeded();
    await SDK.ready();
    /* call the callback initally if events have
     * been missed because of later loading */
    callbackRef.current();
};

export const useWorkItemChangeHandler = (handler: () => void): void => {
    const savedHandler = useRef(handler);
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffectOnce(() => {
        registerWorkItemChangeHandler(savedHandler);
    });
}
