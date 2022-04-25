import styles from './style.module.scss';

import { useEffect, FC } from 'react';
import * as SDK from 'azure-devops-extension-sdk';

import { Link } from 'azure-devops-ui/Link'
import { Icon } from 'azure-devops-ui/Icon';
import { Ago } from 'azure-devops-ui/Ago';

import { AgoFormat } from 'azure-devops-ui/Utilities/Date';
import { NoProps } from 'components/Common';
import { ILinkedDocument, useLinkedDocuments } from 'hooks/useLinkedDocument';
import { getIcon } from 'services/UriOptimizer';
import { AddButton } from '../AddButton';

type DocumentProps = {
  document: ILinkedDocument;
}

const PrimaryData: FC<DocumentProps> = ({ document }) => {
  return (
    <div className={styles.laPrimaryData}>
      <Icon iconName={getIcon(document.url)} className={styles.laPrimaryIcon} />
      <Link href={document.url} target="_blank">
        {document.name}
      </Link>
    </div>
  );
}

const AdditionalData: FC<DocumentProps> = ({ document }) => {
  if (!document.addedDate) {
    return <></>
  }

  return (
    <div className={styles.laAdditionalData}>
      <div className={styles.laAdditionalDataItem}>
        <span className={styles.laText}>Added <Ago date={document.addedDate} format={AgoFormat.Extended} /></span>
      </div>
    </div>
  );
}

const Document: FC<DocumentProps> = ({ document }) => (
  <div className={styles.laItem}>
    <PrimaryData document={document} />
    <AdditionalData document={document} />
  </div>
)

export const LinkedDocumentList: FC<NoProps> = () => {
  const { documents } = useLinkedDocuments();

  useEffect(() => {
    SDK.resize()
  }, [documents]);

  return <>
    <AddButton />
    {documents.map(d => <Document key={d.url} document={d} />)}
  </>
}


