import { FC } from "react";
import { optimizeUrl } from "../../UriOptimizer";

export const PageContent: FC<{ url: string; }> = ({ url }) => {
    var optimizedUrl = optimizeUrl(url);
    return <iframe src={optimizedUrl}></iframe>;
};
