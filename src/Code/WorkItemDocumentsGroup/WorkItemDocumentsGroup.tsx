import "./WorkItemDocumentsGroup.scss";

import { useEffect, FC } from "react";
import * as SDK from "azure-devops-extension-sdk";

import { Link } from "azure-devops-ui/Link"
import { Icon } from "azure-devops-ui/Icon";
import { Ago } from "azure-devops-ui/Ago";

import { AgoFormat } from "azure-devops-ui/Utilities/Date";
import { NoProps, showRootComponent } from "../../Common";
import { ILinkedDocument, useLinkedDocuments } from "../../useLinkedDocument";
import { getIcon } from "../../UriOptimizer";

type DocumentProps = {
  document: ILinkedDocument;
}

const Document: FC<DocumentProps> = ({ document }) => (
  <div className="la-item">
    <div className="la-item-wrapper">
      <div className="la-artifact-data">
        <div className="la-primary-data">
          <Icon iconName={getIcon(document.url)} className="la-primary-icon" />
          <Link href={document.url} target="_blank">
            {document.name}
          </Link>
        </div>
        {
          document.addedDate &&
          <div className="la-additional-data">
            <div className="la-additional-data-item">
              <span className="la-text">Added <Ago date={document.addedDate} format={AgoFormat.Extended} /></span>
            </div>
          </div>
        }
      </div>
    </div>
  </div>
)

export const WorkItemFormGroupComponent: FC<NoProps> = () => {
  const { documents } = useLinkedDocuments();

  useEffect(() => {
    SDK.resize()
  }, [documents]);

  return <>
    {documents.map(d => <Document key={d.url} document={d} />)}
  </>
}

SDK.init({ loaded: true });

showRootComponent(<WorkItemFormGroupComponent />);
