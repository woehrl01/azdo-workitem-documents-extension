import 'azure-devops-ui/Core/override.css';
import { trackPageView } from 'components/AppInsights';
import 'es6-promise/auto';
import { ReactElement } from 'react';
import { render } from 'react-dom';


export type NoProps = Record<string, never>;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const Noop = (): void => { };

export function showRootComponent(component: ReactElement<unknown>): void {
    trackPageView();

    render(component, document.getElementById('root'));
}
