import { IUriOptimizer, DelegateUriOptimizer } from './DelegateUriOptimizer';

const handlers = [
    new DelegateUriOptimizer(
        'TextDocument',
        /^https:\/\/docs\.google\.com\//, (uri) => `${uri}?rm=minimal`
    ),
    new DelegateUriOptimizer(
        'FolderList',
        /^https:\/\/drive\.google\.com\/drive\/folders\/([^?]*)/,
        (_, result) => `https://drive.google.com/embeddedfolderview?id=${result[1]}#list`
    ),
    new DelegateUriOptimizer(
        'ViewDashboard',
        /^https:\/\/app.diagrams.net\/#(.*)/,
        (uri, result) => `https://viewer.diagrams.net/?highlight=0000ff&edit=${encodeURIComponent(uri)}&layers=1&nav=1#${result[1]}`
    ),
];

function foreachHandler<T>(uri: string, found: (handler: IUriOptimizer) => T, notFound: () => T): T {
    for (const h of handlers) {
        if (h.canHandle(uri)) {
            return found(h);
        }
    }
    return notFound();
}

export function isValidUrl(url: string): boolean {
    return foreachHandler(url, () => true, () => false);
}

export function optimizeUrl(url: string): string {
    return foreachHandler(url, (h) => h.optimize(url), () => url);
}

export function getIcon(url: string): string {
    return foreachHandler(url, (h) => h.getIcon(url), () => 'NavigateExternalInline');
}
