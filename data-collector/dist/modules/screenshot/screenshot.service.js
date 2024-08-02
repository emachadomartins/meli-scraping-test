"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotService = void 0;
const common_1 = require("@nestjs/common");
const file_service_1 = require("../../services/file.service");
let ScreenshotService = class ScreenshotService {
    getScreenshot(taskId) {
        const file = file_service_1.FileService.stream(`output/${taskId}/screenshot.jpeg`);
        return new common_1.StreamableFile(file);
    }
};
exports.ScreenshotService = ScreenshotService;
exports.ScreenshotService = ScreenshotService = __decorate([
    (0, common_1.Injectable)()
], ScreenshotService);
//# sourceMappingURL=screenshot.service.js.map