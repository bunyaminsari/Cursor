const nodemailer = require('nodemailer');
const csv = require('csv-parser');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

// Function to send email
async function sendDoorCodeEmail(recipient, doorCode, fullName) {
  console.log('Sending email with:', { recipient, doorCode, fullName }); // Debug log

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

  // Render email template
  const emailTemplate = await ejs.renderFile(
    path.join(__dirname, './templates/emailTemplate.ejs'),
    { fullName, doorCode }
  );

  // Email content
  let mailOptions = {
    from: '"HSA Belmont IT" <scanner2@hsabelmont.org>',
    to: recipient,
    subject: 'Your Personal Door Code',
    html: emailTemplate,
  };

  // Send email
  let info = await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${recipient}: ${info.messageId}`);
}

// Function to process CSV and send emails
async function processCsvAndSendEmails(filePath) {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        console.log('Row data:', row); // Add this line for debugging
        console.log('Name:', row['Full Name']); // Using the correct column name from the CSV
        console.log('Email:', row['Email Address']);
        console.log('Code:', row['Door Code']);
        try {
          await sendDoorCodeEmail(row['Email Address'], row['Door Code'], row['Full Name']);
        } catch (error) {
          console.error(`Error sending email to ${row.email}:`, error);
        }
      }
      console.log('All emails sent.');
    });
}

// Main function to update door codes and send emails
async function updateDoorCodes(csvFilePath) {
  try {
    await processCsvAndSendEmails(csvFilePath);
    console.log('Door codes updated and emails sent successfully.');
  } catch (error) {
    console.error('Error processing CSV and sending emails:', error);
  }
}

// Run the update function with the path to your CSV file
updateDoorCodes('./staffinfo.csv');