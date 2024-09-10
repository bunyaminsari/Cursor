# CSV Email Sender

This application allows users to import a CSV file containing contact information, preview the data, and send personalized emails to the contacts.

## Features

- CSV file import
- Data preview with pagination
- Email template preview
- Bulk email sending

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later) installed on your machine
- npm (Node Package Manager) installed

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/csv-email-sender.git
   cd csv-email-sender
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.

2. Add the following environment variables to the `.env` file:
   ```
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_SECURE=true_or_false
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   ```
   Replace the values with your actual SMTP server details.

## Usage

1. Start the application:
   ```
   npm start
   ```
   Or, if you want to run it in development mode with auto-restart:
   ```
   npm run dev
   ```

2. Open your web browser and navigate to `http://localhost:3000`.

3. Use the application:
   - Click "Choose File" to select your CSV file, then click "Import CSV" to upload it.
   - The imported data will be displayed in a paginated table.
   - Click "Preview Email" to see how the email will look for the first contact in your CSV.
   - Click "Send Emails" to send emails to all contacts in the CSV file.

## CSV File Format

Your CSV file should have the following columns:
- Full Name
- Email Address
- Door Code

Example:

Full Name,Email Address,Door Code
John Doe,john.doe@example.com,1234
Jane Smith,jane.smith@example.com,5678

Make sure your CSV file is properly formatted and does not contain any extra columns or rows.


## Customization

- To modify the email template, edit the `views/emailTemplate2.ejs` file.
- To change the page layout or styling, edit the `views/csvImport.ejs` and `views/emailPreview.ejs` files.

## Troubleshooting

- If emails are not being sent, check your SMTP configuration in the `.env` file.
- Ensure your CSV file matches the expected format.
- Check the console for any error messages.

## Contributing

Contributions to the CSV Email Sender are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## License

This project uses the following license: [MIT License](LICENSE.md).
