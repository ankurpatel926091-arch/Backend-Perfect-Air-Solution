import { renderEmailTemplate, renderInfoRows, styleTokens } from "../utils/emailTemplate.js";
import { sendHtmlEmail } from "../utils/resendEmail.js";

export const sendOrderEmail = async (order) => {
  const mailOptions = {
    to: order.customer.email,
    subject: "Order Confirmation",
    html: renderEmailTemplate({
      title: `Thank you for your order, ${order.customer.fullName}`,
      subtitle: "Your order has been placed successfully",
      bodyHtml: `
        <div style="${styleTokens.infoWrap}">
          ${renderInfoRows([
            { label: "Product", value: order.product?.title || "N/A" },
            { label: "Brand", value: order.product?.brand || "N/A" },
            { label: "Quantity", value: order.quantity || "N/A" },
            { label: "Total Amount", value: `INR ${order.amount}` },
          ])}
        </div>
        <p style="margin:14px 0 8px;font-size:13px;color:#475569;"><strong>Delivery Address</strong></p>
        <div style="${styleTokens.infoWrap}">
          <p style="margin:0;font-size:14px;line-height:1.7;color:#1e293b;">
            ${order.customer?.address || ""}, ${order.customer?.city || ""}, ${order.customer?.state || ""} - ${order.customer?.pinCode || ""}
          </p>
        </div>
      `,
      footerNote: "Perfect Air Solution Team",
    }),
  };

  await sendHtmlEmail(mailOptions);
  console.log(`Order confirmation email sent to: ${order.customer.email}`);
};

export const sendBookingEmail = async (booking) => {
  const adminRecipient = process.env.ADMIN_EMAIL;
  if (!adminRecipient) {
    throw new Error("ADMIN_EMAIL is missing");
  }

  const adminMailOptions = {
  to: adminRecipient,
  subject: "New Enquiry Received - Perfect Air Solution",
  html: renderEmailTemplate({
    title: "New Enquiry Received",
    subtitle: "A customer has submitted an enquiry form",
    bodyHtml: `
      <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#334155;">
        A new enquiry has been received through your website. Please review the details below and contact the customer as soon as possible.
      </p>

      <div style="${styleTokens.infoWrap}">
        ${renderInfoRows([
          { label: "Name", value: booking.name },
          { label: "Email", value: booking.email },
          { label: "Phone", value: booking.phone },
          { label: "Service", value: booking.service },
        ])}
      </div>
    `,
    footerNote: `
      Admin Notification<br/><br/>
      <span style="font-size:12px;color:#64748b;">
        This is an automated alert from Perfect Air Solution
      </span>
    `,
  }),
};

const userMailOptions = {
  to: booking.email,
  subject: "Enquiry Received - Perfect Air Solution",
  html: renderEmailTemplate({
    title: `Hello ${booking.name}, your enquiry has been received`,
    subtitle: "Thank you for reaching out to Perfect Air Solution",
    bodyHtml: `
      <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#334155;">
        Thank you for contacting us. We have successfully received your enquiry, 
        and our team will review your request and get back to you shortly.
      </p>

      <div style="${styleTokens.infoWrap}">
        ${renderInfoRows([
          { label: "Name", value: booking.name },
          { label: "Phone", value: booking.phone },
          { label: "Service", value: booking.service },
        ])}
      </div>
    `,
    footerNote: `
      Regards,<br/>
      Perfect Air Solution Team<br/><br/>
      <span style="font-size:12px;color:#64748b;">
        This is an automated email from Perfect Air Solution
      </span>
    `,
  }),
};

  const [adminResult, userResult] = await Promise.allSettled([
    sendHtmlEmail(adminMailOptions),
    sendHtmlEmail(userMailOptions),
  ]);

  if (adminResult.status === "fulfilled") {
    console.log(`Booking admin email sent to: ${adminRecipient}`);
  }

  if (adminResult.status === "rejected") {
    console.error("Booking admin email failed:", adminResult.reason?.message || adminResult.reason);
  }

  if (userResult.status === "fulfilled") {
    console.log(`Booking user email sent to: ${booking.email}`);
  }

  if (userResult.status === "rejected") {
    console.error("Booking user email failed:", userResult.reason?.message || userResult.reason);
  }

  if (adminResult.status === "rejected" && userResult.status === "rejected") {
    throw new Error("Both booking emails failed");
  }
};
