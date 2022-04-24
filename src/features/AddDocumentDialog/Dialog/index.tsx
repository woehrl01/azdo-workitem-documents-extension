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
        SDK.resize()
    }, []);

    return <div className="sample-panel flex-column flex-grow">
        Hallo Welt
        <Button onClick={dismiss}>Dismiss</Button>
    </div>
}
