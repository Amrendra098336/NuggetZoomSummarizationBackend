import dotenv from 'dotenv';

dotenv.config();

/**
 * Author: John Doe
 * Description: This file handles the configuration values for the application.
 * The values are retrieved from the environment variables using the dotenv package.
 */

// Retrieve the MongoDB username from the environment variable, defaulting to an empty string
const MONGO_USERNAME = process.env.MONGO_USERNAME || '';

// Retrieve the MongoDB password from the environment variable, defaulting to an empty string
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';

// Construct the MongoDB URL with the username and password
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.r5aue46.mongodb.net/?retryWrites=true&w=majority/NuggetZoomApplication`;

// Retrieve the server port from the environment variable, defaulting to 1337
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;

// Retrieve the JWT secret from the environment variable, defaulting to a hardcoded value
const JWT_SECRET = process.env.JWT_SECRET || 'Jd12lOjqJVZx5TxOclxHFxKmQMbefndprzpUx5Ht9u8=';

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const AWS_BUCKET = process.env.AWS_BUCKET_NAME;

// Configuration object
export const config = {
    mongo: {
        username: MONGO_USERNAME,
        password: MONGO_PASSWORD,
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    jwt: {
        secret: JWT_SECRET
    },
    aws: {
        ACCESS_KEY: AWS_ACCESS_KEY,
        SECRET_KEY: AWS_SECRET_KEY,
        BUCKET_NAME: AWS_BUCKET
    }
};
