import styles from "./WorkItemDocumentsPage.module.scss";
import "./Main.scss";

import { useState, FC } from "react";

import { Page } from "azure-devops-ui/Page";
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";

import { showRootComponent } from "../../Common";

import * as SDK from "azure-devops-extension-sdk";

import { ILinkedDocument, useLinkedDocuments } from "../../useLinkedDocument";
import { PageContent } from "./PageContent";
import { Tabs } from "./Tabs";
import { Empty } from "./Empty";

type NoProps = Record<string, never>

const fallbackToFirstPageIfNeeded = (url: string, existingDocuments: ILinkedDocument[]): string => {
    if (existingDocuments.findIndex(d => d.url === url) === -1) {
        return existingDocuments.map(d => d.url)?.find(() => true) || "";
    }
    return url
}


const Loading: FC<NoProps> = () => <Spinner size={SpinnerSize.large} className={styles.loading} label="Loading..." />;

const HubContent: FC<NoProps> = () => {
    const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string>("");
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

//SDK.init({ loaded: true });
showRootComponent(<HubContent />);