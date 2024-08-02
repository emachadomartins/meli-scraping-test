export declare class FileService {
    static mkdir(path: string, recursive?: boolean): Promise<string>;
    static write(destination: string, file: string, content: string | Buffer): Promise<void>;
    static read(path: string): Promise<Buffer>;
    static stream(path: string): import("fs").ReadStream;
}
