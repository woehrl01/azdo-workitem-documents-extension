import styles from './style.module.scss';
import { FC } from 'react';
import { Spinner, SpinnerSize } from 'azure-devops-ui/Spinner';
import { NoProps } from 'components/Common';

export const Loading: FC<NoProps> = () => <Spinner size={SpinnerSize.large} className={styles.loading} label="Loading..." />;
