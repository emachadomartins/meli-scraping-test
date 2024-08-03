import { Result, Step } from '../types';
export declare class BrowserService {
    #private;
    constructor(url: string);
    get resultPath(): string;
    private getBrowser;
    private close;
    private getPage;
    private exportFile;
    private log;
    private endNavigation;
    execute(steps?: Step[]): Promise<Result>;
    private evaluate;
    private evaluateScript;
    private click;
    private scroll;
    private navigate;
    private getInfo;
    private export;
    private select;
    private input;
    private captcha;
    private wait;
}
