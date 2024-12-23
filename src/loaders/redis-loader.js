import { createClient } from 'redis';
import { redisHost, redisPort, redisPass } from '../config/config.js';

const redisClient = createClient({
    username: 'default',
    password: redisPass,
    socket: {
        reconnectStrategy: function(retries) {
            if (retries > 20) {
                console.log("Too many attempts to reconnect. Redis connection was terminated");
                return new Error("Too many retries.");
            } else {
                return retries * 500;
            }
        },
        connectTimeout: 10000,
        host: redisHost,
        port: redisPort,
    }
});

const client = createClient({
    username: 'default',
    password: 'OS29hReaPP6e75raJEoh7qAsX8MNt5gM',
    socket: {
        host: 'redis-14068.c239.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 14068
    }
});
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (error) => {
    console.error('Failed to connect to Redis', error);
    process.exit(1);
});

export { redisClient };
