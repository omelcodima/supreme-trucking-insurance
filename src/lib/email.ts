type SendLeadEmailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

function htmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textToHtml(text: string) {
  return `<pre style="font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;line-height:1.5;color:#1f2933">${htmlEscape(text)}</pre>`;
}

export async function sendLeadEmail({ to, subject, text, replyTo }: SendLeadEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Supreme Trucking Insurance <quotes@supremetruckinginsurance.com>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set. Quote notification email was not sent.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "supreme-trucking-insurance/1.0",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html: textToHtml(text),
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend email failed with status ${response.status}${detail ? `: ${detail}` : ""}`);
  }

  return response.json().catch(() => ({ ok: true }));
}
