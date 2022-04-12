import "./WorkItemDocumentsPage.scss";

import { useState, FC } from "react";

import { Page } from "azure-devops-ui/Page";
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";

import { showRootComponent } from "../../Common";
import React from "react";
import { ILinkedDocument, useLinkedDocuments } from "../../useLinkedDocument";
import { PageContent } from "./PageContent";
import { Tabs } from "./Tabs";
import { Empty } from "./Empty";


const fallbackToFirstPageIfNeeded = (url: string, existingDocuments: ILinkedDocument[]) => {
    if (existingDocuments.findIndex(d => d.url == url) == -1) {
        return existingDocuments.map(d => d.url)?.find(() => true) || "";
    }
    return url
}

const HubContent: FC<{}> = ({ }) => {
    const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string>("");
    const { documents, isLoading } = useLinkedDocuments();
    const documentUrlToShow = fallbackToFirstPageIfNeeded(selectedDocumentUrl, documents);

    if (isLoading) {
        return <Spinner size={SpinnerSize.large} className="loading" label="Loading..." />
    }

    if (documents.length == 0) {
        return <Empty />;
    }

    return (
        <Page className="document-hub flex-grow" >
            <Tabs documents={documents} onTabChanged={setSelectedDocumentUrl} selectedTab={documentUrlToShow} />
            <PageContent url={documentUrlToShow} />
        </Page>
    );
}

showRootComponent(<HubContent />);