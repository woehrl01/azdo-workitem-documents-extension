import { useEffect } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { AddButton } from '../AddButton';
import * as SDK from 'azure-devops-extension-sdk';
import { LinkedDocumentList } from '../LinkedDocumentList';
import { useLinkedDocuments } from 'hooks/useLinkedDocument';

const resizeHostFrame = (): void => {
    SDK.resize()
    console.debug('resize called')
}

export const Group = (): JSX.Element => {
    const { documents } = useLinkedDocuments();
    const numberOfDocuments = documents.length;
    const numberOfAddtionalInfos = documents.filter(d => !!d.addedDate).length;

    /* we need to resize the group everytime the hosting frame is resized 
     * This can be due to collapse/expand of the group or the browser windows
     * size changes, etc. */
    const { width, height } = useWindowSize();
    useEffect(resizeHostFrame, [width, height, numberOfDocuments, numberOfAddtionalInfos]);

    return <div>
        <AddButton />
        <LinkedDocumentList documents={documents} />
    </div>
}
