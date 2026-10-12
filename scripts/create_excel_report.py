import os
import pandas as pd

REPORTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'gsc_reports')
EXCEL_PATH = os.path.join(REPORTS_DIR, 'Search_Console_Tum_Raporlar.xlsx')

def create_excel():
    csv_files = {
        'Anahtar Kelimeler': 'anahtar_kelimeler_tum_zamanlar.csv',
        'Sayfalar': 'sayfalar_tum_zamanlar.csv',
        'Kelime & Sayfa Detay': 'kelime_ve_sayfa_detay.csv',
        'Günlük Performans': 'gunluk_performans.csv',
        'Ülkeler': 'ulkeler_performans.csv',
        'Cihazlar': 'cihazlar_performans.csv',
        'URL İndeks Denetimi': 'url_indeks_denetimi.csv'
    }

    with pd.ExcelWriter(EXCEL_PATH, engine='openpyxl') as writer:
        for sheet_name, csv_name in csv_files.items():
            csv_path = os.path.join(REPORTS_DIR, csv_name)
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                df.to_excel(writer, sheet_name=sheet_name, index=False)
                print(f"Sheet eklendi: {sheet_name} ({len(df)} satir)")

    print(f"\nConsolidated Excel olusturuldu: {EXCEL_PATH}")

if __name__ == '__main__':
    create_excel()
