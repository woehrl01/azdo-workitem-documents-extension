import { FC } from "react";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import React from "react";
import { ILinkedDocument } from "./useLinkedDocument";

const stripName = (name: string): string => {
    if (name.length > 25) {
        return name.substring(0, 25) + "..."
    }
    return name;
}


export const Tabs: FC<{ documents: ILinkedDocument[]; onTabChanged: (id: string) => void; selectedTab: string; }> = ({ documents, onTabChanged, selectedTab }) => {
    if (documents.length <= 1) {
        return <></>;
    }

    return <TabBar
        onSelectedTabChanged={onTabChanged}
        selectedTabId={selectedTab}
        tabSize={TabSize.Compact}>

        {documents.map(t => <Tab key={t.url} name={stripName(t.name)} id={t.url} />)}
    </TabBar>;
};
