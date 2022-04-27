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
    private readonly startTime = Date.now();
    constructor(readonly name: string, readonly properties?: { [key: string]: string }) {
    }

    public stop(metrics?: { [key: string]: number }): void {
        const duration = Date.now() - this.startTime;
        trackEvent(this.name, { ...metrics, ...this.properties, duration });
    }
}

export const trackEvent = (name: string, properties?: { [key: string]: unknown }): void => {
    appInsights.trackEvent({ name }, properties);
}

