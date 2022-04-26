import { useEffect } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { AddButton } from '../AddButton';
import * as SDK from 'azure-devops-extension-sdk';
import { LinkedDocumentList } from '../LinkedDocumentList';

const resizeHostFrame = (): void => {
    SDK.resize()
    console.debug('resize called')
}

export const Group = (): JSX.Element => {

    /* we need to resize the group everytime the hosting frame is resized 
     * This can be due to collapse/expand of the group or the browser windows
     * size changes, etc. */
    const { width, height } = useWindowSize();
    useEffect(resizeHostFrame, [width, height]);

    return <div>
        <AddButton />
        <LinkedDocumentList onDocuments={resizeHostFrame} />
    </div>
}
