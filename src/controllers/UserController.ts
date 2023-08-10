/**
 * Controller for user-related operations
 * This controller provides methods for creating a new user, reading user information, updating user information,
 * updating user password, deleting a user, and user login.
 *
 * @author Amrendra Kumar Singh
 */

import { NextFunction, Request, Response } from 'express';
import User from '../models/users';
import jwt from 'jsonwebtoken';
import { IRequest } from '../types';
import Logging from '../library/Logger';
import bcrypt from 'bcrypt';
import logMessages from '../library/logMessage.json';
import { validateUser } from '../validators/userValidator';
import { userEmailParamSchema } from '../validators/userEmailParamValidator';
import { loginRequestBodySchema } from '../validators/loginParamValidator';

import dotenv from 'dotenv';
dotenv.config();

const logger = Logging;

/**
 * Create a new user
 * This method creates a new user based on the provided details in the request body.
 * If the user is created successfully, a token is generated and returned in the response.
 *
 * @param req - The request object containing user details
 * @param res - The response object used to send the response
 * @param next - The next function to pass the control to the next middleware
 */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    // Validate user input
    const { error } = validateUser(req.body);

    if (error) {
        logger.error(`Validation error: ${error.details[0].message}`);
        return res.status(400).json({ error: error.details[0].message });
    }

    const { firstName, lastName, email, password, dateOfBirth, gender } = req.body;

    // Check if a user already exists with the given email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        logger.warn(`${email}:  ${logMessages.warning.userExists}`);
        return res.status(400).json({ error: logMessages.warning.userExists, email });
    }

    const newUser = new User({ firstName, lastName, email, password, dateOfBirth, gender });

    try {
        const savedUser = await newUser.save();

        // Generate a token for the user
        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

        logger.info(`${email}: ${logMessages.info.userCreated}`);
        res.status(201).json({ newUser: savedUser, token });
    } catch (error) {
        logger.error(`${email}: ${logMessages.error.userCreationFailed}`);
        logger.error(error);
        res.status(500).json({ error: logMessages.error.userCreationFailed });
    }
};

/**
 * Read user information
 * This method retrieves the user information based on the provided user email in the request params.
 * The authenticated user is validated against the requested user, and only authorized access is allowed.
 *
 * @param req - The request object containing the user email in the params and authenticated user in the body
 * @param res - The response object used to send the response
 * @param next - The next function to pass the control to the next middleware
 */
export const readUser = async (req: IRequest, res: Response, next: NextFunction) => {
    const { userEmail } = req.params;
    const { user: userId } = req;

    // Validate the request parameters
    const { error } = userEmailParamSchema.validate(req.params);

    if (error) {
        logger.error(`${userEmail}: ${logMessages.error.invalidEmail}`);
        logger.error(error);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            logger.warn(`${userEmail}: ${logMessages.warning.userNotFound}`);
            return res.status(404).json({ error: logMessages.warning.userNotFound });
        }

        if (user._id.toString() !== userId) {
            logger.warn(`${userEmail}: ${logMessages.warning.unauthorizedAccess}`);
            return res.status(403).json({ error: logMessages.warning.unauthorizedAccess });
        }

        logger.info(`${userEmail}: ${logMessages.info.userRetrieved}`);
        return res.status(200).json({ user });
    } catch (error) {
        logger.error(`${userEmail}: ${logMessages.error.userRetrievalFailed}`);
        logger.error(error);
        return res.status(500).json({ error: logMessages.error.userRetrievalFailed });
    }
};

