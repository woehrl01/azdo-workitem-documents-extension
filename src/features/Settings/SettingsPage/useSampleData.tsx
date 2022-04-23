import { useEffect, useState } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import {
    CommonServiceIds, IHostNavigationService,
    ILocationService,
    IProjectPageService
} from 'azure-devops-extension-api';


export const useSampleData = (): Array<string> => {
    const [value, setValue] = useState<string>('');
    const [value2, setValue2] = useState<string>('');
    const [value3, setValue3] = useState<string>('');
    const [value4, setValue4] = useState<string>('');
    const [value5, setValue5] = useState<string>('');
    const [value6, setValue6] = useState<string>('');

    useEffect(() => {
        (async (): Promise<void> => {
            const user = await SDK.getUser();
            setValue(JSON.stringify(user));

            const context = await SDK.getExtensionContext();
            setValue2(JSON.stringify(context));

            const host = await SDK.getHost();
            setValue3(JSON.stringify(host));

            const project = await SDK.getService<IProjectPageService>(
                CommonServiceIds.ProjectPageService
            );
            setValue4(JSON.stringify(await project.getProject()));

            const navigation = await SDK.getService<IHostNavigationService>(
                CommonServiceIds.HostNavigationService
            );
            setValue5(JSON.stringify(await navigation.getPageRoute()));

            const location = await SDK.getService<ILocationService>(
                CommonServiceIds.LocationService
            );
            setValue6(JSON.stringify(await location.getServiceLocation()));
        })();
    }, []);
    return [value, value2, value3, value4, value5, value6];
};
