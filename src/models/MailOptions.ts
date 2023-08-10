/**
 * @typedef MailOptions
 *
 * Represents the essential configuration for sending an email.
 *
 * @property {string} from - The email address of the sender.
 * @property {string} to - The email address of the recipient.
 * @property {string} subject - The subject line of the email.
 * @property {string} html - The HTML content for the email body.
 *
 * @author Amrendra Kumar Singh
 */

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}
