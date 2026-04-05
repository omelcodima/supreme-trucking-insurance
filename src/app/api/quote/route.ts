import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Save to local JSON file
    const dataDirPath = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDirPath, { recursive: true }); // Ensure directory exists
    const filePath = path.join(dataDirPath, 'quotes.json');
    let quotes = [];
    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      quotes = JSON.parse(fileContents);
    } catch (readError: unknown) {
      if ((readError as NodeJS.ErrnoException).code === 'ENOENT') {
        // File doesn't exist, start with an empty array
        console.log('quotes.json not found, creating new file.');
      } else {
        console.error('Error reading quotes.json:', readError);
        // Continue even if there's an error reading, to attempt writing new data
      }
    }

    quotes.push({ ...data, timestamp: new Date().toISOString() });
    await fs.writeFile(filePath, JSON.stringify(quotes, null, 2), 'utf8');
    console.log('Quote saved to quotes.json');

    // 2. Send to webhook URL
    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!webhookResponse.ok) {
          console.error(`Webhook failed with status: ${webhookResponse.status}`);
        } else {
          console.log('Quote data sent to webhook successfully.');
        }
      } catch (webhookError) {
        console.error('Error sending data to webhook:', webhookError);
      }
    } else {
      console.warn('LEADS_WEBHOOK_URL is not set in environment variables. Skipping webhook.');
    }

    return NextResponse.json({ message: 'Quote submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/quote:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
