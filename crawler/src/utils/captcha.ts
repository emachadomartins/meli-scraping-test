import { FileService, RequestService } from "../services";

// Função que recebe um caminho para arquivo, converte para Buffer,
// envia para a api de conversão para texto e retorna o resultado convertido
export const convertFile = async (
  path: string,
  fileName: string,
  fileType: string
) => {
  const _fileName = await FileService.readdir(path).then(
    (files) =>
      files.find(({ name }) => name.includes(`${fileName}_${fileType}`))?.name
  );

  if (!_fileName) throw new Error("No file downloaded");

  const filePath = [path, _fileName].join("/");

  const file = await FileService.read(filePath);

  const [, extension] = _fileName.split(".");

  const formData = new FormData();

  formData.append("file_name", fileName);
  formData.append("file_type", fileType);
  formData.append("file", new Blob([file]), fileName);

  const response = await RequestService.send<{ text: string }>({
    url: "http://localhost:5000/text",
    method: "PUT",
    form: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    resolution: response,
    file,
    fileName: `${fileName}_${fileType}.${extension}`,
  };
};
