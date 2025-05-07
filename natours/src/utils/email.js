import nodemailer from 'nodemailer'

const sentEmail = options=> {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,

        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        }
    })
    const mailOptions = {
        from:'Aqida <aqida@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    transporter.sendMail(mailOptions)
}

export default sentEmail;