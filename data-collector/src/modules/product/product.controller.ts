import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Result } from '../../types';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getInfo(@Query('url') url: string): Promise<Result> {
    return this.productService.getInfo(url);
  }
}
