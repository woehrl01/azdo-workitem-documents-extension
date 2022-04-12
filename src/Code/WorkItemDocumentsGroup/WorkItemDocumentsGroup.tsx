import * as React from "react";
import { FC } from "react";
import { showRootComponent } from "../../Common";
import { useLinkedDocuments } from "../../useLinkedDocument";


export const WorkItemFormGroupComponent: FC<{}> = ({ }) => {
  const documents = useLinkedDocuments();
  return <ul>
    {documents.map(d => <li key={d.url}>d.url</li>)}
  </ul>
}

showRootComponent(<WorkItemFormGroupComponent />);
