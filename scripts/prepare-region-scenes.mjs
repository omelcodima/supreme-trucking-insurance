import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { regionSceneSources, regionSceneFiles } from './region-scene-sources.mjs';

const headers = { 'User-Agent': 'SupremeTruckingInsurance-SceneAssets/1.0 (https://supremetruckinginsurance.com/contact)' };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function request(url, json = true) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
    if (response.ok) return json ? response.json() : Buffer.from(await response.arrayBuffer());
    if (![429, 502, 503].includes(response.status)) throw new Error(`Asset request failed: ${response.status}`);
    await pause(2000 * (attempt + 1));
  }
  throw new Error('Asset request retries exhausted');
}
function api(host, parameters) {
  return `https://${host}/w/api.php?${new URLSearchParams({ action: 'query', format: 'json', ...parameters })}`;
}
function plain(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}
const manifestPath = 'src/lib/regionScenes.json';
const existing = JSON.parse(await readFile(manifestPath, 'utf8').catch(() => '[]'));
const scenes = [];
await mkdir('public/images/states', { recursive: true });
for (const [code, name, landmark, article] of regionSceneSources) {
  const previous = existing.find(scene => scene.code === code);
  if (previous && (!regionSceneFiles[code] || regionSceneFiles[code] === previous.title)) { scenes.push(previous); continue; }
  try {
    let title = regionSceneFiles[code];
    if (!title) {
      const result = await request(api('en.wikipedia.org', { titles: article, redirects: '1', prop: 'pageimages', piprop: 'name|original' }));
      const page = Object.values(result.query?.pages || {})[0];
      if (!page?.pageimage) throw new Error('No lead photograph');
      title = `File:${page.pageimage}`;
    }
    const result = await request(api('commons.wikimedia.org', { titles: title, prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1920' }));
    const page = Object.values(result.query?.pages || {})[0];
    const info = page?.imageinfo?.[0];
    const meta = info?.extmetadata;
    const license = meta?.LicenseShortName?.value || '';
    if (!info || !/^(CC BY|CC0|Public domain)/.test(license)) throw new Error(`Unapproved or absent license: ${license}`);
    if (!/\.(jpe?g|png|webp)$/i.test(page.title)) throw new Error('Not a photograph');
    if (/collage|montage/i.test(page.title)) throw new Error(`Montage: ${page.title}`);
    if (info.width < 1000 || info.width / info.height < 1.2) throw new Error(`Insufficient landscape dimensions: ${info.width}x${info.height} ${page.title}`);
    const downloadUrl = new URL(info.thumburl || info.url);
    downloadUrl.search = '';
    const bytes = await request(downloadUrl, false);
    const asset = `/images/states/${code.toLowerCase()}.webp`;
    await sharp(bytes).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public${asset}`);
    scenes.push({ code, name, landmark, asset, title: page.title, source: info.descriptionurl,
      author: plain(meta.Artist?.value) || 'See source photograph', license,
      licenseUrl: meta.LicenseUrl?.value || 'https://commons.wikimedia.org/wiki/Commons:Public_domain',
      original: info.url.split('?')[0], changes: 'Resized and encoded as WebP; displayed cropped with separate foreground artwork.' });
    console.log(`${code}: ${page.title} (${license})`);
    await pause(150);
  } catch (error) { console.error(`${code}: ${error.message}`); }
}
await writeFile(manifestPath, `${JSON.stringify(scenes.sort((a, b) => a.code.localeCompare(b.code)), null, 2)}\n`);
console.log(`Prepared ${scenes.length}/50 scenes. Missing: ${regionSceneSources.filter(([code]) => !scenes.some(scene => scene.code === code)).map(([code]) => code).join(', ')}`);
if (scenes.length !== 50) process.exitCode = 1;
