import { useEffect } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { AddButton } from '../AddButton';
import * as SDK from 'azure-devops-extension-sdk';
import { LinkedDocumentList } from '../LinkedDocumentList';

export const Group = (): JSX.Element => {
    const { width, height } = useWindowSize();
    const resize = (): void => {
        SDK.resize()
        console.log('resize')
    }
    useEffect(resize, [width, height]);

    return <div>
        <AddButton />
        <LinkedDocumentList onDocuments={resize} />
    </div>
}
