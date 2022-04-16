import { FC } from "react";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { ILinkedDocument } from "../../useLinkedDocument";
import { getIcon } from "../../UriOptimizer";
import styles from "./WorkItemDocumentsPage.scss";

/* important: needs to be a function and not a (function-) component.
 * otherwise the selection does not work */
const createDocumentTab = (d: ILinkedDocument): JSX.Element => <Tab
    key={d.url}
    className={styles.documentTab}
    name={d.name}
    id={d.url}
    iconProps={{ iconName: getIcon(d.url) }}
/>


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


