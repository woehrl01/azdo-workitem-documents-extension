import { ApplicationInsights } from '@microsoft/applicationinsights-web'

declare const __APP_INSIGHTS__: string;

const appInsights = new ApplicationInsights({
    config: {
        connectionString: __APP_INSIGHTS__,
    }
});

appInsights.loadAppInsights();

export const trackPageView = (): void => {
    appInsights.trackPageView();
}

export class Measure {
    constructor(readonly name: string, readonly properties?: { [key: string]: string }) {
        appInsights.startTrackEvent(name);
    }

    public stop(metrics?: { [key: string]: number }): void {
        appInsights.stopTrackEvent(this.name, this.properties, metrics);
    }
}

export const trackEvent = (name: string, properties?: { [key: string]: string }): void => {
    appInsights.trackEvent({ name }, properties);
}