/**
 * Update user information
 * This method updates the user information based on the provided user email in the request params.
 * The updated user data is passed in the request body.
 *
 * @param req - The request object containing the user email in the params and updated user data in the body
 * @param res - The response object used to send the response
 * @param next - The next function to pass the control to the next middleware
 */
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userEmail } = req.params;
    const updateData = req.body;

    // Validate the request parameters
    const { error } = userEmailParamSchema.validate(req.params);

    if (error) {
        logger.error(`${userEmail}: ${logMessages.error.invalidEmail}`);
        logger.error(error);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const user = await User.findOneAndUpdate({ email: userEmail }, updateData, { new: true });

        if (!user) {
            logger.warn(`${userEmail}: ${logMessages.warning.userNotFound}`);
            return res.status(404).json({ error: logMessages.warning.userNotFound });
        }

        logger.info(`${userEmail}: ${logMessages.info.userUpdated}`);
        return res.status(200).json({ user });
    } catch (error) {
        logger.error(`${userEmail}: ${logMessages.error.userUpdateFailed}`);
        logger.error(error);
        return res.status(500).json({ error: logMessages.error.userUpdateFailed });
    }
};

/**
 * Update user password
 * This method updates the user password based on the provided user email in the request params.
 * The new password is passed in the request body.
 *
 * @param req - The request object containing the user email in the params and the new password in the body
 * @param res - The response object used to send the response
 * @param next - The next function to pass the control to the next middleware
 */
const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { userEmail } = req.params;
    const { password } = req.body;

    // Validate the request parameters
    const { error } = userEmailParamSchema.validate(req.params);

    if (error) {
        logger.error(`${userEmail}: ${logMessages.error.invalidEmail}`);
        logger.error(error);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            logger.warn(`${userEmail}: ${logMessages.warning.userNotFound}`);
            return res.status(404).json({ error: logMessages.warning.userNotFound });
        }

        user.password = password;
        await user.save();

        logger.info(`${userEmail}: ${logMessages.info.passwordUpdated}`);
        return res.status(200).json({ message: logMessages.info.passwordUpdated });
    } catch (error) {
        logger.error(`${userEmail}: ${logMessages.error.passwordUpdateFailed}`);
        logger.error(error);
        return res.status(500).json({ error: logMessages.error.passwordUpdateFailed });
    }
};

/**
 * Delete a user
 * This method deletes a user based on the provided user email in the request params.
 *
 * @param req - The request object containing the user email in the params
 * @param res - The response object used to send the response
 * @param next - The next function to pass the control to the next middleware
 */
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userEmail } = req.params;

    // Validate the request parameters
    const { error } = userEmailParamSchema.validate(req.params);

    if (error) {
        logger.error(`${userEmail}: ${logMessages.error.invalidEmail}`);
        logger.error(error);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const deletedUser = await User.findOneAndDelete({ email: userEmail });

        if (!deletedUser) {
            logger.warn(`${userEmail}: ${logMessages.warning.userNotFound}`);
            return res.status(404).json({ error: logMessages.warning.userNotFound });
        }

        logger.info(`${userEmail}: ${logMessages.info.userDeleted}`);
        return res.status(200).json({ message: logMessages.info.userDeleted });
    } catch (error) {
        logger.error(`${userEmail}: ${logMessages.error.userDeletionFailed}`);
        logger.error(error);
        return res.status(500).json({ error: logMessages.error.userDeletionFailed });
    }
};

/**
 * User login
 * This method allows the user to login by validating the provided user email and password.
 * If the login is successful, a token is generated and returned in the response.
 *
 * @param req - The request object containing user email and password
 * @param res - The response object used to send the response
 * @param next - The next function to pass the control to the next middleware
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = loginRequestBodySchema.validate(req.body);

    if (error) {
        logger.error(`Login: ${logMessages.error.invalidLoginRequestBody}`);
        logger.error(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            logger.warn(`${email}: ${logMessages.warning.userNotFound}`);
            return res.status(404).json({ error: logMessages.warning.userNotFound });
        }

        // Check if the password is correct
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            logger.warn(`${email}: ${logMessages.warning.invalidCredentials}`);
            return res.status(401).json({ error: logMessages.warning.invalidCredentials });
        }

        // Generate a token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

        logger.info(`${email}: ${logMessages.info.userLoggedIn}`);
        return res.status(200).json({ user, token });
    } catch (error) {
        logger.error(`${email}: ${logMessages.error.loginFailed}`);
        logger.error(error);
        return res.status(500).json({ error: logMessages.error.loginFailed });
    }
};

export default { createUser, readUser, updateUser, updatePassword, deleteUser, login };
