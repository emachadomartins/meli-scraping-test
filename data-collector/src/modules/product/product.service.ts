import { Injectable } from '@nestjs/common';
import { BrowserService } from '../../services';
import { Result, Step } from '../../types';

@Injectable()
export class ProductService {
  async getInfo(url: string, steps?: Step[]): Promise<Result> {
    const browserService = new BrowserService(url);

    return browserService.execute(steps);
  }
}
