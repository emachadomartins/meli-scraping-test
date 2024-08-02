import { Browser, launch, Page } from 'puppeteer';
import { FileService } from './file.service';
import { Result } from '../types';
import { v4 as uuid } from 'uuid';

export class BrowserService {
  #taskId: string;
  #browser?: Browser;
  #page?: Page;

  constructor() {
    this.#taskId = uuid();
  }

  get resultPath() {
    return `output/${this.#taskId}`;
  }

  public async getBrowser(): Promise<Browser> {
    if (this.#browser) return this.#browser;
    const browser = await launch({});
    this.#browser = browser;
    return browser;
  }

  public async close() {
    if (this.#browser) await this.#browser.close();
  }

  public async getPage(): Promise<Page> {
    if (this.#page) return this.#page;
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    this.#page = page;
    return page;
  }

  public async exportFile(content: string | Buffer, fileName: string) {
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
    return FileService.write(this.resultPath, fileName, buffer);
  }

  public async getInfo(url: string): Promise<Result> {
    return {
      url,
    };
  }
}
