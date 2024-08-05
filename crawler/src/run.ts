import { handleTask } from ".";
import { SQSService } from "./services";
import { Task } from "./types";

export const handleMessages = async () => {};

// Função que busca mensagens na fila do SQS e manda para execução
const run = async () => {
  const queueUrl = process.env["QUEUE_URL"];
  if (!queueUrl) throw new Error("Missing QUEUE_URL");

  const messages = await SQSService.receive<Task>(queueUrl);

  console.log(`${messages.length} messages found in ${queueUrl} ${new Date()}`);

  await Promise.all(
    messages.map(async ({ body, receipt }) => {
      const onSuccess = async () => {
        await SQSService.delete(queueUrl, receipt);
      };

      const onError = async (error: Error | string) => {
        const message = error instanceof Error ? error.message : error;
        await SQSService.delete(queueUrl, receipt).then(
          async () =>
            await SQSService.send(queueUrl, {
              ...body,
              error: message,
              retry: body.retry + 1,
            })
        );
      };

      await handleTask(body, onSuccess, onError);
    })
  );

  setTimeout(async () => {
    await run();
  }, 1 * 60 * 1000);
};

run();
