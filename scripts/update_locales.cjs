const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');

const updates = {
  en: {
    seo_home_title: "Kurdish Names Meaning & Culture Encyclopedia (10,000+ Names) - KurdishName.com",
    seo_home_description: "Discover the most comprehensive archive of over 10,000 Kurdish names. Explore detailed meanings, historical origins, etymology, and modern baby name guides."
  },
  de: {
    seo_home_title: "Kurdische Namen Bedeutung & Kultur-Enzyklopädie (10.000+ Namen)",
    seo_home_description: "Entdecken Sie das weltweit umfassendste Archiv mit über 10.000 kurdischen Namen. Finden Sie detaillierte Bedeutungen, Herkunft, Etymologie und Namensratgeber."
  },
  ar: {
    seo_home_title: "معاني الأسماء الكردية وموسوعة الثقافة (أكثر من 10,000 اسم)",
    seo_home_description: "اكتشف الأرشيف الأكثر شمولاً لأكثر من 10,000 اسم كردي. استكشف المعاني الدقيقة، الأصول التاريخية، علم الاشتقاق، وأدلة أسماء المواليد الحديثة."
  }
};

['en', 'de', 'ar'].forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.seo_home_title = updates[lang].seo_home_title;
    data.seo_home_description = updates[lang].seo_home_description;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}.json`);
  }
});
