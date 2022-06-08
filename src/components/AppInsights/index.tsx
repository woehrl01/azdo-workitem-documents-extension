import { ApplicationInsights, ITelemetryItem } from '@microsoft/applicationinsights-web'

const IsAppInsightDisabled = !__APP_INSIGHTS__;

const appInsights = new ApplicationInsights({
    config: {
        connectionString: __APP_INSIGHTS__,
    }
});

const filteringFunction = (item: ITelemetryItem): boolean => {
    // filter out all items that are related two browser extensions
    // see: https://github.com/SeleniumHQ/selenium-ide/issues/326
    // see: https://github.com/honeypotio/staticpages/issues/779
    if (/^chrome-extension/.test(item.data?.['url'] || '')) {
        return false;
    }
    return true;
};

if (!IsAppInsightDisabled) {
    appInsights.addTelemetryInitializer(filteringFunction);
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

