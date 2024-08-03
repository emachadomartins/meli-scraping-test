"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const node_fs_1 = require("node:fs");
const node_util_1 = require("node:util");
const mkdirAsync = (0, node_util_1.promisify)(node_fs_1.mkdir);
const writeFileAsync = (0, node_util_1.promisify)(node_fs_1.writeFile);
const readFileAsync = (0, node_util_1.promisify)(node_fs_1.readFile);
const renameAsync = (0, node_util_1.promisify)(node_fs_1.rename);
const readdirAsync = (0, node_util_1.promisify)(node_fs_1.readdir);
const rmAsync = (0, node_util_1.promisify)(node_fs_1.rm);
class FileService {
    static async mkdir(path, recursive = true) {
        return mkdirAsync(path, { recursive });
    }
    static async write(destination, file, content) {
        return mkdirAsync(destination, { recursive: true }).then(() => writeFileAsync([destination, file].join('/'), content));
    }
    static async read(path) {
        return readFileAsync(path);
    }
    static stream(path) {
        return (0, node_fs_1.createReadStream)(path);
    }
    static async move(path, newPath) {
        return renameAsync(path, newPath);
    }
    static async readdir(path, recursive = true) {
        return readdirAsync(path, {
            recursive,
            withFileTypes: true,
            encoding: 'utf-8',
        });
    }
    static async rm(path, recursive = true) {
        return rmAsync(path, { recursive });
    }
}
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map