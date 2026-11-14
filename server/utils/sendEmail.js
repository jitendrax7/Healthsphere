import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email via Resend API.
 * Drop-in replacement for the previous nodemailer-based sendEmail util.
 *
 * @param {string} email      - Recipient email address
 * @param {string} subject    - Email subject line
 * @param {string} html       - HTML body of the email
 * @returns {Promise<boolean>} - true on success, false on failure
 */
const sendEmail = async (email, subject, html) => {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("SendEmail Error:", error);
    return false;
  }
};

export default sendEmail;
