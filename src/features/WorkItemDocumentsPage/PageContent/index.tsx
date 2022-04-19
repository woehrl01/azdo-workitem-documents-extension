import { FC } from 'react';
import { optimizeUrl } from 'services/UriOptimizer';
import styles from './styles.module.scss';

export const PageContent: FC<{ url: string; }> = ({ url }) => {
    const optimizedUrl = optimizeUrl(url);
    return <iframe src={optimizedUrl} className={styles.frameContent} />;
};
