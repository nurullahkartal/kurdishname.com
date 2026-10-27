import os

out_dir = 'out'
deleted_count = 0

for root, dirs, files in os.walk(out_dir):
    for file in files:
        if file.endswith('.txt') and file.lower() != 'robots.txt':
            file_path = os.path.join(root, file)
            try:
                os.remove(file_path)
                deleted_count += 1
            except Exception as e:
                pass

total_files = 0
for root, dirs, files in os.walk(out_dir):
    total_files += len(files)

print(f"Silinen .txt dosyasi: {deleted_count}")
print(f"out/ Kalan Toplam Dosya: {total_files}")
assert total_files < 20000, f"Hata: Dosya sayisi 20000'den fazla ({total_files})"
print("✅ Cloudflare Free plan limiti (< 20.000 dosya) başarıyla sağlandı!")
