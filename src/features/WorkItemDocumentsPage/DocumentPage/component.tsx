import styles from './style.module.scss';

import { useState, FC } from 'react';

import { Page } from 'azure-devops-ui/Page';

import { NoProps } from 'components/Common';

import { ILinkedDocument, useLinkedDocuments } from 'hooks/useLinkedDocument';
import { PageContent } from '../PageContent';
import { Tabs } from '../Tabs/component';
import { Empty } from '../Empty';
import { Loading } from 'components/Loading';

const fallbackToFirstPageIfNeeded = (url: string, existingDocuments: ILinkedDocument[]): string => {
    if (existingDocuments.findIndex(d => d.url === url) === -1) {
        return existingDocuments.map(d => d.url)?.find(() => true) || '';
    }
    return url
}

export const DocumentPage: FC<NoProps> = () => {
    const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string>('');
    const { documents, isLoading } = useLinkedDocuments();
    const documentUrlToShow = fallbackToFirstPageIfNeeded(selectedDocumentUrl, documents);

    if (isLoading) {
        return <Loading />
    }

    if (documents.length === 0) {
        return <Empty />;
    }

    return (
        <Page className={styles.documentHub} >
            <Tabs documents={documents} onTabChanged={setSelectedDocumentUrl} selectedTab={documentUrlToShow} />
            <PageContent url={documentUrlToShow} />
        </Page>
    );
}
