/**
 * Email Service Utility.
 *
 * Provides functionality to send emails via the specified mail service. This utility initializes
 * the mail transporter with the necessary credentials and allows for easy sending of emails
 * leveraging the `nodemailer` library. It is designed to use the `welcomeEmailTemplate` to format
 * the content of emails being sent out, providing a consistent look and feel for recipients.
 *
 * Usage:
 * ```typescript
 * import { sendEmail } from './path-to-this-file';
 * sendEmail('john.doe@example.com', 'Meeting Summary', 'John', 'Here is a brief summary of our meeting...')
 *     .then(info => console.log('Email sent successfully', info))
 *     .catch(error => console.error('Error sending email:', error));
 * ```
 *
 * @module
 * @see [nodemailer documentation]{@link https://nodemailer.com/about/} for more details.
 * @see [dotenv documentation]{@link https://github.com/motdotla/dotenv} for more details.
 *
 * @author Amrendra Kumar Singh
 */

// Importing necessary dependencies and templates.
import nodemailer from 'nodemailer'; // Node.js module for sending emails.
import { TransportOptions } from '../models/TransportOptions'; // Interface representing nodemailer transport options.
import { MailOptions } from '../models/MailOptions'; // Interface representing nodemailer mail options.
import dotenv from 'dotenv'; // Module to load environment variables from a .env file.
import { welcomeEmailTemplate } from './mailTemplate'; // Mail content template utility.
import Logging from '../library/Logger';
import logMessage from '.././library/logMessage.json';

// Initializing dotenv to load environment variables.
dotenv.config();

// Configuring transporter options with the details fetched from environment variables.
const transportOptions: TransportOptions = {
    service: process.env.MAIL_SERVICE_NAME!,
    auth: {
        user: process.env.MAIL_USERNAME!,
        pass: process.env.MAIL_PASSWORD!
    }
};

// Initializing the mail transporter using nodemailer with the specified options.
const transport = nodemailer.createTransport(transportOptions);

/**
 * Send an Email.
 *
 * This function sends an email using the `nodemailer` library. It constructs the email content using
 * the provided `welcomeEmailTemplate`, which ensures a consistent email format. The function returns
 * a promise which, when resolved, gives the mail options of the sent email.
 *
 * @function
 * @async
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Subject of the email.
 * @param {string} name - Recipient's name.
 * @param {string} text - Main content of the email.
 * @returns {Promise<MailOptions>} - A promise which resolves to the mail options of the sent email.
 * @throws Will throw an error if sending the email fails.
 *
 * @author Amrendra Kumar Singh
 */
export async function sendEmail(to: string, subject: string, name: string, text: string): Promise<MailOptions> {
    // Constructing the email content using the welcome email template.
    const htmlContent = welcomeEmailTemplate({ name, body: text, subject });

    // Setting up mail options.
    const mailOption: MailOptions = {
        from: 'no-reply@nugget.com',
        to: to,
        subject: subject,
        html: htmlContent
    };

    try {
        // Sending the email.
        const info = await transport.sendMail(mailOption);
        return mailOption;
    } catch (err) {
        Logging.error(`Email: ${err}`);
        throw err;
    }
}
