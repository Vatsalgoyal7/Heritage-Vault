const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'championgamer2367@gmail.com',
    pass: 'vkeogsdqtsjggzoa',
  },
});

transporter.sendMail({
  from: '"Heritage Vault" <championgamer2367@gmail.com>',
  to: 'championgamer2367@gmail.com',
  subject: 'Heritage Vault - SMTP Test Successful',
  html: `
    <div style="font-family:Arial,sans-serif;padding:30px;background:#0f172a;color:#f8fafc;border-radius:12px;max-width:480px;">
      <h2 style="color:#10b981;margin-bottom:8px;">Heritage Vault</h2>
      <p style="color:#94a3b8;font-size:13px;margin-bottom:24px;">Email Notification System</p>
      <h3 style="color:#f8fafc;">SMTP Setup Successful!</h3>
      <p>Your email notifications are now fully active. OTPs and Inactivity Safety Alerts will be delivered to nominees.</p>
      <div style="background:#1e293b;padding:16px 24px;border-radius:8px;margin:20px 0;text-align:center;">
        <p style="color:#94a3b8;font-size:11px;margin:0 0 8px;">Sample OTP Code</p>
        <p style="color:#10b981;font-size:32px;font-weight:bold;letter-spacing:8px;margin:0;">2 3 6 7</p>
      </div>
      <p style="color:#64748b;font-size:11px;margin-top:24px;">Heritage Vault — Preserving Your Digital Legacy</p>
    </div>
  `,
}, (err, info) => {
  if (err) {
    console.error('SMTP FAILED:', err.message);
    process.exit(1);
  } else {
    console.log('EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
    console.log('Check inbox: championgamer2367@gmail.com');
  }
});
