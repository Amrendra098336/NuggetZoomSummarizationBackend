import nodemailer from 'nodemailer';
import { TransportOptions } from '../models/TransportOptions';
import { MailOptions } from '../models/MailOptions';
import dotenv from 'dotenv';
import { welcomeEmailTemplate } from './mailTemplate';

dotenv.config();

const transportOptions: TransportOptions = {
    service: process.env.MAIL_SERVICE_NAME!,
    auth: {
        user: process.env.MAIL_USERNAME!,
        pass: process.env.MAIL_PASSWORD!
    }
};

const transport = nodemailer.createTransport(transportOptions);

export async function sendEmail(to: string, subject: string, name: string, text: string): Promise<MailOptions> {
    const htmlContent = welcomeEmailTemplate({ name, body: text });
    const mailOption: MailOptions = {
        from: 'no-reply@nugget.com',
        to: to,
        subject: subject,
        html: htmlContent
    };

    try {
        const info = await transport.sendMail(mailOption);
        return mailOption;
    } catch (err) {
        throw err;
    }
}
