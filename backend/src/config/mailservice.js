import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_SERVICE_EMAIL,
        pass: process.env.MAIL_SERVICE_PASSWORD,
    },
});

export async function sendPassEmail(email, otp, url) {
    return await transporter.sendMail({
        from: 'Otp From Resume Builder Website',
        to: email,
        subject: "Sharing Portal Access Credentials ✔",
        text: `Hi there! Just a quick note to let you know that your Password is: ${otp}.You Can access through: ${url}`,
    });
}