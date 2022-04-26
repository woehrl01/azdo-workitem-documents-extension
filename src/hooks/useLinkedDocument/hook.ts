import { useCallback, useState } from 'react';
import { fetchCurrentDocuments, ILinkedDocument } from 'services/DocumentSource';
import { useWorkItemChangeHandler } from './registerWorkItemChangeHandler';

export interface IUseLinkedDocument {
    documents: ILinkedDocument[];
    isLoading: boolean;
}

export const useLinkedDocuments = (): IUseLinkedDocument => {
    const [documents, setDocuments] = useState<ILinkedDocument[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const updateCurrentDocuments = useCallback(async () => {
        setIsLoading(true);
        console.log('fetching and refreshing current documents');
        const fetchedDocuments = await fetchCurrentDocuments();
        console.log(`received ${fetchedDocuments.length} documents`);
        setDocuments(fetchedDocuments);
        setIsLoading(false);
    }, [setIsLoading, setDocuments]);

    useWorkItemChangeHandler(updateCurrentDocuments);

    return { documents, isLoading };
};





