/**
 * Author: Amrendra Kumar Singh
 * Description: This file contains the main server configuration and startup logic.
 * It connects to MongoDB, sets up middleware and routes, and starts the server.
 */

import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logger';
import userRoutes from './routes/Users';
import logMessage from './library/logMessage.json';
import mailRouter from './routes/mail';
import uploadRouter from './routes/uploadRoute';

const router = express();

/** Connect to MongoDB */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info(logMessage.info.connectedToMongoDB);
        startServer();
    })
    .catch((error) => {
        Logging.error(logMessage.error.unableToConnectToMongoDB);
        Logging.error(error);
    });

/** Start the server only if MongoDB is connected */
const startServer = () => {
    router.use((req, res, next) => {
        /** Log the incoming request */
        Logging.info(`${logMessage.info.incomingRequest} [${req.method}] - URL: [${req.url}] IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the outgoing response */
            Logging.info(`${logMessage.info.outgoingResponse} [${req.method}] - URL: [${req.url}] IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /** Set up CORS headers and allowed methods */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /** Set up routes */
    router.use('/users', userRoutes);
    /** Set up mail route */
    router.use('/mail', mailRouter);
    /** Set up Upload route */
    router.use('/upload', uploadRouter);
    /** Health Check */
    router.get('/health', (req, res, next) => {
        res.status(200).json({ message: 'Healthy' });
    });

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('Not Found');
        Logging.error(error);
        res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => {
        Logging.info(`${logMessage.info.serverRunning} ${config.server.port}`);
    });
};
