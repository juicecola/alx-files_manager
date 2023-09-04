import { promisify } from 'util';
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create a Redis client.
    this.client = createClient();
    
    // Track client's connection status.
    this.isClientConnected = true;
    
    // Handle connection errors.
    this.client.on('error', (err) => {
      console.error('Failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    
    // Handle successful connection.
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  // Check if Redis connection is active.
  isAlive() {
    return this.isClientConnected;
  }

  // Get value of a key from Redis.
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  // Store key, value, and set expiration.
  async set(key, value, duration) {
    await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
  }

  // Remove value by key from Redis.
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

// Create Redis client instance.
export const redisClient = new RedisClient();
export default redisClient;

