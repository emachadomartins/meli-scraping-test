import { StreamableFile } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';
export declare class ScreenshotController {
    private readonly productService;
    constructor(productService: ScreenshotService);
    getInfo({ taskId }: {
        taskId: string;
    }): StreamableFile;
}
