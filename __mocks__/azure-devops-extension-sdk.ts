/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CommonServiceIds } from '../src/components/Common';

export const getAccessToken = () => Promise.resolve('token');

export const ready = () => Promise.resolve();
export const init = () => { };

const __storedData = {}

export const __setStoredData = <T>(key: string, data: T) => 
{
    __storedData[key] = data;
}

export const getService = (serviceId: string) => {
    switch (serviceId) {
        case CommonServiceIds.ExtensionDataService:
            return {
                getExtensionDataManager: () => Promise.resolve(
                    {
                        setValue: () => Promise.resolve(),
                        getValue: (key: string) => Promise.resolve(__storedData[key])
                    }
                )
            }
        default:
            throw new Error('Unknown service id for mock:' + serviceId)
    }
};

export const register = () => { };
export const getContributionId = () => '';



