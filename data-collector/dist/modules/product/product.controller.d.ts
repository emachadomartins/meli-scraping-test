import { Result, Step } from '../../types';
import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getInfo({ url, steps }: {
        steps?: Step[];
        url: string;
    }): Promise<Result>;
}
