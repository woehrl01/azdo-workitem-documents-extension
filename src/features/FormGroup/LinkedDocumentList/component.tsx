import styles from './style.module.scss';

import { Link } from 'azure-devops-ui/Link'
import { Icon } from 'azure-devops-ui/Icon';
import { Ago } from 'azure-devops-ui/Ago';

import { AgoFormat } from 'azure-devops-ui/Utilities/Date';
import { ILinkedDocument } from 'hooks/useLinkedDocument';
import { getIcon } from 'services/UriOptimizer';

type DocumentProps = {
  document: ILinkedDocument;
}

const PrimaryData = ({ document }: DocumentProps): JSX.Element => {
  return (
    <div className={styles.laPrimaryData}>
      <Icon iconName={getIcon(document.url)} className={styles.laPrimaryIcon} />
      <Link href={document.url} target="_blank">
        {document.name}
      </Link>
    </div>
  );
}

const AdditionalData = ({ document }: DocumentProps): JSX.Element => {
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

const Document = ({ document }: DocumentProps): JSX.Element => (
  <div className={styles.laItem}>
    <PrimaryData document={document} />
    <AdditionalData document={document} />
  </div>
)

interface LinkedDocumentListProps {
  documents: ILinkedDocument[];
}

export const LinkedDocumentList = ({ documents }: LinkedDocumentListProps): JSX.Element => {
  return <>
    {documents.map(d => <Document key={d.url} document={d} />)}
  </>
}


