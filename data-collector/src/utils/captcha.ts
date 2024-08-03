import { FileService } from 'src/services';
import { RequestService } from '../services';

export const resolveCaptcha = async (path: string, type: 'audio' | 'image') => {
  const fileName = await FileService.readdir(path).then(
    (files) => files.find(({ name }) => name.includes(`captcha_${type}`)).name,
  );

  if (!fileName) throw new Error('No captcha file downloaded');

  const filePath = [path, fileName].join('/');

  const file = await FileService.read(filePath);

  const [, extension] = fileName.split('.');

  const formData = new FormData();

  formData.append('file_name', fileName);
  formData.append('file_type', type);
  formData.append('file', new Blob([file]), fileName);

  const response = await RequestService.send<{ captcha: string }>({
    url: 'http://localhost:5000/captcha',
    method: 'PUT',
    form: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return {
    resolution: response,
    file,
    fileName: `captcha_${type}.${extension}`,
  };
};
