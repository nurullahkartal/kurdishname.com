async function traceRedirects(startUrl) {
  let url = startUrl;
  console.log(`\n=== TRACING: ${startUrl} ===`);
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, { redirect: 'manual' });
    console.log(`Hop ${i+1}: ${url} -> HTTP [${res.status}]`);
    const loc = res.headers.get('location');
    if (loc) {
      url = new URL(loc, url).href;
    } else {
      console.log(`FINAL DESTINATION REACHED: ${url} (HTTP ${res.status} OK)`);
      break;
    }
  }
}

async function run() {
  await traceRedirects('https://kurdishname.com/');
  await traceRedirects('http://kurdishname.com/');
  await traceRedirects('https://www.kurdishname.com/');
  await traceRedirects('http://www.kurdishname.com/');
}

run();
