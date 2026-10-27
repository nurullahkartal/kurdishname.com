#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KurdishName Full Live Site URL Audit
Checks all ~19,576 static pages against live Cloudflare Pages.
Filters and lists only URLs that DO NOT return HTTP 200 OK.
"""

import asyncio
import aiohttp
import glob
import re
import sys
import json
import time
import urllib.parse

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

CONCURRENCY_LIMIT = 35
REQUEST_TIMEOUT = 12
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (KurdishName-Audit/2.0)"

def collect_urls():
    urls = set()
    sitemap_files = glob.glob('public/sitemap-*.xml')
    for f in sitemap_files:
        with open(f, 'r', encoding='utf-8') as fp:
            found = re.findall(r'<loc>(https://kurdishname.com[^<]+)</loc>', fp.read())
            urls.update(found)
    
    # Also ensure root is included
    urls.add('https://kurdishname.com/')
    return sorted(list(urls))

async def check_url(session, sem, url, stats, non_200_list):
    async with sem:
        retries = 2
        for attempt in range(retries + 1):
            try:
                # Encode non-ascii characters properly for HTTP header
                parsed = urllib.parse.urlsplit(url)
                encoded_path = urllib.parse.quote(parsed.path, safe='/%:;+=?@&')
                target_url = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, encoded_path, parsed.query, parsed.fragment))
                
                async with session.head(
                    target_url,
                    allow_redirects=False,
                    timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)
                ) as resp:
                    # Some servers or edge workers return 405 for HEAD; if so, fallback to GET
                    if resp.status == 405:
                        async with session.get(
                            target_url,
                            allow_redirects=False,
                            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)
                        ) as get_resp:
                            status = get_resp.status
                            location = get_resp.headers.get('Location', '')
                    else:
                        status = resp.status
                        location = resp.headers.get('Location', '')

                    if status == 429:
                        # Rate limited, back off and retry
                        await asyncio.sleep(1.5 * (attempt + 1))
                        continue

                    stats['checked'] += 1
                    if status == 200:
                        stats['200_ok'] += 1
                    else:
                        stats['non_200'] += 1
                        entry = {
                            'url': url,
                            'status': status,
                            'location': location
                        }
                        non_200_list.append(entry)
                        print(f"❌ [STATUS {status}] {url} -> Location: {location}")
                    return

            except (asyncio.TimeoutError, aiohttp.ClientError) as e:
                if attempt == retries:
                    stats['checked'] += 1
                    stats['error'] += 1
                    entry = {
                        'url': url,
                        'status': 'ERROR',
                        'error': str(e)
                    }
                    non_200_list.append(entry)
                    print(f"⚠️ [NET ERROR] {url}: {e}")
                else:
                    await asyncio.sleep(1.0)

async def progress_reporter(stats, total):
    start_time = time.time()
    while stats['checked'] < total:
        await asyncio.sleep(5)
        done = stats['checked']
        elapsed = time.time() - start_time
        speed = done / elapsed if elapsed > 0 else 0
        eta = (total - done) / speed if speed > 0 else 0
        print(f"⏳ İlerleme: {done}/{total} (%{done*100/total:.1f}) | 200 OK: {stats['200_ok']} | Hata/Non-200: {stats['non_200'] + stats['error']} | Hız: {speed:.1f} url/sn | Kalan: ~{int(eta)}sn")

async def main():
    urls = collect_urls()
    total = len(urls)
    print(f"🔍 Toplam taranacak benzersiz URL sayısı: {total}")
    print(f"⚡ Eşzamanlı bağlantı sınırı: {CONCURRENCY_LIMIT}")

    stats = {
        'checked': 0,
        '200_ok': 0,
        'non_200': 0,
        'error': 0
    }
    non_200_list = []

    sem = asyncio.Semaphore(CONCURRENCY_LIMIT)
    headers = {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
    }
    connector = aiohttp.TCPConnector(limit=CONCURRENCY_LIMIT, ssl=False, keepalive_timeout=30)

    async with aiohttp.ClientSession(connector=connector, headers=headers) as session:
        reporter = asyncio.create_task(progress_reporter(stats, total))
        tasks = [check_url(session, sem, u, stats, non_200_list) for u in urls]
        await asyncio.gather(*tasks)
        reporter.cancel()

    print("\n" + "="*50)
    print("📊 CANLI SİTE DENETİM RAPORU")
    print("="*50)
    print(f"Toplam Kontrol Edilen: {stats['checked']}")
    print(f"✅ 200 OK Dönenler   : {stats['200_ok']}")
    print(f"❌ 200 Dönmeyenler   : {len(non_200_list)}")

    output_file = "non_200_urls.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(non_200_list, f, indent=2, ensure_ascii=False)
    print(f"📁 200 dönmeyenlerin listesi kaydedildi: {output_file}")

    if not non_200_list:
        print("🎉 MÜKEMMEL! Sitedeki tüm sayfalar firesiz HTTP 200 OK döndürmektedir.")
    else:
        print(f"⚠️ Toplam {len(non_200_list)} adet sayfa 200 dönmedi! Detaylar aşağıda:")
        for item in non_200_list[:20]:
            print(f"  - [{item.get('status')}] {item['url']}")

if __name__ == '__main__':
    asyncio.run(main())
