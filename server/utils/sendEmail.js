import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({

  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});

// console.log("Email transporter configured with user:", process.env.EMAIL_USER);

const sendEmail = async (email, subject, html) => {

  try {
    await transporter.sendMail({

      from: `HealthSphere <${process.env.EMAIL_USER}>`,

      to: email,

      subject,

      html   // change text → html

    });

    return true;

  } catch (error) {

    console.log("Email error:", error);

    return false;

  }

};

export default sendEmail;