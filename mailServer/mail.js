const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your SMTP service (Gmail, Outlook, etc.)
  auth: {
    user: 'aclaraciones@kuhnipay.com', // Your email
    pass: 'Kuhniaclaraciones1.', // Your email password or App password
  },
});

// Email sending function
function sendEmail(subject, text){
  const mailOptions = {
    from: 'kevin@quantumpay.mx', // Sender address
    to: 'aclaraciones@kuhnipay.com', // Receiver email
    subject: subject, // Subject
    text: text, // Email body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error: ', error);
    }
    console.log('Email sent: ' + info.response);
  });
};

module.exports = {
    sendEmail
}

