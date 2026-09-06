import { sendLeadEmail, type EmailAttachment } from "./email";

export const leadNotificationEmail = process.env.LEAD_NOTIFICATION_EMAIL || "info@supremetruckinginsurance.com";

type LeadTag = {
  name: string;
  value: string;
};

type LeadEmailInput = {
  leadType: string;
  company?: string;
  contactEmail?: string;
  subject: string;
  text: string;
  attachments?: EmailAttachment[];
};

type CustomerEmailInput = {
  to: string;
  subject: string;
  text: string;
  leadType: string;
};

type FollowUpInput = {
  to: string;
  name?: string;
  company?: string;
  source: string;
};

function tagValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "unknown";
}

function tags(leadType: string, company?: string): LeadTag[] {
  return [
    { name: "lead_type", value: tagValue(leadType) },
    { name: "company", value: tagValue(company || "unknown") },
  ];
}

export async function sendInternalLeadNotification({
  leadType,
  company,
  contactEmail,
  subject,
  text,
  attachments,
}: LeadEmailInput) {
  return sendLeadEmail({
    to: leadNotificationEmail,
    subject,
    text,
    replyTo: contactEmail,
    tags: tags(leadType, company),
    attachments,
  });
}

export async function sendCustomerAutoReply({ to, subject, text, leadType }: CustomerEmailInput) {
  if (!to) return;

  try {
    await sendLeadEmail({
      to,
      subject,
      text,
      tags: tags(`${leadType}_auto_reply`),
    });
  } catch (error) {
    console.error(`Customer auto-reply failed for ${leadType}:`, error);
  }
}

export async function scheduleQuoteFollowUps({ to, name, company, source }: FollowUpInput) {
  // Agent-submitted requests must not enroll the agency inbox in customer follow-ups.
  if (!to || to.trim().toLowerCase() === leadNotificationEmail.trim().toLowerCase()) return;

  const greeting = name ? `Hi ${name},` : "Hi,";
  const companyLine = company ? ` for ${company}` : "";
  const messages = [
    {
      scheduledAt: "in 1 day",
      subject: "A quick next step for your trucking quote",
      text: [
        greeting,
        "",
        `We received your trucking insurance request${companyLine}. If you have a declarations page, driver list, vehicle schedule, or current renewal details, replying with those helps us review the file faster.`,
        "",
        "This is not a bindable quote or coverage confirmation. Final pricing depends on underwriting, filings, vehicles, drivers, losses, commodities, radius, and carrier appetite.",
        "",
        "Supreme Trucking Insurance",
        "(360) 936-7196",
      ].join("\n"),
    },
    {
      scheduledAt: "in 3 days",
      subject: "Still need trucking insurance options?",
      text: [
        greeting,
        "",
        "Checking in on your trucking insurance request. If your renewal, filing, or load deadline is coming up, reply with the timing and we can prioritize the review.",
        "",
        "Useful items: DOT/MC number, vehicle list, driver list, current declarations page, and loss runs if available.",
        "",
        "Supreme Trucking Insurance",
        "(360) 936-7196",
      ].join("\n"),
    },
    {
      scheduledAt: "in 7 days",
      subject: "Do you want us to keep working on your trucking quote?",
      text: [
        greeting,
        "",
        "We can keep the file open if you still want trucking insurance options. Reply with any updates or call us directly, and we will help with the next step.",
        "",
        "Supreme Trucking Insurance",
        "(360) 936-7196",
      ].join("\n"),
    },
  ];

  for (const message of messages) {
    try {
      await sendLeadEmail({
        to,
        subject: message.subject,
        text: message.text,
        scheduledAt: message.scheduledAt,
        tags: tags(`follow_up_${source}`, company),
      });
    } catch (error) {
      console.error(`Scheduled follow-up failed for ${source}:`, error);
    }
  }
}
