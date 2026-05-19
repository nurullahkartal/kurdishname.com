-- Cloudflare D1 Veritabanı Şeması
-- Bu şemayı veritabanınıza uygulamak için şu komutu çalıştırabilirsiniz:
-- npx wrangler d1 execute kurdishname-db --local --file=schema.sql
-- npx wrangler d1 execute kurdishname-db --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  gender TEXT,
  country TEXT,
  device TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performans optimizasyonu için indeksler
CREATE INDEX IF NOT EXISTS idx_analytics_name_id ON analytics(name_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_locale ON analytics(locale);
