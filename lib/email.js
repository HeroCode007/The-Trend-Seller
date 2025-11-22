import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html, sendToAdmins = false }) {
  try {
    // Validate environment variables
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      throw new Error("❌ Missing SMTP environment variables");
    }

    // Determine recipients
    let recipients = to;
    if (sendToAdmins) {
      if (!process.env.ADMIN_EMAIL) {
        throw new Error("❌ ADMIN_EMAIL not set in .env");
      }
      // Use comma-separated admin emails
      recipients = process.env.ADMIN_EMAIL;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // must be false for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Trend Seller" <${process.env.SMTP_USER}>`,
      to: recipients,
      subject,
      html,
    });

    console.log("📨 Email sent successfully: ", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Email error:", error);
    return { success: false, error: error.message };
  }
}
