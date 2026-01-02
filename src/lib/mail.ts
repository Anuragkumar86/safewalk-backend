import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   ENV VALIDATION
========================= */
if (!process.env.BREVO_API_KEY) {
  throw new Error("❌ BREVO_API_KEY is missing in environment variables");
}

if (!process.env.BREVO_SENDER_EMAIL) {
  throw new Error("❌ BREVO_SENDER_EMAIL is missing in environment variables");
}

const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "api-key": process.env.BREVO_API_KEY,
    "Content-Type": "application/json",
  },
});

/* =========================
   EMERGENCY EMAIL
========================= */
export const sendEmergencyEmail = async (
  contactEmail: string,
  userName: string,
  lat: number | null,
  lng: number | null,
  sessionId: string
) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const liveTrackingUrl = `${baseUrl}/track/tracker/?id=${sessionId}`;
  const googleMapsUrl =
    lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;

  try {
    console.log(`📤 Sending emergency email to ${contactEmail}`);

    await brevoClient.post("/smtp/email", {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL, // MUST be verified in Brevo
        name: "Safe-Walk-Buddy",
      },
      to: [{ email: contactEmail }],
      subject: `🚨 URGENT: Safety Alert for ${userName}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; border: 2px solid #e11d48; padding: 0; border-radius: 16px; max-width: 500px; overflow: hidden; color: #1f2937; margin: auto;">
          <div style="background-color: #e11d48; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">EMERGENCY ALERT</h1>
          </div>

          <div style="padding: 25px;">
            <p>Your emergency contact <strong>${userName}</strong> failed to check in safely.</p>

            <a href="${liveTrackingUrl}" target="_blank"
              style="display:block;padding:16px;background:#e11d48;color:white;
              text-decoration:none;border-radius:12px;font-weight:bold;text-align:center;">
              🌐 View on SafeWalk Website
            </a>

            ${
              googleMapsUrl
                ? `<a href="${googleMapsUrl}" target="_blank"
                    style="display:block;margin-top:12px;padding:16px;background:#2563eb;
                    color:white;text-decoration:none;border-radius:12px;font-weight:bold;text-align:center;">
                    📍 Open in Google Maps
                  </a>`
                : ""
            }

            <p style="font-size:11px;color:#9ca3af;margin-top:20px;text-align:center;">
              Session ID: ${sessionId}<br/>
              Last Location: ${lat ?? "Unknown"}, ${lng ?? "Unknown"}
            </p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Emergency email sent to ${contactEmail}`);
  } catch (error: any) {
    console.error("❌ Failed to send emergency email:", error?.response?.data || error);
    throw error;
  }
};

/* =========================
   RESET PASSWORD EMAIL
========================= */
export const sendResetPasswordEmail = async (
  email: string,
  userName: string,
  token: string
) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  try {
    console.log(`📤 Sending password reset email to ${email}`);

    await brevoClient.post("/smtp/email", {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Safe-Walk-Buddy",
      },
      to: [{ email }],
      subject: "Password Reset Request",
      htmlContent: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;
                    border:1px solid #eee;padding:20px;border-radius:15px;">
          <h2>Password Reset</h2>
          <p>Hi ${userName},</p>
          <p>You requested a password reset. This link expires in 1 hour.</p>
          <a href="${resetUrl}"
            style="display:inline-block;padding:12px 25px;background:#e11d48;
            color:white;text-decoration:none;border-radius:10px;font-weight:bold;">
            Reset Password
          </a>
          <p style="margin-top:20px;font-size:12px;color:#6b7280;">
            If you didn’t request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error: any) {
    console.error("❌ Failed to send password reset email:", error?.response?.data || error);
    throw error;
  }
};
