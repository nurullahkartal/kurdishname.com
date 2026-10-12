import fs from 'fs';
import path from 'path';
// OpenAI kütüphanesini indirmek için: npm install openai
import OpenAI from 'openai';

// API Anahtarınızı buraya yazın veya .env dosyasından çekin
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "http://localhost:11434/v1", 
});

const DATA_PATH = path.join(__dirname, '../src/data/names_master.json');
const OUTPUT_PATH = path.join(__dirname, '../src/data/names_enriched.json');

const SYSTEM_PROMPT = `
Rol: Sen Kürt dili, Mezopotamya tarihi ve antropoloji konusunda uzman, 40 yıllık deneyime sahip saygın bir etimolog ve kıdemli dil bilimcisin.
Görevin, sana verilen Kürtçe ismin verilerini kullanarak, Google SEO kriterlerine uygun, tamamen özgün, edebi derinliği olan ve doğrudan insan elinden çıkmış doğallıkta iki paragraf oluşturmaktır.

KRİTİK GÖRÜNMEZLİK TALİMATI:
Asla kendi varlığından, yapay zekadan, makine öğreniminden veya modellerden bahsetme. Cevaplarında kesinlikle "AI tarafından üretildi", "Bence", "Emin değilim", "bu model", "algoritma", "üretilmiştir" veya "yapay zeka" gibi ifadeler kullanma. Kendini hiçbir şekilde bir yapay zeka asistanı olarak tanıtma veya hissettirme. Yazdığın her cümle saygın bir akademik ansiklopedi maddesi kadar kesin, özgün ve tamamen insan elinden çıkmış gibi kusursuz, doğal ve akıcı olmalıdır.

Kurallar:
1. (Etimolojik Köken Analizi): İsmin fonetik yapısını, kökenini ve dil ailesindeki yerini anlat. Sadece "kökeni Kürtçedir" deme; Mezopotamya'nın kadim kültüründen, doğayla olan bağından veya tarihsel gelişiminden bahset.
2. (Kültürel Bağlam & Sembolizm): İsmin taşıdığı anlamın Kürt kültüründeki karşılığını, toplumsal değerini ve bu ismi taşıyan birinin hangi karakter özelliklerini temsil edebileceğini anlat.
3. Çeşitlilik (Kritik): Asla aynı kalıpları kullanma!
4. Anlam Enjeksiyonu: Paragrafın içinde mutlaka ismin gerçek anlamını doğal bir şekilde geçir.
5. Dil: Çıktıyı Türkçe (tr), İngilizce (en), Almanca (de) ve Arapça (ar) olmak üzere 4 dilde hazırla.

ASLA JSON formatı dışında bir metin (Markdown, giriş, sonuç cümlesi) döndürme. Doğrudan JSON döndür.
Çıktı Formatı Şeması:
{
  "tr": { "etymology": "...", "symbolism": "..." },
  "en": { "etymology": "...", "symbolism": "..." },
  "de": { "etymology": "...", "symbolism": "..." },
  "ar": { "etymology": "...", "symbolism": "..." }
}
`;

async function enrichNames() {
  const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
  const names = JSON.parse(rawData);
  
  // Kaldığı yerden devam etmesi için mevcut dosyayı oku
  let enrichedData: any[] = [];
  if (fs.existsSync(OUTPUT_PATH)) {
    enrichedData = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
  }

  const enrichedIds = new Set(enrichedData.map(n => n.id));
  const namesToProcess = names.filter((n: any) => !enrichedIds.has(n.id));

  console.log(`Toplam isim: ${names.length} | İşlenecek isim: ${namesToProcess.length}`);

  for (const nameItem of namesToProcess) {
    try {
      console.log(`[${nameItem.id}] İşleniyor...`);
      
      const prompt = `İsim: ${nameItem.name}\nCinsiyet: ${nameItem.gender}\nAnlam: ${nameItem.meaning}\nKöken: ${nameItem.origin || "Kürtçe"}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Veya "gpt-4o"
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" } // Sadece JSON dönmesini zorlar
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      enrichedData.push({
        ...nameItem,
        story: result
      });

      // Her işlemden sonra kaydet ki elektrik kesilirse gitmesin
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(enrichedData, null, 2));
      console.log(`[${nameItem.id}] Başarıyla kaydedildi.`);

      // Saniyede çok istek atmamak için kısa bir bekleme
      await new Promise(r => setTimeout(r, 500));

    } catch (error) {
      console.error(`[${nameItem.id}] Hata oluştu:`, error);
      break; // Kritik bir API hatasıysa (Bakiye bitmesi vb.) döngüyü kır
    }
  }

  console.log("İşlem Tamamlandı!");
}

enrichNames();
