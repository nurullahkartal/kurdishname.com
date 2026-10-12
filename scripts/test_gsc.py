import os
import sys
import socket

# Force IPv4 to prevent hanging/SSL errors on networks with problematic IPv6 routing
_orig_getaddrinfo = socket.getaddrinfo
def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _getaddrinfo_ipv4

from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/webmasters'
]
KEY_FILE = os.path.join(os.path.dirname(__file__), '..', 'service_account.json')

def test_connection():
    if not os.path.exists(KEY_FILE):
        print(f"Hata: {KEY_FILE} bulunamadi.")
        return

    try:
        credentials = service_account.Credentials.from_service_account_file(
            KEY_FILE, scopes=SCOPES
        )
        email = credentials.service_account_email
        print(f"Service Account: {email}")
        
        service = build('searchconsole', 'v1', credentials=credentials)
        sites = service.sites().list().execute()
        
        site_entries = sites.get('siteEntry', [])
        print("API Baglantisi basarili!")
        if not site_entries:
            print("Durum: Henuz bu Hizmet Hesabina (Service Account) erisim yetkisi verilmis bir GSC mulku bulunamadi.")
            print(f"Lutfen Google Search Console panelinizde mulkunuze su e-postayi kullanici olarak ekleyin:")
            print(f"-> {email}")
        else:
            print(f"Erisilebilen Mulkler ({len(site_entries)} adet):")
            for entry in site_entries:
                print(f" - {entry.get('siteUrl')} (Yetki seviyesi: {entry.get('permissionLevel')})")

    except Exception as e:
        print(f"GSC Baglanti Hatasi: {e}")

if __name__ == '__main__':
    test_connection()
