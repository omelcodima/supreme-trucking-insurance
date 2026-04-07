import Airtable from 'airtable';

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;

if (!airtableApiKey || !airtableBaseId) {
  console.error('Airtable API Key or Base ID is not set in environment variables.');
  // For production, you might want to throw an error or handle this more gracefully
}

const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId || '');

export const getQuotesTable = (tableName: string) => base(tableName);
export const getDocsTable = (tableName: string) => base(tableName);
