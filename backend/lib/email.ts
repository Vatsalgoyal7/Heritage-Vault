import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendOTPEmail(email: string, otp: string, purpose: string = 'Verification') {
  if (!process.env.SMTP_USER) {
    console.log(`[DEV MODE] OTP for ${email} (${purpose}): ${otp}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Heritage Vault" <noreply@heritagevault.app>',
      to: email,
      subject: `Heritage Vault - Your OTP for ${purpose}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #38bdf8;">Heritage Vault</h2>
          <p>Your One-Time Password (OTP) for <strong>${purpose}</strong> is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #38bdf8; background: #1e293b; padding: 12px 24px; border-radius: 6px; display: inline-block; margin: 16px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: 1px solid #334155; margin-top: 24px;" />
          <p style="font-size: 12px; color: #94a3b8;">Heritage Vault — Preserving Your Digital Legacy</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendInactivityAlert(email: string, daysInactive: number, resetUrl: string) {
  console.log(`[INACTIVITY SAFETY PROTOCOL ALERT] ${email} has been inactive for ${daysInactive} days. Reset URL: ${resetUrl}`);
  if (!process.env.SMTP_USER) return true;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `🚨 Heritage Vault — Security & Inactivity Verification (${daysInactive} Days)`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc;">
          <h2 style="color: #f43f5e;">Heritage Vault — Inactivity Safety Protocol Alert</h2>
          <p>We noticed you haven't logged into your Heritage Vault account for <strong>${daysInactive} days</strong>.</p>
          <p>If you are safe, please click the link below immediately to reset your activity timer:</p>
          <a href="${resetUrl}" style="background: #38bdf8; color: #0f172a; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">I AM SAFE — RESET TIMER</a>
          <p style="color: #cbd5e1;">If no response is received by Day 90, your assigned digital legacy files will be transferred to your designated nominees.</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error('Failed to send Inactivity Safety Protocol email:', err);
    return false;
  }
}
