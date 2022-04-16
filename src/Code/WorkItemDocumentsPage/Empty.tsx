import { FC } from "react";
import { ZeroData } from "azure-devops-ui/ZeroData";
import doDocuments from './no_documents.png';

export const Empty: FC<{}> = () => {
    return <ZeroData
        primaryText="No documents linked"
        className="empty-data"
        secondaryText={<span>
            There are currently no documents linked. If you want to display a
            document here, add a reference of type <i>Hyperlink</i> to this work item.
        </span>}
        imageAltText="No documents"
        imagePath={doDocuments} />;
};
