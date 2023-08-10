import { Request, Response } from 'express';
import s3 from '../config/aws';
import Logging from '../library/Logger';
import logMessage from '../library/logMessage.json';
import { saveRecordingToDB } from '../helpers/recordingDbOperation';
import { models } from 'mongoose';
import users from '../models/users';

/**
 * Uploads a file to AWS S3.
 *
 * This function processes the file from the request, extracts associated metadata (email, meeting title),
 * and then handles the upload process to AWS S3. Logging mechanisms are in place for error or success scenarios.
 *
 * @function
 * @async
 * @param {Request} req - Express request object containing the uploaded file and additional metadata.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Returns nothing but sends an appropriate response to the client.
 * @throws Will throw an error if the file upload to S3 fails.
 *
 * @author Amrendra Kumar Singh
 */
export const uploadToS3 = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        Logging.error(logMessage.error.FileNotUploaded + ' => Find not Found');
        return;
    }

    const email = req.body.email; // Extract email from request body
    const meetingTitle = req.body.meetingTitle; // Extract meeting title, if you need

    if (!email) {
        res.status(400).send('Email is required.');
        return;
    }

    if (!meetingTitle) {
        res.status(400).send('Meeting Subject is required.');
        return;
    }

    const currentTime = formatDate(new Date());
    const myBucket = process.env.AWS_BUCKET_NAME;
    const myKey = `${email}_${currentTime}_${req.file.originalname}`;
    const savedRecording = await saveRecordingToDB(email, meetingTitle, req.file.originalname, myKey);
    if (savedRecording) {
        console.log(savedRecording);
        Logging.info('Recording saved successfully:', savedRecording);
    } else {
        console.error('Failed to save recording');
        Logging.error('Failed to save recording:');
    }
    const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: 'projectx-nuggetai',
        Key: myKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    s3.upload(uploadParams, (err: Error, data: AWS.S3.PutObjectOutput) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to upload file to S3.');
            Logging.info(`${email}:: ${logMessage.error.FileNotUploaded}`);
        } else {
            const fileLocation = `https://${myBucket}.s3.amazonaws.com/${myKey}`;
            Logging.info(`${email}:: ${logMessage.info.FileUploaded}:: ${fileLocation}`);
            res.send(`File uploaded successfully to S3. URL: ${fileLocation}`);
        }
    });
};

/**
 * Formats a JavaScript Date object into a readable string format.
 *
 * The output format is `YYYY-MM-DD_HH-MM-SS`.
 *
 * @param {Date} date - The JavaScript Date object to be formatted.
 * @returns {string} - Returns the formatted date string.
 *
 * @author Amrendra Kumar Singh
 */

const formatDate = (date: Date): string => {
    const YYYY = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const DD = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const MIN = String(date.getMinutes()).padStart(2, '0');
    const SS = String(date.getSeconds()).padStart(2, '0');

    return `${YYYY}-${MM}-${DD}_${HH}-${MIN}-${SS}`;
};
