import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";

// Serviço para realizar operações no AWS-S3
export class S3Service {
  private static client = new S3Client({
    region: process.env["AWS_REGION"] ?? "us-east-1",
    credentials: fromEnv(),
  });

  public static async uploadFile(path: string, content: Buffer) {
    return this.client.send(
      new PutObjectCommand({
        Bucket: process.env["BUCKET_NAME"],
        Key: `data-collector/output/${path}`,
        Body: content,
        ACL: "public-read",
      })
    );
  }
}
