import { BrowserService } from "./services";
import { Result, Task } from "./types";
import { uploadFiles } from "./utils";

// Função que chama o BrowserService, espera a conclusão da execução e sobe os resultados no S3+Redis
export const handleTask = async (
  task: Task,
  onSuccess: (result: Result) => Promise<void>,
  onError: (error: Error | string) => Promise<void>
) => {
  const { url, steps, retry = 0, id } = task;

  console.log(`Starting scraping '${url}'`);

  try {
    const browser = new BrowserService(task.id, url, retry);

    const result = await browser.execute(steps);

    const { complete, error, files = [] } = result;

    if (files.length && (complete || retry > 5)) {
      await uploadFiles(files, id);
    } else if (!complete && retry <= 5) {
      throw new Error(error ?? "unknown error");
    }

    await onSuccess(result);
  } catch (error) {
    const message = error instanceof Error ? error : "unknown error";
    console.log(`Error '${message}' while scraping '${url}'`);
    await onError(message);
  } finally {
    console.log(`Finish scraping '${url}'`);
  }
};
