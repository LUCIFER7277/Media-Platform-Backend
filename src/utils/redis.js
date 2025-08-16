import { createClient } from 'redis';

class RedisCache {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.client = createClient({
                url: process.env.REDIS_URL
            });

            await this.client.connect();
            this.isConnected = true;
            console.log('✅ Redis connected successfully');
        } catch (error) {
            console.log('❌ Redis connection failed:', error.message);
            this.isConnected = false;
        }
    }

    async get(key) {
        if (!this.isConnected) return null;

        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.log('Redis get error:', error.message);
            return null;
        }
    }

    async set(key, data, expireInSeconds = 300) {
        if (!this.isConnected) return false;

        try {
            await this.client.setEx(key, expireInSeconds, JSON.stringify(data));
            return true;
        } catch (error) {
            console.log('Redis set error:', error.message);
            return false;
        }
    }

    async del(key) {
        if (!this.isConnected) return false;

        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            console.log('Redis delete error:', error.message);
            return false;
        }
    }
}

export const redisCache = new RedisCache();
