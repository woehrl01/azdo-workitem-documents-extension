import 'azure-devops-ui/Core/override.css';
import { trackPageView } from 'components/AppInsights';
import 'es6-promise/auto';
import { ReactElement } from 'react';
import { render } from 'react-dom';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const Noop = (): void => { };

export function showRootComponent(component: ReactElement<unknown>): void {
    trackPageView();

    render(component, document.getElementById('root'));
}

/* copy of module to allow isolatedModules: true */
export const CommonServiceIds = {
    /**
     * Service for interacting with the extension data service
     */
    ExtensionDataService: 'ms.vss-features.extension-data-service',
    /**
     * Service for showing global message banners at the top of the page
     */
    GlobalMessagesService: 'ms.vss-tfs-web.tfs-global-messages-service',
    /**
     * Service for interacting with the host window's navigation (URLs, new windows, etc.)
     */
    HostNavigationService: 'ms.vss-features.host-navigation-service',
    /**
     * Service for interacting with the layout of the page: managing full-screen mode,
     * opening dialogs and panels
     */
    HostPageLayoutService: 'ms.vss-features.host-page-layout-service',
    /**
     * Service for getting URLs/locations from the host context
     */
    LocationService: 'ms.vss-features.location-service',
    /**
     * Exposes project-related information from the current page
     */
    ProjectPageService: 'ms.vss-tfs-web.tfs-page-data-service'
}

export const WorkItemTrackingServiceIds = {
    /**
     * Host service for opening the work item form
     */
    WorkItemFormNavigationService: 'ms.vss-work-web.work-item-form-navigation-service',
    /**
     * Host service for interacting with the currently active work item form (work item currently displayed in the UI).
     * Form service depends on the current active work item context. Will throw an error when there is no open work item.
     */
    WorkItemFormService: 'ms.vss-work-web.work-item-form'
}
