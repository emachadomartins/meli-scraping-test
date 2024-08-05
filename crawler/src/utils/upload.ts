import { FileService, S3Service } from "../services";

export const uploadFiles = async (files: string[], task: string) => {
  await Promise.all(
    files.map(async (file) => {
      const buffer = await FileService.read(`output/${file}`);
      await S3Service.uploadFile(file, buffer);
    })
  ).then(async () => {
    await FileService.rm(`output/${task}`);
  });
};
