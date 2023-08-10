/**
 * EmailService Class.
 *
 * Provides services and utilities for sending and managing emails. This class encompasses
 * functionalities like sending welcome emails, password reset emails, and others.
 * It leverages the `nodemailer` package for sending the emails and is structured to
 * easily accommodate other email templates and services in the future.
 *
 * Usage:
 * ```typescript
 * const emailService = new EmailService();
 * emailService.sendWelcomeEmail('john.doe@example.com', 'John');
 * ```
 *
 * @class
 * @see [nodemailer documentation]{@link https://nodemailer.com/about/} for more details.
 *
 * @author Amrendra Kumar Singh
 */

interface EmailTemplateProps {
    name: string;
    body: string;
    subject: string;
}

/**
 * Generates the HTML content for a welcome email.
 *
 * This function takes in an `EmailTemplateProps` object containing the recipient's name, the email body,
 * and the email subject. It returns a formatted HTML string that is ready for delivery. The email structure
 * is designed with a header, a main content area, and a footer.
 *
 * Note: This email is system-generated. Recipients are advised not to reply directly to this email.
 *
 * @function
 * @param {EmailTemplateProps} props - Object properties: `name` (recipient's name), `body` (email content), and `subject` (email subject).
 * @returns {string} - Formatted HTML string for the email.
 *
 * @author Amrendra Kumar Singh
 */

export const welcomeEmailTemplate = ({ name, body, subject }: EmailTemplateProps): string => {
    const formattedBody = body.replace(/\n/g, '<br>'); // replace newline characters with <br> tags for proper formatting

    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; border-radius: 10px;">
        <header style="background-color: #7D6EF1; padding: 10px 0; border-radius: 10px 10px 0 0;">
            <div style="display: flex; align-items: center; padding-left: 15px;">
                <a href="https://www.nugget.ai/">
                    <img src="https://uploads-ssl.webflow.com/60d686f300adb994e5b816f1/60d6a44297abf38043e5c18d_nugget%20logo%20with%20dark%20grey%20text.png" alt="Nugget Logo" style="width: 100px; margin-right: 15px;"/>
                </a>
                <span style="color: white; font-size: 1.2em; font-weight: bold;">Powered by AI, backed by science.</span>
            </div>
        </header>
        <section style="background-color: #fff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #7D6EF1;">Hello ${name},</h2>
            <h4>Meeting Summary for "${subject}"</h4>
            <p>${formattedBody}</p>
        </section>
        <footer style="text-align: center; margin-top: 20px;">
            <p>Best regards,<br/><strong>Nugget Team</strong></p>
            <p style="color: #888; font-size: 0.8em;">This is an automated email. Please do not reply directly to this email.</p>
        </footer>
    </div>
    `;
};
