import { Body, Controller, Post } from '@nestjs/common';
import { Result, Step } from '../../types';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async getInfo(
    @Body() { url, steps }: { steps?: Step[]; url: string },
  ): Promise<Result> {
    return this.productService.getInfo(url, steps);
  }
}
