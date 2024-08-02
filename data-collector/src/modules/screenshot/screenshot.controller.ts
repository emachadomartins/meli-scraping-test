import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';

@Controller('screenshot')
export class ScreenshotController {
  constructor(private readonly productService: ScreenshotService) {}

  @Get(':taskId')
  @Header('content-type', 'image/jpeg')
  getInfo(@Param() { taskId }: { taskId: string }): StreamableFile {
    return this.productService.getScreenshot(taskId);
  }
}
