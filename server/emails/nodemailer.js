
const nodemailer = require('nodemailer');
const senderEmail = process.env.EMAIL_ADDRESS_OWNER;
const senderPassword = process.env.EMAIL_ADDRESS_PW;
    // Send email notification
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderEmail,
        pass: senderPassword
    }
});

const sendTicketInfo = (email, ticket_id, amount) => {
    transporter.sendMail({
        to: email, //temporary
        from: senderEmail,
        subject: 'NMBTS Ticket Information',
        text: `Dear Customer, your ticket id is ${ticket_id} and the amount due is ${amount}`
    })
}

module.exports = {
    sendTicketInfo
    
}
