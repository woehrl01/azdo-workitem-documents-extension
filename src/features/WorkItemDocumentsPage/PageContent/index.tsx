import { FC } from 'react';
import { optimizeUrl } from 'services/UriOptimizer';

export const PageContent: FC<{ url: string; }> = ({ url }) => {
    const optimizedUrl = optimizeUrl(url);
    return <iframe src={optimizedUrl} />;
};
