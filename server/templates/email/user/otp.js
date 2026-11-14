/**
 * OTP Email Template — HealthSphere Brand
 * Triggered during: registration & login (unverified account)
 */
const otpTemplate = (data) => {
  const { name = "there", otp } = data;

  return {
    subject: "Your HealthSphere Verification Code",

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification – HealthSphere</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f1faf3;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1faf3;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(46,125,50,0.10);">

          <!-- Header gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#2e7d32 0%,#43a047 60%,#66bb6a 100%);padding:36px 40px 32px;text-align:center;">
              <!-- Logo mark -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:rgba(255,255,255,0.18);border-radius:14px;width:52px;height:52px;text-align:center;vertical-align:middle;">
                    <span style="font-size:28px;line-height:52px;">&#10084;</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin:14px 0 0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">HealthSphere</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.80);font-size:13px;font-weight:500;letter-spacing:0.5px;">YOUR HEALTH, OUR MISSION</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 20px;">
              <h2 style="margin:0 0 8px;color:#1b5e20;font-size:22px;font-weight:700;">Email Verification</h2>
              <p style="margin:0 0 24px;color:#4a5568;font-size:15px;line-height:1.6;">
                Hi <strong style="color:#2e7d32;">${name}</strong>, thanks for joining HealthSphere!<br/>
                Use the one-time code below to verify your email address.
              </p>

              <!-- OTP box -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="background:#f1faf3;border:2px dashed #66bb6a;border-radius:14px;padding:22px 48px;text-align:center;">
                    <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#2e7d32;font-family:'Courier New',Courier,monospace;">${otp}</span>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#fff8e1;border-left:4px solid #f9a825;border-radius:0 8px 8px 0;padding:12px 16px;">
                    <p style="margin:0;color:#6d4c00;font-size:13px;">
                      ⏱&nbsp;&nbsp;<strong>This code expires in 10 minutes.</strong> Do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#718096;font-size:14px;line-height:1.6;">
                If you didn't create a HealthSphere account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e8f5e9;margin:0;" /></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;text-align:center;">
              <p style="margin:0 0 6px;color:#a0aec0;font-size:12px;">
                © 2025 HealthSphere · All rights reserved
              </p>
              <p style="margin:0;color:#a0aec0;font-size:12px;">
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`,
  };
};

export default otpTemplate;
