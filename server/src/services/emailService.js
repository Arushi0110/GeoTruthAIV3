const nodemailer = require('nodemailer');

/**
 * emailService - Handles sending professional emails
 * Note: To send real emails, you need to provide valid SMTP credentials in .env
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    // Create a transporter (using placeholders for now)
    // To use Gmail: service: 'gmail', auth: { user: '...', pass: '...' }
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER || 'mock_user',
        pass: process.env.EMAIL_PASS || 'mock_pass',
      },
    });

    const mailOptions = {
      from: '"GeoTruthAI Team" <no-reply@geotruthai.com>',
      to: userEmail,
      subject: 'Welcome to GeoTruthAI! 🛡️ Your journey to truth starts here',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(to right, #2563eb, #4f46e5); color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 15px; font-size: 30px; margin: 0 auto; display: inline-block;">🛡️</div>
            <h1 style="color: #1e3a8a; margin-top: 15px;">GeoTruthAI</h1>
          </div>
          
          <div style="background-color: #f8fafc; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e40af;">Welcome, ${userName}!</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for joining <strong>GeoTruthAI</strong>. You are now part of a global effort to fight misinformation and verify the truth using cutting-edge AI.
            </p>
            
            <div style="margin: 30px 0; padding: 20px; background-color: #eff6ff; border-radius: 15px; border-left: 5px solid #3b82f6;">
              <p style="margin: 0; font-weight: bold; color: #1e3a8a;">What's next?</p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Verify your first piece of news on the <strong>Verify News</strong> page.</li>
                <li>Track your trust score and accuracy in the <strong>Dashboard</strong>.</li>
                <li>View detailed trends and history in <strong>Analytics</strong>.</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/login" style="background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 12px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                Sign In to Your Account
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8;">
            <p>&copy; 2025 GeoTruthAI Platform. All rights reserved.</p>
            <p>You received this email because you recently signed up for a GeoTruthAI account.</p>
          </div>
        </div>
      `,
    };

    // For local testing without real SMTP, we'll just log it
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'mock_user') {
      console.log('-----------------------------------------');
      console.log('📧 [MOCK EMAIL SENT]');
      console.log(`To: ${userEmail}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log('-----------------------------------------');
      return { success: true, mock: true };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Real email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

const sendPasswordResetEmail = async (userEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER || 'mock_user',
        pass: process.env.EMAIL_PASS || 'mock_pass',
      },
    });

    const resetToken = Math.random().toString(36).substring(2, 10).toUpperCase();

    const mailOptions = {
      from: '"GeoTruthAI Security" <security@geotruthai.com>',
      to: userEmail,
      subject: 'Reset Your GeoTruthAI Password 🔐',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e3a8a;">Password Reset Request</h2>
          <p>We received a request to reset your password. Use the following temporary code to sign in and update your security settings:</p>
          <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb;">${resetToken}</span>
          </div>
          <p>If you did not request this, please ignore this email or contact support.</p>
          <p style="color: #64748b; font-size: 12px; margin-top: 40px;">This is a temporary code and will expire in 1 hour.</p>
        </div>
      `,
    };

    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'mock_user') {
      console.log('-----------------------------------------');
      console.log('🔐 [MOCK RESET EMAIL SENT]');
      console.log(`To: ${userEmail}`);
      console.log(`Code: ${resetToken}`);
      console.log('-----------------------------------------');
      return { success: true, mock: true };
    }

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending reset email:', error);
    return { success: false };
  }
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
