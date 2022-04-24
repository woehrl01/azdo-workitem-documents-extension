import { NoProps } from 'components/Common'
import { FC, useEffect } from 'react'
import * as SDK from 'azure-devops-extension-sdk'
import { Button } from 'azure-devops-ui/Button';

const dismiss = (): void => {
    const config = SDK.getConfiguration();
    config.dialog.close();
}

export const Dialog: FC<NoProps> = () => {

    useEffect(() => {
        const register = async (): Promise<void> => {
            await SDK.ready();
            const config = SDK.getConfiguration();
            console.log(JSON.stringify(config))
            SDK.resize(400, 400);
        }
        register();
    }, []);

    return <div className="sample-panel flex-column flex-grow">
        Hallo Welt
        <Button onClick={dismiss}>Dismiss</Button>
    </div>
}
