import { Module } from '@nestjs/common';
import {
  ProductController,
  ProductService,
  ScreenshotController,
  ScreenshotService,
} from './modules';

@Module({
  imports: [],
  controllers: [ProductController, ScreenshotController],
  providers: [ProductService, ScreenshotService],
})
export class AppModule {}
