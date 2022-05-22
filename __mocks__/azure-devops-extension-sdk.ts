/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CommonServiceIds } from '../src/components/Common';

export const getAccessToken = () => Promise.resolve('token');

export const ready = () => Promise.resolve();
export const init = () => { };

export const getService = (serviceId: string) => {
    switch (serviceId) {
        case CommonServiceIds.ExtensionDataService:
            return {

                getExtensionDataManager: () => Promise.resolve(
                    {
                        setValue: () => Promise.resolve(),
                        getValue: () => Promise.resolve([])
                    })
            }
        default:
            throw new Error('Unknown service id for mock:' + serviceId)
    }
};

export const register = () => { };
export const getContributionId = () => '';



