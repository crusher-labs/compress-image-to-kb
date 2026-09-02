#!/usr/bin/env node
// Regenerate the per-size landing pages (20kb/, 50kb/, 100kb/, 200kb/) from index.html.
// Re-run after ANY change to index.html: node scripts/gen-variants.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://crusher-labs.github.io/compress-image-to-kb/';
const VARIANTS = [
  { kb: 20, title: 'Compress Image to 20KB Online - Free, No Upload', h1: 'Compress Image to 20KB', description: 'Compress JPG, PNG or WebP images to 20KB online, free and private: no upload, the compression runs in your browser. Made for signature and photo fields on exam and government portals.', intro: 'A 20 KB limit is the strictest you will commonly meet: signature uploads and photo fields on exam registrations and government application portals often demand 10-20 KB exactly. This page has the 20 KB target preselected; drop your scanned signature or photo in, and it finds the highest quality that fits, shrinking dimensions only when it must.' },
  { kb: 50, title: 'Compress Image to 50KB Online - Free, No Upload', h1: 'Compress Image to 50KB', description: 'Compress JPG, PNG or WebP images to 50KB online, free and private: no upload, everything runs in your browser. The standard size for passport photos and application form uploads.', intro: '50 KB is the classic form-upload limit: passport-style photos, ID pictures and document scans for online applications very often cap at exactly this size. The 50 KB target is preselected here; add your image and download a file that fits under the limit at the best quality the budget allows.' },
  { kb: 100, title: 'Compress Image to 100KB Online - Free, No Upload', h1: 'Compress Image to 100KB', description: 'Compress JPG, PNG or WebP images to 100KB online, free and private: no upload, everything runs in your browser. Fits job portals, university admissions and profile photo limits.', intro: 'Job portals, university admission systems and profile-photo fields commonly cap uploads at 100 KB: enough for a sharp photo if the compression is done well. With the 100 KB target preselected, this page squeezes your image under the limit while keeping as much detail as the budget allows.' },
  { kb: 200, title: 'Compress Image to 200KB Online - Free, No Upload', h1: 'Compress Image to 200KB', description: 'Compress JPG, PNG or WebP images to 200KB online, free and private: no upload, everything runs in your browser. Right for visa applications, email attachments and document uploads.', intro: 'Visa application portals, embassy document uploads and plenty of email systems draw the line at 200 KB. That is a comfortable budget for a full-page scan or photo, and with the 200 KB target preselected here the result usually keeps close to original quality.' }
];
const src = await readFile(join(repoRoot, 'index.html'), 'utf8');
function must(cond, msg) { if (!cond) { console.error('[gen-variants] ' + msg); process.exit(1); } }
for (const v of VARIANTS) {
  let html = src; const url = BASE + v.kb + 'kb/';
  must(/<title>[^<]*<\/title>/.test(html), 'no <title>'); html = html.replace(/<title>[^<]*<\/title>/, '<title>' + v.title + '</title>');
  const seo = '<!-- SEO-META-START -->\n    <meta name="description" content="' + v.description + '">\n    <meta name="theme-color" content="#0d0b0a">\n    <link rel="canonical" href="' + url + '">\n    <meta property="og:type" content="website">\n    <meta property="og:site_name" content="Web Utility Tools by CRUSHER">\n    <meta property="og:title" content="' + v.h1 + ' - Web Utility Tools by CRUSHER">\n    <meta property="og:description" content="' + v.description + '">\n    <meta property="og:url" content="' + url + '">\n    <meta name="twitter:card" content="summary">\n    <meta name="twitter:title" content="' + v.h1 + ' - Web Utility Tools by CRUSHER">\n    <meta name="twitter:description" content="' + v.description + '">\n    <!-- SEO-META-END -->';
  must(/<!-- SEO-META-START -->[\s\S]*?<!-- SEO-META-END -->/.test(html), 'no SEO block'); html = html.replace(/<!-- SEO-META-START -->[\s\S]*?<!-- SEO-META-END -->/, seo);
  must(/<h1>[^<]*<\/h1>/.test(html), 'no h1'); html = html.replace(/<h1>[^<]*<\/h1>/, '<h1>' + v.h1 + '</h1>');
  must(/<p class="lede">[^<]*<\/p>/.test(html), 'no lede'); html = html.replace(/<p class="lede">[^<]*<\/p>/, '<p class="lede">The ' + v.kb + ' KB target is preset. Drop images in the tray, download prints that fit. No uploads, ever.</p>');
  html = html.replace(/(class="chip ck-t" type="button" data-kb="\d+") aria-pressed="true"/, '$1 aria-pressed="false"');
  const chipRe = new RegExp('(class="chip ck-t" type="button" data-kb="' + v.kb + '") aria-pressed="false"'); must(chipRe.test(html), 'no chip ' + v.kb); html = html.replace(chipRe, '$1 aria-pressed="true"');
  const anchor = '<h2>Compress an image to an exact file size</h2>'; must(html.includes(anchor), 'no prose anchor');
  const siblings = VARIANTS.filter(o => o.kb !== v.kb).map(o => '<a href="' + BASE + o.kb + 'kb/">' + o.kb + ' KB</a>').join(', ');
  html = html.replace(anchor, anchor + '\n        <p>' + v.intro + '</p>\n        <p>Other preset sizes: ' + siblings + ', or use the <a href="' + BASE + '">full tool</a> for any custom target.</p>');
  html = html.replace('OF 50 KB', 'OF ' + v.kb + ' KB').replace("setGauge(0, 50);", 'setGauge(0, ' + v.kb + ');');
  await mkdir(join(repoRoot, v.kb + 'kb'), { recursive: true }); await writeFile(join(repoRoot, v.kb + 'kb', 'index.html'), html); console.log('[gen-variants] wrote ' + v.kb + 'kb/index.html');
}
const today = new Date().toISOString().slice(0, 10); const urls = [BASE, ...VARIANTS.map(v => BASE + v.kb + 'kb/')];
await writeFile(join(repoRoot, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(u => '  <url>\n    <loc>' + u + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>' + (u === BASE ? '0.8' : '0.7') + '</priority>\n  </url>').join('\n') + '\n</urlset>\n');
console.log('[gen-variants] sitemap.xml updated (' + urls.length + ' URLs)');
