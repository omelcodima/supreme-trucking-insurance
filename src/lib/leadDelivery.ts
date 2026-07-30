export type LeadDeliveryChannel = {
  name: string;
  deliver: () => Promise<unknown>;
};

export type LeadDeliveryResult = {
  delivered: string[];
  failed: Array<{ name: string; code: string }>;
};

export class LeadDeliveryUnavailableError extends Error {
  constructor(channels: string[]) {
    super(`Every lead delivery channel failed: ${channels.join(", ")}`);
    this.name = "LeadDeliveryUnavailableError";
  }
}

function failureCode(reason: unknown) {
  if (reason && typeof reason === "object") {
    const status = "statusCode" in reason ? reason.statusCode : "status" in reason ? reason.status : undefined;
    if (typeof status === "number") return `HTTP_${status}`;
  }

  return reason instanceof Error && reason.name ? reason.name : "UnknownError";
}

export async function deliverLeadWithFallback(channels: LeadDeliveryChannel[]): Promise<LeadDeliveryResult> {
  if (channels.length === 0) throw new LeadDeliveryUnavailableError(["unconfigured"]);

  const settled = await Promise.allSettled(
    channels.map((channel) => Promise.resolve().then(() => channel.deliver())),
  );

  const delivered: string[] = [];
  const failed: Array<{ name: string; code: string }> = [];

  settled.forEach((result, index) => {
    const channel = channels[index];
    if (result.status === "fulfilled") {
      delivered.push(channel.name);
      return;
    }

    const failure = { name: channel.name, code: failureCode(result.reason) };
    failed.push(failure);
    // Deliberately log only channel + error class/status, never the lead payload
    // or an upstream response body that could contain credentials or PII.
    console.error("Lead delivery channel failed.", failure);
  });

  if (delivered.length === 0) {
    throw new LeadDeliveryUnavailableError(failed.map(({ name, code }) => `${name}:${code}`));
  }

  return { delivered, failed };
}