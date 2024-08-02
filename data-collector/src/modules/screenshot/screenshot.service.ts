import { Injectable, StreamableFile } from '@nestjs/common';
import { FileService } from '../../services/file.service';

@Injectable()
export class ScreenshotService {
  getScreenshot(taskId: string): StreamableFile {
    const file = FileService.stream(`output/${taskId}/screenshot.jpeg`);
    return new StreamableFile(file);
  }
}
