import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { fromEnv } from "@aws-sdk/credential-providers";

// Serviço para realizar operações no AWS-SQS
export class SQSService {
  private static client = new SQSClient({
    region: process.env["AWS_REGION"] ?? "us-east-1",
    credentials: fromEnv(),
  });

  public static async receive<T = unknown>(queue: string) {
    const { Messages = [] } = await this.client.send(
      new ReceiveMessageCommand({
        MaxNumberOfMessages: 10,
        MessageAttributeNames: ["All"],
        QueueUrl: queue,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 20,
      })
    );

    return Messages.map(({ Body = "{}", ReceiptHandle }) => ({
      body: JSON.parse(Body) as T,
      receipt: ReceiptHandle!,
    }));
  }

  public static async delete(queue: string, receipt: string) {
    return this.client.send(
      new DeleteMessageCommand({
        QueueUrl: queue,
        ReceiptHandle: receipt,
      })
    );
  }

  public static async send<T>(queue: string, task: T) {
    return this.client.send(
      new SendMessageCommand({
        QueueUrl: queue,
        MessageBody: JSON.stringify(task),
      })
    );
  }
}
