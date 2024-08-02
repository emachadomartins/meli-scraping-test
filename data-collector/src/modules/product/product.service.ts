import { Injectable } from '@nestjs/common';
import { BrowserService } from '../../services';
import { Result } from '../../types';

@Injectable()
export class ProductService {
  async getInfo(url: string): Promise<Result> {
    const browserService = new BrowserService();

    return browserService.getInfo(url);
  }
}
