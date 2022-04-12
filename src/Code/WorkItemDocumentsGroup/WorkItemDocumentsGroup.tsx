import "./WorkItemDocumentsGroup.scss";

import React from "react";
import { useEffect } from "react";
import * as SDK from "azure-devops-extension-sdk";
import { FC } from "react";

import { Link } from "azure-devops-ui/Link"
import { Icon } from "azure-devops-ui/Icon";
import { Ago } from "azure-devops-ui/Ago";

import { showRootComponent } from "../../Common";
import { ILinkedDocument, useLinkedDocuments } from "../../useLinkedDocument";
import { AgoFormat } from "azure-devops-ui/Utilities/Date";

const Document: FC<{ document: ILinkedDocument, additionalData?: string }> = ({ document, additionalData }) => {
  return (
    <div className="la-item">
      <div className="la-item-wrapper">
        <div className="la-artifact-data">
          <div className="la-primary-data">
            <Icon iconName="NavigateExternalInline" className="la-primary-icon" />
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
}

export const WorkItemFormGroupComponent: FC<{}> = ({ }) => {
  const { documents } = useLinkedDocuments();

  useEffect(() => {
    SDK.resize()
  }, [documents]);

  return <>
    {documents.map(d => <Document key={d.url} document={d} />)}
  </>
}

showRootComponent(<WorkItemFormGroupComponent />);
