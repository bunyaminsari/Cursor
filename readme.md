This is a simple Node.js application that sends an email to a list of recipients with a new door code. It uses the `nodemailer` library to send the email and the `dotenv` library to load environment variables from a `.env` file.

## Getting Started

1. Clone the repository
2. Install the dependencies
3. Create a `.env` file with the following variables:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
4. Run the application

## Usage

To run the application, use the following command:

```bash
node app.js

