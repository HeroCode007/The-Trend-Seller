import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  try {
    // Validate environment variables
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.ADMIN_EMAIL
    ) {
      throw new Error("❌ Missing SMTP environment variables");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), // 587
      secure: false, // Must be FALSE for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Trend Seller" <${process.env.SMTP_USER}>`,
      to, // receiver
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
