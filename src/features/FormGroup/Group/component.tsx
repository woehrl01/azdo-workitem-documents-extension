import { useEffect } from 'react';
import { useElementSize } from 'usehooks-ts';
import { AddButton } from '../AddButton';
import * as SDK from 'azure-devops-extension-sdk';
import { LinkedDocumentList } from '../LinkedDocumentList';

export const Group = (): JSX.Element => {
    const [ref, { width, height }] = useElementSize();

    useEffect(() => {
        SDK.resize()
    }, [width, height]);

    return <div ref={ref}>
        <AddButton />
        <LinkedDocumentList />
    </div>
}
