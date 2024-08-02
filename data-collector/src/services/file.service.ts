import { createReadStream, mkdir, readFile, writeFile } from 'node:fs';
import { promisify } from 'node:util';

const mkdirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

export class FileService {
  static async mkdir(path: string, recursive = true) {
    return mkdirAsync(path, { recursive });
  }

  static async write(
    destination: string,
    file: string,
    content: string | Buffer,
  ) {
    console.log(destination);
    return mkdirAsync(destination, { recursive: true }).then(() =>
      writeFileAsync([destination, file].join('/'), content),
    );
  }

  static async read(path: string) {
    return readFileAsync(path);
  }

  static stream(path: string) {
    return createReadStream(path);
  }
}
