const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('csvImport', { csvData: null, currentPage: 1, totalPages: 1, totalRows: 0, showSendButton: false });
});

app.post('/import', upload.single('csvFile'), (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            fs.unlinkSync(req.file.path);
            req.session.fullData = results;
            const currentPage = 1;
            const rowsPerPage = 10;
            const totalPages = Math.ceil(results.length / rowsPerPage);
            const paginatedData = results.slice(0, rowsPerPage);
            res.render('csvImport', { 
                csvData: paginatedData, 
                currentPage: currentPage, 
                totalPages: totalPages,
                totalRows: results.length,
                showSendButton: true
            });
        });
});

app.get('/page/:pageNum', (req, res) => {
    const pageNum = parseInt(req.params.pageNum) || 1;
    const rowsPerPage = 10;
    const fullData = req.session.fullData;
    if (!fullData) {
        return res.redirect('/');
    }
    const totalPages = Math.ceil(fullData.length / rowsPerPage);
    const startIndex = (pageNum - 1) * rowsPerPage;
    const paginatedData = fullData.slice(startIndex, startIndex + rowsPerPage);
    res.render('csvImport', { 
        csvData: paginatedData, 
        currentPage: pageNum, 
        totalPages: totalPages,
        totalRows: fullData.length,
        showSendButton: true
    });
});

app.post('/send-emails', async (req, res) => {
    const fullData = req.session.fullData;
    if (!fullData) {
        return res.status(400).send('No CSV data found. Please import a CSV file first.');
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Render the email template with placeholder values
    const emailTemplate = await ejs.renderFile(
        path.join(__dirname, 'views', 'emailTemplate2.ejs'),
        { fullName: '{{fullName}}', doorCode: '{{doorCode}}' }
    );

    let successCount = 0;
    let errorCount = 0;

    for (const row of fullData) {
        console.log('Processing row:', row);
        console.log('Email field:', row['Email Address']);

        if (!row['Email Address']) {
            console.error('Skipping row due to missing email:', row);
            errorCount++;
            continue;
        }

        // Replace placeholders with actual values
        const personalizedHtml = emailTemplate
            .replace('{{fullName}}', row['Full Name'] || 'Valued Customer')
            .replace('{{doorCode}}', row['Door Code'] || 'N/A');

        const mailOptions = {
            from: '"HSA Belmont IT" <scanner2@hsabelmont.org>',
            to: row['Email Address'],
            subject: 'Your Personal Door Code',
            html: personalizedHtml
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${row['Email Address']}`);
            successCount++;
        } catch (error) {
            console.error(`Error sending email to ${row['Email Address']}:`, error);
            errorCount++;
        }
    }

    // Render the result template instead of sending a plain text response
    res.render('emailSentResult', { successCount, errorCount });
});

app.get('/preview-email', async (req, res) => {
    const fullData = req.session.fullData;
    if (!fullData || fullData.length === 0) {
        return res.status(400).send('No CSV data found. Please import a CSV file first.');
    }

    const firstRow = fullData[0];
    const emailTemplate = await ejs.renderFile(
        path.join(__dirname, 'views', 'emailTemplate2.ejs'),
        { 
            fullName: firstRow['Full Name'] || 'Valued Customer',
            doorCode: firstRow['Door Code'] || 'N/A'
        }
    );

    res.render('emailPreview', { emailHtml: emailTemplate });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));