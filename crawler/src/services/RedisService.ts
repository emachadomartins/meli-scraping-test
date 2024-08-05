import Redis from "ioredis";

export class RedisService {
  private static client = new Redis(process.env["REDIS_URL"]!);

  public static async set<T>(value: T, ...keys: string[]) {
    return this.client
      .set(keys.join(":"), JSON.stringify(value))
      .then(() => true)
      .catch(() => false);
  }

  public static async get<T>(...keys: string[]) {
    return this.client
      .get(keys.join(":"))
      .then((value) => (!value ? undefined : (JSON.parse(value) as T)));
  }
}
