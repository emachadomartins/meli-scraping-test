import { Page } from 'puppeteer';
import { BrowserService } from '../services';

export abstract class Step {
  public page: Page;
  public browserService: BrowserService;

  public abstract execute(): Promise<void>;

  public prepare(page: Page) {
    this.page = page;
    return this;
  }
}
