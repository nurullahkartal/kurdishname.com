import os
import sys
import socket
from datetime import datetime, timedelta

# Force IPv4 to prevent issues on networks with problematic IPv6 routing
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

def get_service():
    if not os.path.exists(KEY_FILE):
        raise FileNotFoundError(f"{KEY_FILE} dosyası bulunamadı.")
    credentials = service_account.Credentials.from_service_account_file(
        KEY_FILE, scopes=SCOPES
    )
    return build('searchconsole', 'v1', credentials=credentials)

def list_sites():
    service = get_service()
    sites = service.sites().list().execute()
    return sites.get('siteEntry', [])

def query_search_analytics(site_url, start_date=None, end_date=None, dimensions=None, row_limit=50):
    """
    dimensions: list of strings, e.g. ['query'], ['page'], ['query', 'page'], ['date', 'device']
    """
    service = get_service()
    if not end_date:
        end_date = (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d')
    if not start_date:
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    if not dimensions:
        dimensions = ['query']

    body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': dimensions,
        'rowLimit': row_limit
    }
    response = service.searchanalytics().query(siteUrl=site_url, body=body).execute()
    return response.get('rows', [])

def inspect_url(site_url, inspection_url):
    service = get_service()
    body = {
        'inspectionUrl': inspection_url,
        'siteUrl': site_url
    }
    response = service.urlInspection().index().inspect(body=body).execute()
    return response.get('inspectionResult', {})

if __name__ == '__main__':
    sites = list_sites()
    if not sites:
        print("Erişilebilir mülk yok. Lütfen Search Console'dan yetki verin.")
    else:
        for s in sites:
            print(f"Mülk: {s.get('siteUrl')} | Yetki: {s.get('permissionLevel')}")
