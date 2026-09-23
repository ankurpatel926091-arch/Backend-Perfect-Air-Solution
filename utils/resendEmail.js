import { Resend } from "resend";

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing");
  }

  return new Resend(process.env.RESEND_API_KEY);
};

const getFromEmail = () => {
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is missing");
  }

  return fromEmail;
};

export const sendHtmlEmail = async ({ to, subject, html }) => {
  const resend = getResendClient();
  const fromEmail = getFromEmail();

  const { data, error } = await resend.emails.send({
    from: `"Perfect Air Solution" <${fromEmail}>`,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email via Resend");
  }

  return data;
};
