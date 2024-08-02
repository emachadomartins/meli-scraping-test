import { Result, Step } from '../../types';
export declare class ProductService {
    getInfo(url: string, steps?: Step[]): Promise<Result>;
}
