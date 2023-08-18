/**
 * Controller for mail-related operations.
 * This controller provides methods for sending emails.
 *
 * @fileoverview Provides functionality to handle email operations.
 * @author Amrendra Kumar Singh
 * @requires express:NextFunction
 * @requires express:Request
 * @requires express:Response
 * @requires ../library/Logger
 * @requires ../library/logMessage.json
 * @requires ../validators/mailParamValidator
 * @requires ../config/mail
 * @requires dotenv
 * @requires nodemailer/lib/mailer
 */

import { NextFunction, Request, Response } from 'express';
import Logging from '../library/Logger';
import logMessages from '../library/logMessage.json';
import { mailRequestBodySchema } from '../validators/mailParamValidator';
import { sendEmail } from '../config/mail';
import { IRecording } from '../models/Recordings';
import Recording from '../models/Recordings';
import User, { IUser } from '../models/users';

import dotenv, { config } from 'dotenv';
import Mail from 'nodemailer/lib/mailer';
dotenv.config();

const logger = Logging;

/**
 * Sends an email to the specified recipient.
 *
 * @function
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Response} Express response object.
 * @throws Will throw an error if sending email fails.
 * @throws Will throw a 400 status error if validation fails.
 * @author: Amrendra Kumar Singh
 */

const sendMail = async (req: Request, res: Response, next: NextFunction) => {
    console.log('inside sendMail');
    const { error } = mailRequestBodySchema.validate(req.body);
    if (error) {
        logger.error(error);
        return res.status(400).json({ message: 'Validation failed', error });
    }
    const { modifiedFileName, message } = req.body;
    const result = await fetchUserAndRecordingByModifiedFileName(modifiedFileName);

    if (!result || !result.user) {
        // Check added here for result.user
        return res.status(404).json({ message: 'No user data found for the given file name.' });
    }

    console.log('dcdc ' + result.user.email);

    try {
        await sendEmail(result.user.email, `Summary for Meeting: ${result.recording?.meetingTitle}`, result.user.firstName, message);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
        logger.error(`Failed to send email: ${err}`);
        res.status(500).json({ message: 'Failed to send email.' });
    }
};

/**
 * Fetches the recording details associated with a modifiedFileName from the Recordings collection.
 *
 * @param {string} modifiedFileName - The name of the file without its extension.
 * @returns {Promise<IRecording | null>} The recording details associated with the given file name or null if not found.
 */

const fetchUserAndRecordingByModifiedFileName = async (modifiedFileName: string): Promise<{ user: IUser | null; recording: IRecording | null }> => {
    const recording = await Recording.findOne({ modifiedFileName: new RegExp('^' + modifiedFileName + '$', 'i') });

    if (!recording) {
        return { user: null, recording: null };
    }
    console.log(recording);

    const email = recording?.email;
    const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') }).populate('recordings');
    console.log(user);

    return { user, recording };
};

export default { sendMail };
