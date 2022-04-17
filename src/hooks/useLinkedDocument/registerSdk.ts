import * as SDK from 'azure-devops-extension-sdk';

export const registerSdk = async (callback: () => void): Promise<void> => {
    await SDK.init({ loaded: true });
    SDK.register(SDK.getContributionId(), () => ({
        onLoaded(): void {
            callback();
        },
        onFieldChanged(): void {
            callback();
        },
        onReset(): void {
            callback();
        },
        onRefresh(): void {
            callback();
        }
    }));
    await SDK.ready();
    /* call the callback initally if events have
     * been missed because of later loading */
    callback();
};
