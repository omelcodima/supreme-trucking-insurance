import Airtable from 'airtable';

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;

if (!airtableApiKey || !airtableBaseId) {
  console.error('Airtable API Key or Base ID is not set in environment variables.');
  // For production, you might want to throw an error or handle this more gracefully
}

// Lead routes must fail fast when Airtable is unavailable. The SDK otherwise
// retries every 429 indefinitely enough to consume Vercel's five-minute limit,
// which prevents the independent email delivery path from running.
const base = new Airtable({
  apiKey: airtableApiKey,
  noRetryIfRateLimited: true,
  requestTimeout: 10_000,
}).base(airtableBaseId || '');

export const getQuotesTable = (tableName: string) => base(tableName);
export const getDocsTable = (tableName: string) => base(tableName);
