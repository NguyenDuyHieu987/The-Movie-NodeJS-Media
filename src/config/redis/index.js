import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

class RedisCache {
  static client = createClient({
    url: process.env.REDIS_URL,
    // username: 'default',
    // password: process.env.REDIS_PASSWORD,
    socket: {
      // host: process.env.REDIS_HOST,
      // port: +process.env.REDIS_PORT,
      // connectTimeout: 50000,
      reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
    },
    pingInterval: 10000,
  });

  constructor() {}

  redisClient() {
    return RedisCache.client;
  }

  async connect() {
    await RedisCache.client.connect();
  }

  async disConnect() {
    await RedisCache.client.disconnect();
  }

  async quit() {
    await RedisCache.client.quit();
  }
}

export default new RedisCache();
