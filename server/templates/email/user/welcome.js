/**
 * Welcome Email Template — HealthSphere Brand
 * Triggered after: successful email verification
 */
const welcomeTemplate = (data) => {
  const { name = "there" } = data;

  return {
    subject: `Welcome to HealthSphere, ${name}! 🎉`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to HealthSphere</title>
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

          <!-- Welcome hero banner -->
          <tr>
            <td style="background:linear-gradient(180deg,#e8f5e9 0%,#f1faf3 100%);padding:28px 40px;text-align:center;border-bottom:1px solid #c8e6c9;">
              <p style="margin:0;font-size:38px;">🎉</p>
              <h2 style="margin:10px 0 4px;color:#1b5e20;font-size:24px;font-weight:800;">You're in, ${name}!</h2>
              <p style="margin:0;color:#388e3c;font-size:14px;font-weight:600;">Your account is verified &amp; ready to go.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px 24px;">
              <p style="margin:0 0 20px;color:#4a5568;font-size:15px;line-height:1.7;">
                Welcome to <strong style="color:#2e7d32;">HealthSphere</strong> — your all-in-one platform for smarter, connected healthcare. Here's what you can do right away:
              </p>

              <!-- Feature list -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                ${[
                  ["🩺", "Book doctor appointments", "Find and schedule consultations with top-rated doctors near you."],
                  ["🩸", "Blood donation network", "Connect with donors or request blood in critical situations."],
                  ["🏥", "Healthcare camps", "Discover free & subsidised health camps in your area."],
                  ["🤖", "AI health assistant", "Get instant health insights powered by AI."],
                ]
                  .map(
                    ([icon, title, desc]) => `
                <tr>
                  <td style="padding:0 0 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:44px;vertical-align:top;padding-top:2px;">
                          <div style="background:#e8f5e9;border-radius:10px;width:36px;height:36px;text-align:center;line-height:36px;font-size:18px;">${icon}</div>
                        </td>
                        <td style="vertical-align:top;padding-left:12px;">
                          <p style="margin:0 0 2px;color:#2e7d32;font-size:14px;font-weight:700;">${title}</p>
                          <p style="margin:0;color:#718096;font-size:13px;line-height:1.5;">${desc}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`
                  )
                  .join("")}
              </table>

              <!-- CTA button -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                <tr>
                  <td style="border-radius:50px;background:linear-gradient(135deg,#2e7d32,#43a047);">
                    <a href="http://localhost:3000" target="_blank"
                       style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:50px;letter-spacing:0.3px;">
                      Go to Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#a0aec0;font-size:13px;text-align:center;line-height:1.6;">
                Need help? Reply to this email or visit our support centre.
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
                You received this because you signed up at HealthSphere. This is an automated message.
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

export default welcomeTemplate;
