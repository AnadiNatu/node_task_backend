// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_POST,
//     secure: false,
//     auth: {
//         user : process.env.EMAIL_USERNAME,
//         pass : process.env.EMAIL_PASSWORD
//     } 
// });

// const sendResetEmail = async (toEmail , token) => {
//     const resetUrl = `http://localhost:8080/reset-password?token=${token}`;
//     await transporter.sendMail({
//         from : 'Product App <blackplaindot@gmail.com>',
//         to  : toEmail,
//         subject : 'Reset Password',
//         html : `<p> Click <a href="${resetUrl}">here</a> to reset your password . </p>`
//     });
// }; 

// module.exports = {transporter,
//     sendResetEmail
// };

const { text } = require('express');
const nodemailer = require('nodemailer');

class EmailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            host : process.env.EMAIL_HOST,
            port : process.env.EMAIL_PORT,
            secure : false,
            auth : {
                user : process.env.EMAIL_USERNAME,
                pass : process.env.EMAIL_PASSWORD
            },
            tls : {
                rejectUnauthorized : false
            }          
        });
    }

    async sendEmail(to , subject , body) {
        try{
            const mailOptions = {
                from : process.env.EMAIL_USERNAME,
                to : to,
                subject : subject,
                text : body
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to : ${to}`);
            return result;
        
        }catch(error){
            console.error('Error sending email:' , error.message);
            throw error;
        }
    }
}

module.exports = new EmailService();

