export interface IUriOptimizer {
    getIcon(url: string): string;
    canHandle(uri: string): boolean;
    optimize(uri: string): string;
}

export class DelegateUriOptimizer implements IUriOptimizer {
    constructor(
        private readonly icon: string,
        private readonly regex: RegExp,
        private readonly optimizer: (uri: string, result: RegExpExecArray) => string
    ) { }

    canHandle(uri: string): boolean {
        return this.regex.test(uri);
    }

    optimize(uri: string): string {
        const result = this.regex.exec(uri);
        if (result) {
            return this.optimizer(uri, result);
        }
        return uri;
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    getIcon(url: string): string {
        return this.icon;
    }
}
