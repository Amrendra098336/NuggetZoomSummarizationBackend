/**
 * Author: John Doe
 * Description: This file contains a utility function for generating JWT tokens.
 * It uses the `jsonwebtoken` library and the JWT secret from the configuration file.
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import Logging from '../library/Logger';
import logMessage from '.././library/logMessage.json';

/**
 * Generate JWT token
 * This function generates a JSON Web Token (JWT) with the provided user ID and email.
 * The token is signed using the JWT secret from the configuration file and expires in 1 day.
 *
 * @param userId - The ID of the user
 * @param userEmail - The email of the user
 * @returns The generated JWT token
 * @throws Error if there's an issue generating the token
 */
export const generateToken = (userId: string, userEmail: string): string => {
    try {
        const token = jwt.sign({ userId, userEmail }, config.jwt.secret, {
            expiresIn: '1d' // Token expires in 1 day
        });

        Logging.info(`${logMessage.info.tokenGenerated} ${userId}`);
        return token;
    } catch (error) {
        Logging.error(`${logMessage.error.failTokenGeneration} ${userId}`);
        throw error;
    }
};

/**
 * Note: This utility function can be used to generate JWT tokens for user authentication and authorization.
 * The token contains the user's ID and email, which can be decoded and verified in subsequent requests to
 * ensure the user's identity and control access to protected routes or resources.
 * The generated token can be sent as an HTTP response to the client, who can include it in subsequent requests
 * as an authorization header or in a cookie to authenticate and access protected endpoints.
 */
