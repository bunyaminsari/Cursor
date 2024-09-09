const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, './templates/emailTemplate2.ejs'),
      { 
        fullName: req.query.name || 'John Doe',
        doorCode: req.query.code || '1234'
      }
    );
    res.send(html);
  } catch (error) {
    console.error('Error rendering template:', error);
    res.status(500).send('Error rendering template');
  }
});

app.listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}`);
});