import {
  createReadStream,
  mkdir,
  readFile,
  writeFile,
  rename,
  readdir,
  rm,
} from "node:fs";
import { promisify } from "node:util";

const mkdirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);
const renameAsync = promisify(rename);
const readdirAsync = promisify(readdir);
const rmAsync = promisify(rm);

// Classe que realiza no OS operações de arquivos e diretorios
export class FileService {
  static async mkdir(path: string, recursive = true) {
    return mkdirAsync(path, { recursive });
  }

  static async write(
    destination: string,
    file: string,
    content: string | Buffer
  ) {
    return mkdirAsync(destination, { recursive: true }).then(() =>
      writeFileAsync([destination, file].join("/"), content)
    );
  }

  static async read(path: string) {
    return readFileAsync(path);
  }

  static stream(path: string) {
    return createReadStream(path);
  }

  static async move(path: string, newPath: string) {
    return renameAsync(path, newPath);
  }

  static async readdir(path: string, recursive = true) {
    return readdirAsync(path, {
      recursive,
      withFileTypes: true,
      encoding: "utf-8",
    });
  }

  static async rm(path: string, recursive = true) {
    return rmAsync(path, { recursive });
  }
}
