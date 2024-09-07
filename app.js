const nodemailer = require('nodemailer');
require('dotenv').config();

// Function to generate a random 4-digit code
function generateDoorCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Function to send email
async function sendDoorCodeEmail(recipients, doorCode) {
  // Create a transporter using SMTP
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email content
  let mailOptions = {
    from: '"HSA Belmont IT" <scanner2@hsabelmont.org>',
    to: recipients.join(', '),
    subject: 'Updated Door Code',
    text: `The new door code is: ${doorCode}. Please keep this information confidential.`,
    html: `<p>The new door code is: <strong>${doorCode}</strong>.</p><p>Please keep this information confidential.</p>`,
  };

  // Send email
  let info = await transporter.sendMail(mailOptions);
  console.log('Email sent: ' + info.messageId);
}

// Main function to update door code and send email
async function updateDoorCode() {
  const newDoorCode = generateDoorCode();
  const staffEmails = ['sari@hsabelmont.org']; // Add your staff email addresses here

  try {
    await sendDoorCodeEmail(staffEmails, newDoorCode);
    console.log('Door code updated and email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Run the update function
updateDoorCode();