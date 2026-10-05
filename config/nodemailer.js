import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendContactInquiryEmail = async ({ name, phone, email, service, message }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Nodemailer: EMAIL_USER or EMAIL_PASS not configured in .env");
    return;
  }

  const formattedDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const adminMailOptions = {
    from: `"Perfect Air Solution" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email || undefined,
    subject: `🚨 New Contact Inquiry: ${name} (${service || "General"})`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #03172C 0%, #0284C7 100%); padding: 24px 28px; text-align: left;">
          <h2 style="color: #ffffff; margin: 0 0 6px; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Perfect Air Solution</h2>
          <p style="color: #e0f2fe; margin: 0; font-size: 13px; font-weight: 500;">New Customer Lead / Inquiry Notification</p>
        </div>

        <div style="padding: 28px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600; width: 130px;">Name</td>
              <td style="padding: 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600;">Phone</td>
              <td style="padding: 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
                <a href="tel:${phone}" style="color: #0284c7; text-decoration: none;">📞 ${phone || "Not provided"}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600;">Email</td>
              <td style="padding: 12px 0; color: #0f172a; font-size: 14px;">
                ${email ? `<a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">✉️ ${email}</a>` : "Not provided"}
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600;">Service</td>
              <td style="padding: 12px 0; color: #0284c7; font-size: 14px; font-weight: 700;">
                <span style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 4px 10px; border-radius: 9999px;">
                  ${service || "General Inquiry"}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600;">Date & Time</td>
              <td style="padding: 12px 0; color: #475569; font-size: 13px;">${formattedDate}</td>
            </tr>
          </table>

          <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
            <p style="margin: 0 0 6px; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Customer Message</p>
            <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message || "No message provided"}</p>
          </div>

          <div style="text-align: center; padding-top: 10px;">
            ${
              phone
                ? `<a href="tel:${phone}" style="display: inline-block; background: #0284c7; color: #ffffff; padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-right: 10px;">Call Customer</a>`
                : ""
            }
            ${
              phone
                ? `<a href="https://wa.me/91${phone.replace(/[^0-9]/g, "")}" style="display: inline-block; background: #25d366; color: #ffffff; padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none;">WhatsApp</a>`
                : ""
            }
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 12px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">Perfect Air Solution • Automated Notification</p>
        </div>
      </div>
    `,
  };

  // Send admin notification
  await transporter.sendMail(adminMailOptions);

  // If customer provided their email, send them a confirmation
  if (email && email.includes("@")) {
    try {
      const userMailOptions = {
        from: `"Perfect Air Solution" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Thank you for contacting Perfect Air Solution`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: #03172C; padding: 22px 28px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">Perfect Air Solution</h2>
              <p style="color: #38bdf8; margin: 4px 0 0; font-size: 12px; font-weight: 600;">HVAC & Air Conditioning Experts</p>
            </div>
            <div style="padding: 26px 28px;">
              <p style="color: #0f172a; font-size: 15px; margin: 0 0 12px;">Hello <strong>${name}</strong>,</p>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
                Thank you for reaching out to us. We have received your inquiry regarding <strong>${service || "our services"}</strong>.
              </p>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
                Our engineering team is reviewing your requirements and will contact you via phone or email shortly.
              </p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 18px; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: #64748b; font-size: 12px; margin: 0 0 4px; font-weight: 600;">Need immediate assistance?</p>
                <p style="color: #0284c7; font-size: 14px; font-weight: 700; margin: 0;">📞 Call: +91 84291 52092 | ✉️ info@perfectairsolution.com</p>
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">Best regards,<br><strong style="color: #475569;">Perfect Air Solution Team</strong></p>
            </div>
          </div>
        `,
      };
      await transporter.sendMail(userMailOptions);
    } catch (userErr) {
      console.error("Nodemailer: Failed to send user confirmation email:", userErr.message);
    }
  }
};

export default transporter;
