async function main() {
  const res = await fetch('https://kurdishname.com/tr/isim/bahoz');
  const html = await res.text();

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  console.log('Title:', titleMatch ? titleMatch[1] : 'none');

  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  console.log('H1:', h1Match ? h1Match[1] : 'none');

  const metaMatch = html.match(/name="description" content="([^"]+)"/);
  console.log('Meta Description:', metaMatch ? metaMatch[1] : 'none');

  const canonicalMatch = html.match(/rel="canonical" href="([^"]+)"/);
  console.log('Canonical:', canonicalMatch ? canonicalMatch[1] : 'none');

  // Check Schema JSON-LD
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  console.log('Schema count:', schemas.length);
  schemas.forEach((s, i) => {
    try {
      const obj = JSON.parse(s[1]);
      console.log(`Schema #${i + 1} @type:`, obj['@type'] || (obj['@graph'] && obj['@graph'].map(g => g['@type'])));
    } catch (e) {
      console.log(`Schema #${i + 1} parse error:`, e.message);
    }
  });

  // Check Headings (h2, h3)
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('H2 headings:', h2s);

  // Check Word Count
  const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                       .replace(/<style[\s\S]*?<\/style>/gi, '')
                       .replace(/<[^>]+>/g, ' ')
                       .replace(/\s+/g, ' ')
                       .trim();
  const words = textOnly.split(' ').filter(w => w.length > 1);
  console.log('Visible Word Count:', words.length);
}

main().catch(console.error);
