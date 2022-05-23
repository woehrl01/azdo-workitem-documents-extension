/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CommonServiceIds } from '../src/components/Common';

export const getAccessToken = () => Promise.resolve('token');

export const ready = () => Promise.resolve();
export const init = () => { };

let __mockedData = {}
export const __setMockedData = <T>(key: string, data: T) => 
{
    __mockedData[key] = data;
}

export const __resetMockedData = () => {
    __mockedData = {};
}

export const getService = (serviceId: string) => {
    switch (serviceId) {
        case CommonServiceIds.ExtensionDataService:
            return {
                getExtensionDataManager: () => Promise.resolve(
                    {
                        setValue: () => Promise.resolve(),
                        getValue: (key: string) => Promise.resolve(__mockedData[key])
                    }
                )
            }
        default:
            throw new Error('Unknown service id for mock:' + serviceId)
    }
};

export const register = () => { };
export const getContributionId = () => '';



