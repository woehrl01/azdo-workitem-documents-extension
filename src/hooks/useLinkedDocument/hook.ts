import { useCallback, useRef, useState } from 'react';
import { fetchCurrentDocuments, ILinkedDocument } from 'services/DocumentSource';
import { useWorkItemChangedHandler } from 'hooks/useWorkItemChangedHandler';
import { Measure } from 'components/AppInsights';

export interface IUseLinkedDocument {
    documents: ILinkedDocument[];
    isLoading: boolean;
}

export const useLinkedDocuments = (): IUseLinkedDocument => {
    const [documents, setDocuments] = useState<ILinkedDocument[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const documentsFetchedCount = useRef<number | null>(null);

    const updateCurrentDocuments = useCallback(async () => {
        setIsLoading(true);
        console.log('fetching and refreshing current documents');

        const measure = new Measure('loadDocuments');
        const fetchedDocuments = await fetchCurrentDocuments();
        if (documentsFetchedCount.current !== fetchedDocuments.length) {
            documentsFetchedCount.current = fetchedDocuments.length;
            measure.stop({ documentsCount: fetchedDocuments.length });
        }
        console.log(`received ${fetchedDocuments.length} documents`);
        setDocuments(fetchedDocuments);
        setIsLoading(false);
    }, [setIsLoading, setDocuments]);

    useWorkItemChangedHandler(updateCurrentDocuments);

    return { documents, isLoading };
};





