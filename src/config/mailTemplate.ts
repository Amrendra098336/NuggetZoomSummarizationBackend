interface EmailTemplateProps {
    name: string;
    body: string;
}

export const welcomeEmailTemplate = ({ name, body }: EmailTemplateProps): string => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; border-radius: 10px;">
        <header style="background-color: #4CAF50; padding: 10px 0; text-align: center; border-radius: 10px 10px 0 0;">
            <img src="https://profile-pictures-demo.s3.amazonaws.com/nugget+logo.png" alt="Nugget Logo" style="width: 120px;"/>
        </header>
        <section style="background-color: #fff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4CAF50;">Hello ${name},</h2>
            <p>${body}</p>
        </section>
        <footer style="text-align: center; margin-top: 20px;">
            <p>Best regards,<br/><strong>Nugget Team</strong></p>
        </footer>
    </div>
`;
