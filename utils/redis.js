import { promisify } from 'util';
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create a Redis client.
    this.client = createClient();
    
    // Track the client's connection status.
    this.isClientConnected = true;
    
    // Handle connection errors.
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    
    // Handle successful connection.
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if this client's connection to Redis is active.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value of a given key from Redis.
   * @param {String} key - The key of the item to retrieve.
   * @returns {Promise<String | Object>} The value associated with the key.
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key and its value in Redis with an expiration time.
   * @param {String} key - The key of the item to store.
   * @param {String | Number | Boolean} value - The item to store.
   * @param {Number} duration - Expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
  }

  /**
   * Removes the value associated with a given key from Redis.
   * @param {String} key - The key of the item to remove.
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

// Create a singleton instance of the RedisClient to be used throughout.
export const redisClient = new RedisClient();

// Export the Redis client instance.
export default redisClient;
