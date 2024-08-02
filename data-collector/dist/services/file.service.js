"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const node_fs_1 = require("node:fs");
const node_util_1 = require("node:util");
const mkdirAsync = (0, node_util_1.promisify)(node_fs_1.mkdir);
const writeFileAsync = (0, node_util_1.promisify)(node_fs_1.writeFile);
const readFileAsync = (0, node_util_1.promisify)(node_fs_1.readFile);
class FileService {
    static async mkdir(path, recursive = true) {
        return mkdirAsync(path, { recursive });
    }
    static async write(destination, file, content) {
        console.log(destination);
        return mkdirAsync(destination, { recursive: true }).then(() => writeFileAsync([destination, file].join('/'), content));
    }
    static async read(path) {
        return readFileAsync(path);
    }
    static stream(path) {
        return (0, node_fs_1.createReadStream)(path);
    }
}
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map