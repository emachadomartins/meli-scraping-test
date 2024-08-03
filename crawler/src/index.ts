import { BrowserService, SQSService } from "./services";
import { Task } from "./types";

export const handleMessages = async () => {
  const queueUrl = process.env["QUEUE_URL"];
  if (!queueUrl) throw new Error("Missing QUEUE_URL");

  const messages = await SQSService.receive<Task>(queueUrl);

  console.log(`${messages.length} messages found in ${queueUrl}`);

  await Promise.all(
    messages.map(async ({ body, receipt }) => {
      const { url, scripts, retry = 0 } = body;

      console.log(`Starting message [${receipt}]: ${url}`);

      const browser = new BrowserService(url, retry);

      const { complete, error } = await browser
        .execute(scripts)
        .catch(async (error: Error) => ({
          complete: false,
          error: error.message,
        }));

      if (!complete && retry <= 5) {
        const err = error ?? "unknown error";
        await SQSService.send(queueUrl, {
          ...body,
          error: err,
          retry: retry + 1,
        });

        console.log(`[${err}] while scraping '${url}'`);
      }

      await SQSService.delete(queueUrl, receipt);
    })
  );
};

const run = async () => {
  await handleMessages().then(() => {
    setTimeout(async () => {
      await run();
    }, 1 * 60 * 1000);
  });
};

run();
