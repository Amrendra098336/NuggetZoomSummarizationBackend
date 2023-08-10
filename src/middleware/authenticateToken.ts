/**
 * Author: Amrendra Singh
 * Description: This middleware function is used to authenticate JWT tokens in incoming requests.
 * It verifies the token provided in the request header and attaches the decoded user ID to the request object.
 * If the token is valid, the request is allowed to proceed to the next middleware.
 * If the token is invalid or not provided, an error response is sent.
 */

import { RequestHandler, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { config } from '../config/config';
import Logging from '../library/Logger';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IRequest } from '../types';
import logMessage from '.././library/logMessage.json';

/**
 * Authenticate JWT token middleware
 * This middleware function is used to authenticate JWT tokens in incoming requests.
 * It verifies the token provided in the request header and attaches the decoded user ID to the request object.
 * If the token is valid, the request is allowed to proceed to the next middleware.
 * If the token is invalid or not provided, an error response is sent.
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function to pass the control to the next middleware
 */
export const authenticateToken: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>> = (req: IRequest, res: Response, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        Logging.warning(`${logMessage.info.tokenNotProvided} ${req.ip}`);
        return res.status(403).json({ error: 'No token provided' }) as Response<any, Record<string, any>>;
    }

    jwt.verify(token, config.jwt.secret, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            Logging.error(`Failed to authenticate token in request from: ${req.ip}`);
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }

        Logging.info(`${logMessage.info.authenticated} ${decoded.userEmail}`);
        req.user = decoded.userId;
        next();
    });
};

/**
 * Note: This middleware function is used to authenticate JWT tokens in incoming requests.
 * It checks for the presence of a valid token in the request header and verifies its authenticity.
 * If the token is valid, the decoded user ID is attached to the request object for further processing.
 * If the token is invalid or not provided, an error response is sent back to the client.
 * This middleware can be used to protect routes that require authentication, ensuring that only
 * authenticated users can access them.
 */
