import {
  Browser,
  EvaluateFunc,
  launch,
  Page,
  PuppeteerLifeCycleEvent,
} from 'puppeteer';
import { v4 as uuid } from 'uuid';
import { Result, Step } from '../types';
import {
  ERROR_STATUS,
  isQuerySelector,
  normalize,
  convertFile,
} from '../utils';
import { FileService } from './file.service';

export class BrowserService {
  #taskId: string;
  #url: string;
  #browser?: Browser;
  #page?: Page;
  #info: Record<string, unknown> = {};
  #logs: string[] = [];
  #error?: string;
  #files: string[] = [];

  constructor(url: string) {
    this.#taskId = uuid();
    this.#url = url;
  }

  get resultPath() {
    return `output/${this.#taskId}`;
  }

  private async getBrowser(): Promise<Browser> {
    if (this.#browser) return this.#browser;
    const browser = await launch({ headless: false });
    this.#browser = browser;
    return browser;
  }

  private async close() {
    if (this.#browser) await this.#browser.close();
  }

  private async getPage(): Promise<Page> {
    if (this.#page) return this.#page;
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    this.#page = page;
    return page;
  }

  private async exportFile(content: string | Buffer, fileName: string) {
    this.#files.push(`${this.#taskId}/${fileName}`);
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
    return FileService.write(this.resultPath, fileName, buffer);
  }

  private async log(log: string) {
    this.#logs.push(log);
  }

  private async endNavigation(): Promise<Result> {
    await this.close();

    const result = {
      taskId: this.#taskId,
      url: this.#url,
      complete: !this.#error,
      ...(this.#error
        ? { error: this.#error }
        : {
            info: this.#info,
            files: [...this.#files, `${this.#taskId}/result.json`],
          }),
      logs: this.#logs,
    };

    await this.exportFile(JSON.stringify(result), 'result.json');

    return result;
  }

  public async execute(steps: Step[] = []): Promise<Result> {
    this.log(`Starting task '${this.#taskId}'`);

    const _steps: Step[] = [
      {
        step: 'navigate',
        url: this.#url,
        critical: true,
        wait: 1000,
      },
      ...steps,
      { step: 'wait', time: 1000 },
      { step: 'export' },
    ];

    let i = 0;

    for (const step of _steps) {
      try {
        this.log(`Starting step [${i}-${step.step}]`);
        switch (step.step) {
          case 'click':
            await this.click(step.selector);
            break;
          case 'navigate':
            await this.navigate(step.url, step.timeout, step.event);
            break;
          case 'scroll':
            await this.scroll(
              step.distance,
              step.delay,
              step.direction,
              step.selector,
            );
            break;
          case 'info':
            await this.getInfo(step.key, step.script);
            break;
          case 'export':
            await this.export(step.name);
            break;
          case 'captcha':
            await this.captcha(
              step.type,
              step.file_selector,
              step.response_selector,
            );
            break;
          case 'select':
            await this.select(step.selector, step.option);
            break;
          case 'input':
            await this.input(step.selector, step.value);
            break;
          case 'wait':
            await this.wait(step.time);
            break;
          default:
            throw new Error(`Invalid step provided`);
        }
        i++;
        if (step.wait) await this.wait(step.wait);
      } catch (error) {
        const err = error as Error;
        if (step.critical) {
          error = err.message ?? 'Unknown Error';
          this.log(`Error in step [${i}-${step.step}]: ${error}`);
          this.#error = error;
          break;
        }

        this.log(`Warning in step [${i}-${step.step}]: ${err.message}`);
      }
    }

    return this.endNavigation();
  }

  private async evaluate<
    P extends unknown[],
    F extends EvaluateFunc<P> = EvaluateFunc<P>,
  >(func: F, ...params: P) {
    const page = await this.getPage();
    return page.evaluate(func, ...params);
  }

  private async evaluateScript<T = void>(script: string): Promise<T> {
    const page = await this.getPage();

    return page.evaluate(script) as Promise<T>;
  }

  private async click(selector: string) {
    if (!selector) throw new Error('No selector provided');
    return this.evaluate(
      (selector: string, useEval: boolean) => {
        const element = (
          useEval ? eval(selector) : document.querySelector(selector)
        ) as HTMLElement;

        if (!element) return false;

        element.click();

        return true;
      },
      selector,
      isQuerySelector(selector),
    ).then((result) => {
      if (!result) throw new Error(`Element '${selector}' not exists `);
    });
  }

  private async scroll(
    distance = 200,
    delay = 500,
    direction?: 'top' | 'bottom' | 'infinity',
    selector?: string,
  ) {
    const promise = selector
      ? () =>
          this.evaluate(
            (selector: string, useEval: boolean) => {
              const element = (
                useEval ? eval(selector) : document.querySelector(selector)
              ) as HTMLElement;

              if (!element) return false;

              element.scrollBy(0, +element.scrollHeight / 3);

              return true;
            },
            selector,
            isQuerySelector(selector),
          ).then((res) => {
            if (!res) throw new Error(`Element '${selector}' not exists`);
            return res;
          })
      : () =>
          this.evaluate(
            (
              distance: number,
              delay: number,
              direction?: 'top' | 'bottom' | 'infinity',
            ) => {
              if (direction === 'infinity')
                return new Promise<boolean>((resolve) => {
                  let totalHeight = 0;
                  const timer = setInterval(() => {
                    const { scrollHeight } = document.body;

                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight - window.innerHeight) {
                      clearInterval(timer);
                      resolve(true);
                    }
                  }, delay);
                });

              if (!direction)
                return new Promise<boolean>((resolve) => {
                  let i = 0;
                  const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    if (++i === 3) {
                      clearInterval(timer);
                      resolve(true);
                    }
                  }, delay);
                });

              window.scrollBy(
                0,
                direction === 'bottom' ? document.body.scrollHeight : 0,
              );
              return true;
            },
            distance,
            delay,
            direction,
          ) as Promise<boolean>;

    return promise();
  }

  private async navigate(
    url: string,
    timeout = 60000,
    event: PuppeteerLifeCycleEvent = 'networkidle0',
  ) {
    if (!url) throw new Error('No url provided');
    const page = await this.getPage();

    const response = await page
      .goto(url, { timeout, waitUntil: event })
      .catch((err: Error) => {
        throw new Error(`[${err.message}] while navigating to '${url}'`);
      });

    if (!response) throw new Error(`No response for '${url}'`);

    const ok = response.ok();
    const status = response.status();

    if (!ok) throw new Error(`URL '${url}' can't be accessed`);

    if (ERROR_STATUS.includes(status))
      throw new Error(`Get HttpStatus ${status} while navigating to '${url}'`);
  }

  private async getInfo(key: string, script: string) {
    if (!script) throw new Error('No script Provided');
    if (!key) throw new Error('No infoKey Provided');
    const result = await this.evaluateScript<unknown>(script).catch(
      (err: Error) => {
        throw new Error(`[${err.message}] while getting info '${key}'`);
      },
    );

    if (!result) throw new Error(`No info found for '${key}'`);

    if (this.#info[key])
      throw new Error(
        `Info '${key}' already setted for previous steps with value '${JSON.stringify({ [key]: this.#info[key] })}'`,
      );

    this.#info[key] = normalize(result);
  }

  private async export(name = 'index') {
    const page = await this.getPage();

    const screenshot = await page.screenshot({ fullPage: true });

    await this.exportFile(screenshot, 'screenshot.jpeg');

    const index = await page.content();

    await this.exportFile(index, `${name}.html`);
  }

  private async select(selector: string, option: string) {
    await this.evaluate(
      (selector: string, useEval: boolean, value: string) => {
        const element = (
          useEval ? eval(selector) : document.querySelector(selector)
        ) as HTMLSelectElement;

        const option = Array.from(element.options).find(
          (opt) =>
            opt.getAttribute('value').includes(value) ||
            opt.innerText.includes(value),
        );

        option.setAttribute('selected', 'selected');
      },
      selector,
      isQuerySelector(selector),
      option,
    );
  }

  private async input(selector: string, value: string) {
    await this.evaluate(
      (selector: string, useEval: boolean, value: string) => {
        const element = (
          useEval ? eval(selector) : document.querySelector(selector)
        ) as HTMLInputElement;

        element.value = value;
      },
      selector,
      isQuerySelector(selector),
      value,
    );
  }

  private async captcha(
    type: 'image' | 'audio',
    fileSelector: string,
    responseSelector: string,
  ) {
    if (!type) throw new Error('No captcha type provided');
    if (!fileSelector) throw new Error('No fileSelector provided');
    if (!responseSelector) throw new Error('No responseSelector provided');

    const page = await this.getPage();
    const client = await page.createCDPSession();

    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: this.resultPath,
    });

    const url = await page.evaluate(
      (selector: string, useEval: boolean) => {
        const element = (
          useEval ? eval(selector) : document.querySelector(selector)
        ) as HTMLElement;
        if (!element) throw new Error(`Element '${selector}' not found`);
        return element.getAttribute('src');
      },
      fileSelector,
      isQuerySelector(fileSelector),
    );

    if (!url) throw new Error(`No captcha found in selector '${fileSelector}'`);
    await this.wait(1000);

    await page.evaluate(
      (url: string, type: string) => {
        const anchor = document.createElement('a') as HTMLElement;
        anchor.setAttribute('download', `captcha_${type}`);
        anchor.setAttribute(
          'href',
          url.startsWith(location.protocol)
            ? url
            : `${location.protocol}//${location.host}/${url}`,
        );
        anchor.click();
      },
      url,
      type,
    );

    await this.wait(2000);

    const { resolution, file, fileName } = await convertFile(
      this.resultPath,
      type,
    );

    await page.focus(responseSelector);
    await page.keyboard.type(resolution.captcha);

    await this.wait(1000);
    await this.exportFile(file, fileName);
  }

  private async wait(time: number) {
    await new Promise((resolve) => setTimeout(() => resolve(null), time));
  }
}
