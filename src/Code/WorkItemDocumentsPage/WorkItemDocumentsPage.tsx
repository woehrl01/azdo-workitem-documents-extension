import "./WorkItemDocumentsPage.scss";

import { useState, FC } from "react";

import { Page } from "azure-devops-ui/Page";

import { ZeroData } from "azure-devops-ui/ZeroData";

import { showRootComponent } from "../../Common";
import React from "react";
import { ILinkedDocument, useLinkedDocuments } from "./useLinkedDocument";
import { PageContent } from "./PageContent";
import { Tabs } from "./Tabs";


const fallbackToFirstPageIfNeeded = (url: string, existingDocuments: ILinkedDocument[]) => {
    if (existingDocuments.findIndex(d => d.url == url) == -1) {
        return existingDocuments.map(d => d.url)?.find(() => true) || "";
    }
    return url
}

const HubContent: FC<{}> = ({ }) => {
    const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string>("");
    const documents = useLinkedDocuments();
    const documentUrlToShow = fallbackToFirstPageIfNeeded(selectedDocumentUrl, documents);

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

const Empty: FC<{}> = ({ }) => {
    return <ZeroData
        primaryText="No documents linked"
        className="empty-data"
        secondaryText={
            <span>
                There are currently no documents linked. If you want to display a
                document here, add a reference of type <i>Hyperlink</i> to this work item.
            </span>
        }
        imageAltText="No documents"
        imagePath="no_documents.svg"
    />
}

showRootComponent(<HubContent />);