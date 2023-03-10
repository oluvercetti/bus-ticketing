const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY;
const senderEmail = process.env.EMAIL_ADDRESS_OWNER;

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeMessage = (email, name) => {
    sgMail.send({
        to: email, //temporary
        from: process.env.EMAIL_ADDRESS_OWNER,
        subject: 'This is my first creation!',
        text: `Hello ${name} I hope this one actually get to you`
    })
}

const sendTicketInfo = (email, ticket_id, amount) => {
    sgMail.send({
        to: email, //temporary
        from: senderEmail,
        subject: 'NMBTS Ticket Information',
        text: `Dear Customer, your ticket id is ${ticket_id} and the amount due is ${amount}`
    })
}


const sendCancellationMessage = (email, name) => {
    sgMail.send({
        to: email, //temporary
        from: process.env.EMAIL_ADDRESS_OWNER,
        subject: 'So sad to let you go',
        text: `Hello ${name} I hope this one actually get to you`
    })
} 

module.exports = {
    sendWelcomeMessage,
    sendCancellationMessage,
    sendTicketInfo
}