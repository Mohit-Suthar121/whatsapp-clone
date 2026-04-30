import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
    auth: {
        pass: process.env.BREVO_SMTP_KEY,
        user: process.env.BREVO_SMTP_USER
    }
});

(async () => {
    try {
        await transporter.verify()
        console.log("gmail configuration succesfull and ready to be used!!")
    }
    catch (error) {
        console.error("gmail configuration failed!", error.message,error.code)
    }
})()



export const sendOtpToEmail = async (email, otp) => {

    if (!email || !otp) {
        throw Error("Email and otp are required!")
    }

    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #075e54;">🔐 WhatsApp Web Verification</h2>
      
      <p>Hi there,</p>
      
      <p>Your one-time password (OTP) to verify your WhatsApp Web account is:</p>
      
      <h1 style="background: #e0f7fa; color: #000; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
        ${otp}
      </h1>

      <p><strong>This OTP is valid for the next 5 minutes.</strong> Please do not share this code with anyone.</p>

      <p>If you didn’t request this OTP, please ignore this email.</p>

      <p style="margin-top: 20px;">Thanks & Regards,<br/>WhatsApp Web Security Team</p>

      <hr style="margin: 30px 0;" />

      <small style="color: #777;">This is an automated message. Please do not reply.</small>
    </div>
  `;



    try {
        await transporter.sendMail({
            from: process.env.BREVO_SMTP_USER,
            to: email,
            subject: "Email otp",
            html
        })
        console.log("Otp sent Successfully to the email:", email)
    } catch (error) {
        console.error("some error occured in sending the otp to the email: ", error)
        throw error;
    }

}
