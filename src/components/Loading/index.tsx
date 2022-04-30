import styles from './style.module.scss';
import { Spinner, SpinnerSize } from 'azure-devops-ui/Spinner';

export const Loading = (): JSX.Element =>
    <Spinner
        size={SpinnerSize.large}
        className={styles.loading}
        label="Loading..."
    />;
