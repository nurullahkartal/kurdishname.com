import socket
import sys
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

_orig_getaddrinfo = socket.getaddrinfo
def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _getaddrinfo_ipv4

creds = service_account.Credentials.from_service_account_file(
    'service_account.json',
    scopes=['https://www.googleapis.com/auth/webmasters']
)
service = build('searchconsole', 'v1', credentials=creds)
SITE_URL = 'sc-domain:kurdishname.com'

def main():
    res = service.sitemaps().list(siteUrl=SITE_URL).execute()
    sitemaps = res.get('sitemap', [])
    print(f"Toplam GSC'de Kayitli Sitemap Sayisi: {len(sitemaps)}")
    for i, s in enumerate(sitemaps, 1):
        path = s.get('path')
        last_dl = s.get('lastDownloaded', 'Beklemede (Siraya alindi)')
        pending = s.get('isPending', False)
        errors = s.get('errors', 0)
        print(f"{i:2d}. {path} | Son Indirme: {last_dl} | Pending: {pending} | Hata: {errors}")

if __name__ == '__main__':
    main()
