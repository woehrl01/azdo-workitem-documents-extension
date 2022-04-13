import { FC } from "react";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import React from "react";
import { ILinkedDocument } from "../../useLinkedDocument";
import { getIcon } from "../../UriOptimizer";


/* important: needs to be a function and not a (function-) component.
 * otherwise the selection does not work */
const createDocumentTab = (d: ILinkedDocument): JSX.Element => {
    return <Tab
        key={d.url}
        className="document-tab"
        name={d.name}
        id={d.url}
        iconProps={{ iconName: getIcon(d.url) }}
    />;
}


export const Tabs: FC<{ documents: ILinkedDocument[]; onTabChanged: (id: string) => void; selectedTab: string; }> = ({ documents, onTabChanged, selectedTab }) => {
    if (documents.length <= 1) {
        return <></>;
    }

    return <TabBar
        onSelectedTabChanged={onTabChanged}
        selectedTabId={selectedTab}
        tabSize={TabSize.Compact}>
        {documents.map(createDocumentTab)}
    </TabBar>;
};


