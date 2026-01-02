import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);

// Optional sender (fallback safe)
const FROM_EMAIL =
  process.env.EMAIL_FROM || "Safe-Walk-Buddy <alerts@resend.dev>";

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

  // FIXED URL (unchanged)
  const liveTrackingUrl = `${baseUrl}/track/tracker/?id=${sessionId}`;

  const googleMapsUrl =
    lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: contactEmail,
      subject: `🚨 URGENT: Safety Alert for ${userName}`,
      html: `
      <div style="font-family: Arial, sans-serif; border: 2px solid #e11d48; padding: 0; border-radius: 16px; max-width: 500px; overflow: hidden; color: #1f2937; margin: auto;">
        <div style="background-color: #e11d48; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">EMERGENCY ALERT</h1>
        </div>
        
        <div style="padding: 25px;">
          <p style="font-size: 16px; line-height: 1.5;">
            Your emergency contact, <strong>${userName}</strong>, failed to check in safely.
          </p>
          
          <div style="background-color: #fef2f2; border-radius: 12px; padding: 15px; margin: 20px 0; border: 1px solid #fee2e2;">
            <p style="margin: 0; color: #991b1b; font-weight: bold; font-size: 14px;">
              ACTION REQUIRED:
            </p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              Please check their live location or contact them immediately.
            </p>
          </div>

          <a href="${liveTrackingUrl}" target="_blank"
            style="display: block; text-align: center; padding: 16px; background: #e11d48; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; margin-bottom: 12px;">
            🌐 View on SafeWalk Website
          </a>

          ${
            googleMapsUrl
              ? `
          <a href="${googleMapsUrl}" target="_blank"
            style="display: block; text-align: center; padding: 16px; background: #2563eb; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; margin-bottom: 15px;">
            📍 Open in Google Maps
          </a>
          `
              : ""
          }

          <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />

          <p style="font-size: 11px; color: #9ca3af; text-align: center;">
            Session ID: ${sessionId}<br/>
            Last Coordinates: ${lat || "Unknown"}, ${lng || "Unknown"}
          </p>
        </div>
      </div>
      `,
    });

    console.log(`✅ Emergency alert sent to: ${contactEmail}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
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
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
        <h2 style="color: #1f2937;">Password Reset</h2>
        <p>Hi ${userName},</p>
        <p>
          You requested a password reset. Click the button below to set a new password.
          This link expires in 1 hour.
        </p>
        <a href="${resetUrl}"
          style="display: inline-block; padding: 12px 25px; background-color: #e11d48; color: white; text-decoration: none; border-radius: 10px; font-weight: bold;">
          Reset Password
        </a>
        <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
      `,
    });

    console.log(`✅ Password reset email sent to: ${email}`);
  } catch (error) {
    console.error("❌ Reset email failed:", error);
    throw error;
  }
};
