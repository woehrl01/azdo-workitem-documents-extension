interface IUriOptimizer {
    canHandle(uri: string): boolean;
    optimize(uri: string, result: RegExpExecArray): string;
}

class DelegateUriOptimizer implements IUriOptimizer {
    private readonly regex: RegExp;
    private readonly optimizer: (uri: string, result: RegExpExecArray) => string;
    constructor(regex: RegExp, optimizer: (uri: string, result: RegExpExecArray) => string) {
        this.regex = regex;
        this.optimizer = optimizer;
    }

    canHandle(uri: string): boolean {
        return this.regex.test(uri);
    }
    optimize(uri: string): string {
        return this.optimizer(uri, this.regex.exec(uri)!);
    }
}

const handler = [
    new DelegateUriOptimizer(/^https:\/\/docs\.google\.com\//, (uri) => `${uri}?rm=minimal`),
    new DelegateUriOptimizer(/^https:\/\/drive\.google\.com\/drive\/folders\/([^?]*)/, (_, result) => `https://drive.google.com/embeddedfolderview?id=${result[1]}#list`),
    new DelegateUriOptimizer(/^https:\/\/app.diagrams.net\/#(.*)/, (uri, result) => `https://viewer.diagrams.net/?highlight=0000ff&edit=${encodeURIComponent(uri)}&layers=1&nav=1#${result[1]}`),
];

export function validUrl(url: string): boolean {
    for (let h of handler) {
        if (h.canHandle(url)) {
            return true;
        }
    }
    return false;
}

export function optimizeUrl(url: string): string {
    for (let h of handler) {
        if (h.canHandle(url)) {
            return h.optimize(url);
        }
    }
    return url;
}
