import "./WorkItemDocumentsPage.scss";

import { useState, FC } from "react";

import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";

import { showRootComponent } from "../../Common";
import React from "react";
import { ILinkedDocument, useLinkedDocuments } from "./useLinkedDocument";

const PageContent: FC<{ url: string }> = ({ url }) => {
    var optimizedUrl = url;
    switch (true) {
        case /^https:\/\/docs\.google\.com\//.test(url):
            optimizedUrl = `${url}?rm=minimal`
            break;
        case /^https:\/\/drive\.google\.com\/drive\/folders\//.test(url):
            const folderId = /folders\/([^?]*)/.exec(url)?.[1];
            if (folderId) {
                optimizedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
            }
            break;
        case /^https:\/\/app.diagrams.net\/#/.test(url):
            const diagramId = /#(.*)/.exec(url)?.[1];
            if (diagramId) {
                const editUrl = encodeURIComponent(url);
                optimizedUrl = `https://viewer.diagrams.net/?highlight=0000ff&edit=${editUrl}&layers=1&nav=1#${diagramId}`;
            }
            break;

    }
    return <iframe src={optimizedUrl}></iframe>
}

const fallbackToFirstPageIfNeeded = (url: string, existingDocuments: ILinkedDocument[]) => {
    if (existingDocuments.findIndex(d => d.url == url) == -1) {
        return existingDocuments.map(d => d.url)?.find(() => true) || "";
    }
    return url
}

const HubContent: FC<{}> = ({ }) => {
    const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string>("");
    const documents = useLinkedDocuments();
    const docUrltoShow = fallbackToFirstPageIfNeeded(selectedDocumentUrl, documents);

    return (
        <Page className="document-hub flex-grow" >
            {documents.length > 1 &&
                <TabBar
                    onSelectedTabChanged={setSelectedDocumentUrl}
                    selectedTabId={docUrltoShow}
                    tabSize={TabSize.Compact}>

                    {documents.map(t => <Tab key={t.url} name={t.name} id={t.url} />)}
                </TabBar>
            }

            <PageContent url={docUrltoShow} />
        </Page>
    );
}

showRootComponent(<HubContent />);