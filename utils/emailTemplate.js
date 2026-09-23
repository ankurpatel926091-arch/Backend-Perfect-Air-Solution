const brandName = "Perfect Air Solution";

const baseStyles = {
  body: "margin:0;padding:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;",
  container: "max-width:640px;margin:0 auto;padding:24px 14px;",
  card: "background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);",
  header: "background:linear-gradient(135deg,#0f172a 0%,#0b5fa8 100%);padding:24px 24px 22px;color:#ffffff;",
  title: "margin:0;font-size:24px;line-height:1.25;font-weight:700;",
  subtitle: "margin:8px 0 0;font-size:13px;line-height:1.6;opacity:0.9;",
  section: "padding:20px 24px;",
  copy: "margin:0 0 14px;font-size:14px;line-height:1.7;color:#334155;",
  infoWrap: "margin:8px 0 0;padding:14px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;",
  row: "margin:0 0 8px;font-size:14px;line-height:1.6;color:#1e293b;",
  footer: "padding:18px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;font-size:12px;line-height:1.6;color:#64748b;",
};

export const renderInfoRows = (rows = []) =>
  rows
    .filter((r) => r && r.label)
    .map(
      (r) =>
        `<p style="${baseStyles.row}"><strong>${r.label}:</strong> ${r.value ?? "N/A"}</p>`
    )
    .join("");

export const renderEmailTemplate = ({ title, subtitle, bodyHtml, footerNote }) => `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="${baseStyles.body}">
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.header}">
          <h1 style="${baseStyles.title}">${brandName}</h1>
          <p style="${baseStyles.subtitle}">${subtitle || "Professional HVAC Sales and Services"}</p>
        </div>
        <div style="${baseStyles.section}">
          <p style="${baseStyles.copy}"><strong>${title}</strong></p>
          ${bodyHtml}
        </div>
        <div style="${baseStyles.footer}">
          ${footerNote || `${brandName} Team`}<br/>
          This is an automated email from ${brandName}.
        </div>
      </div>
    </div>
  </body>
</html>
`;

export const styleTokens = baseStyles;
