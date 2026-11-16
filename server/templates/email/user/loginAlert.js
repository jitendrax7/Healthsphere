/**
 * New Login Security Alert Email Template — HealthSphere
 * Triggered after: every successful login
 */
const loginAlertTemplate = (data) => {
  const {
    name = "there",
    ip = "Unknown",
    device = "Unknown Device",
    browser = "Unknown Browser",
    os = "Unknown OS",
    location = "Unknown Location",
    time = new Date().toUTCString(),
  } = data;

  return {
    subject: `🔐 New Login to Your HealthSphere Account`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Login Alert — HealthSphere</title>
</head>
<body style="margin:0;padding:0;background:#f1faf3;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1faf3;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="100%" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(46,125,50,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2e7d32 0%,#43a047 60%,#66bb6a 100%);padding:32px 40px 28px;text-align:center;">
              <table role="presentation" align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:rgba(255,255,255,0.18);border-radius:14px;width:52px;height:52px;text-align:center;vertical-align:middle;">
                    <span style="font-size:28px;line-height:52px;">&#10084;</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin:12px 0 0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">HealthSphere</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.80);font-size:12px;font-weight:500;letter-spacing:0.8px;">YOUR HEALTH, OUR MISSION</p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background:linear-gradient(180deg,#fff8e1 0%,#fffde7 100%);padding:24px 40px 20px;text-align:center;border-bottom:1px solid #ffe082;">
              <p style="margin:0;font-size:34px;">🔐</p>
              <h2 style="margin:10px 0 4px;color:#e65100;font-size:22px;font-weight:800;">New Login Detected</h2>
              <p style="margin:0;color:#bf360c;font-size:14px;font-weight:500;">Hi <strong>${name}</strong>, we noticed a new sign-in to your account.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 40px 20px;">
              <p style="margin:0 0 20px;color:#4a5568;font-size:15px;line-height:1.7;">
                Your <strong style="color:#2e7d32;">HealthSphere</strong> account was just accessed. Here are the details of this login:
              </p>

              <!-- Login Detail Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="background:#f9fafb;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:24px;">

                <!-- Row: Time -->
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;vertical-align:middle;width:40px;">
                    <span style="font-size:20px;">🕐</span>
                  </td>
                  <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;color:#718096;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Date &amp; Time</p>
                    <p style="margin:3px 0 0;color:#2d3748;font-size:14px;font-weight:600;">${time}</p>
                  </td>
                </tr>

                <!-- Row: IP Address -->
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;vertical-align:middle;">
                    <span style="font-size:20px;">🌐</span>
                  </td>
                  <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;color:#718096;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">IP Address</p>
                    <p style="margin:3px 0 0;color:#2d3748;font-size:14px;font-weight:600;">${ip}</p>
                  </td>
                </tr>

                <!-- Row: Location -->
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;vertical-align:middle;">
                    <span style="font-size:20px;">📍</span>
                  </td>
                  <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;color:#718096;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Location</p>
                    <p style="margin:3px 0 0;color:#2d3748;font-size:14px;font-weight:600;">${location}</p>
                  </td>
                </tr>

                <!-- Row: Device -->
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;vertical-align:middle;">
                    <span style="font-size:20px;">💻</span>
                  </td>
                  <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;color:#718096;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Device</p>
                    <p style="margin:3px 0 0;color:#2d3748;font-size:14px;font-weight:600;">${device}</p>
                  </td>
                </tr>

                <!-- Row: Browser -->
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;vertical-align:middle;">
                    <span style="font-size:20px;">🧭</span>
                  </td>
                  <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;color:#718096;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Browser</p>
                    <p style="margin:3px 0 0;color:#2d3748;font-size:14px;font-weight:600;">${browser}</p>
                  </td>
                </tr>

                <!-- Row: OS -->
                <tr>
                  <td style="padding:14px 20px;vertical-align:middle;">
                    <span style="font-size:20px;">🖥️</span>
                  </td>
                  <td style="padding:14px 20px;">
                    <p style="margin:0;color:#718096;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Operating System</p>
                    <p style="margin:3px 0 0;color:#2d3748;font-size:14px;font-weight:600;">${os}</p>
                  </td>
                </tr>

              </table>

              <!-- Security notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="background:#fff3e0;border-radius:10px;border-left:4px solid #ff9800;padding:0;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;color:#e65100;font-size:14px;font-weight:700;">⚠️ Wasn't you?</p>
                    <p style="margin:0;color:#bf360c;font-size:13px;line-height:1.6;">
                      If you didn't sign in, your account may be at risk. Please change your password immediately and contact our support team.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 20px;">
                <tr>
                  <td style="border-radius:50px;background:linear-gradient(135deg,#2e7d32,#43a047);">
                    <a href="https://www.healthsphere.me/settings/security" target="_blank"
                       style="display:inline-block;padding:13px 36px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:50px;letter-spacing:0.3px;">
                      Secure My Account &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#a0aec0;font-size:13px;text-align:center;line-height:1.6;">
                If this was you, no action is needed. You can safely ignore this email.
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
                © 2025 HealthSphere &middot; All rights reserved
              </p>
              <p style="margin:0;color:#a0aec0;font-size:12px;">
                This is an automated security alert sent for every new login to your account.
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

export default loginAlertTemplate;
