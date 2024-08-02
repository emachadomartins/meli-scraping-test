import { PuppeteerLifeCycleEvent } from 'puppeteer';
interface BaseStep {
    wait?: number;
    critical?: boolean;
}
interface ClickStep extends BaseStep {
    step: 'click';
    selector: string;
}
interface ScrollStep extends BaseStep {
    step: 'scroll';
    distance?: number;
    delay?: number;
    direction?: 'top' | 'bottom' | 'infinity';
    selector?: string;
}
interface NavigateStep extends BaseStep {
    step: 'navigate';
    url: string;
    event?: PuppeteerLifeCycleEvent;
    timeout?: number;
}
interface InfoStep extends BaseStep {
    step: 'info';
    key: string;
    script: string;
}
interface ExportStep extends BaseStep {
    step: 'export';
    name?: string;
}
export type Step = ClickStep | ScrollStep | NavigateStep | InfoStep | ExportStep;
export {};
