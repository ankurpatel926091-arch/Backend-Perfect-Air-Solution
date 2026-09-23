import { renderEmailTemplate, renderInfoRows, styleTokens } from "./emailTemplate.js";
import { sendHtmlEmail } from "./resendEmail.js";

const sendNewsletterEmail = async (email) => {
  try {
    // Admin notification
    const adminRecipient = process.env.ADMIN_EMAIL;
    if (!adminRecipient) {
      throw new Error("ADMIN_EMAIL is missing");
    }

    await sendHtmlEmail({
      to: adminRecipient,
      subject: "New Newsletter Subscriber",
      html: renderEmailTemplate({
        title: "New Newsletter Subscriber",
        subtitle: "A user subscribed from the website",
        bodyHtml: `
          <div style="${styleTokens.infoWrap}">
            ${renderInfoRows([{ label: "Subscriber Email", value: email }])}
          </div>
        `,
        footerNote: "Admin Notification",
      }),
    });
    console.log(`Newsletter admin email sent to: ${adminRecipient}`);

    // Welcome email
    await sendHtmlEmail({
      to: email,
      subject: "Welcome to Our Newsletter",
      html: renderEmailTemplate({
        title: "Welcome to Perfect Air Solution Newsletter",
        subtitle: "You are now subscribed to Perfect Air Solution",
        bodyHtml: `
          <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#334155;">
            Thank you for subscribing. You will receive HVAC updates, maintenance tips, and exclusive offers.
          </p>
          <div style="${styleTokens.infoWrap}">
            ${renderInfoRows([{ label: "Subscribed Email", value: email }])}
          </div>
        `,
        footerNote: "Perfect Air Solution Team",
      }),
    });
    console.log(`Newsletter user email sent to: ${email}`);

    console.log("Newsletter emails sent");
  } catch (error) {
    console.error("Email error:", error.message);
  }
};

export default sendNewsletterEmail;
