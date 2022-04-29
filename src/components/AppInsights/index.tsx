import { ApplicationInsights } from '@microsoft/applicationinsights-web'

declare const __APP_INSIGHTS__: string;

const IsAppInsightDisabled = !__APP_INSIGHTS__;

const appInsights = new ApplicationInsights({
    config: {
        connectionString: __APP_INSIGHTS__,
    }
});

if (!IsAppInsightDisabled) {
    appInsights.loadAppInsights();
}

export const trackPageView = (): void => {
    if (IsAppInsightDisabled) { return }
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
    if (IsAppInsightDisabled) { return }

    appInsights.trackEvent({ name }, properties);
}

