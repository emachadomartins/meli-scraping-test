import { RedisService } from "services/RedisService";
import { BrowserService } from "./services";
import { Result, Task } from "./types";
import { isDev, uploadFiles } from "./utils";

export const handleTask = async (
  task: Task,
  onSuccess: (result: Result) => Promise<void>,
  onError: (error: Error | string) => Promise<void>
) => {
  const { url, scripts, retry = 0 } = task;

  console.log(`Starting scraping '${url}'`);

  try {
    const browser = new BrowserService(url, retry);

    const result = await browser.execute(scripts);

    const { complete, error, files = [], taskId } = result;

    if (!isDev && files.length && (complete || retry > 5)) {
      await uploadFiles(files, taskId);

      await RedisService.set(result, "tasks", taskId);
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
