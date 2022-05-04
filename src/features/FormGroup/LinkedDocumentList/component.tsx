import styles from './style.module.scss';
import '../BowtieIcons/bowtie.css';

import { Link } from 'azure-devops-ui/Link'
import { Icon } from 'azure-devops-ui/Icon';
import { Ago } from 'azure-devops-ui/Ago';

import { AgoFormat } from 'azure-devops-ui/Utilities/Date';
import { ILinkedDocument } from 'hooks/useLinkedDocument';
import { getIcon } from 'services/UriOptimizer';
import { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import * as SDK from 'azure-devops-extension-sdk';
import { IWorkItemFormService, WorkItemTrackingServiceIds } from 'azure-devops-extension-api/WorkItemTracking';
import { css } from 'azure-devops-ui/Util';

type DocumentProps = {
  document: ILinkedDocument;
}

const deleteDocument = async (url: string): Promise<void> => {
  const workItemService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);

  const currentRelations = await workItemService.getWorkItemRelations()
  const toDeleteRelation = currentRelations.filter(r => r.url === url);

  await workItemService.removeWorkItemRelations(toDeleteRelation)
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

const DeleteButton = ({ onClick }: { onClick: () => void }): JSX.Element => (
  <button onClick={onClick} className={styles.laDocumentDelete} aria-label="Remove document">
    <i className="bowtie-icon bowtie-edit-delete"></i>
  </button>
);

const Document = ({ document }: DocumentProps): JSX.Element => {
  const deleteThisDocument = useCallback(() => {
    deleteDocument(document.url);
  }, [document.url]);

  const canDelete = document.addedDate !== undefined;

  return (
    <div className={css(styles.laItem, canDelete ? styles.laItemCanDelete : null)}>
      <div className={styles.laItemWrapper}>
        <PrimaryData document={document} />
        <AdditionalData document={document} />
      </div>
      {canDelete && <DeleteButton onClick={deleteThisDocument} />}
    </div>
  )
}

interface LinkedDocumentListProps {
  documents: ILinkedDocument[];
}

const LinkedDocumentListInternal = ({ documents }: LinkedDocumentListProps): JSX.Element => {
  return <>
    {documents.map(d => <Document key={d.url} document={d} />)}
  </>
}

export const LinkedDocumentList = memo(LinkedDocumentListInternal, isEqual);

