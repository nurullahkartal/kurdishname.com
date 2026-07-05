const fs = require('fs');
const path = require('path');

const MASTER_JSON_PATH = path.join(__dirname, '../names_master.json');
const BLOG_DIR = path.join(__dirname, '../src/data/blog');
const BLOG_POSTS_REGISTRY_PATH = path.join(__dirname, '../src/data/blogPosts.ts');

const LANGUAGES = ['tr', 'en', 'de', 'ar'];

// Utilities
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function formatDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Load names
if (!fs.existsSync(MASTER_JSON_PATH)) {
  console.error('names_master.json not found!');
  process.exit(1);
}

const allNames = JSON.parse(fs.readFileSync(MASTER_JSON_PATH, 'utf-8'));
const dateStr = formatDate();

// Categories to generate 100 posts
// 1. A-Z Letters -> Boy Names (29 letters)
// 2. A-Z Letters -> Girl Names (29 letters)
// 3. Length based (3-letters, 4-letters, 5-letters) x 2 genders (6 posts)
// 4. Themes (nature, power, beauty, light, wisdom) x 2 genders (10 posts)
// 5. General A-Z (26 letters) -> Just "Kürtçe İsimler"
// Total: 29 + 29 + 6 + 10 + 26 = 100 posts!

const alphabetKurdish = ['A','B','C','Ç','D','E','Ê','F','G','H','I','Î','J','K','L','M','N','O','P','Q','R','S','Ş','T','U','Û','V','W','X','Y','Z'];
const alphabetStandard = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

const postsMeta = [];

function generatePost(id, type, param, gender, namesArray) {
  // We need exactly 10-20 top names for listicle
  const listicleNames = namesArray.slice(0, 20).map(n => n.id);
  if (listicleNames.length < 3) return; // Skip if too few names

  let titleTr, titleEn, titleDe, titleAr;
  let descTr, descEn, descDe, descAr;
  let slugTr, slugEn, slugDe, slugAr;
  let tagsTr, tagsEn, tagsDe, tagsAr;
  let contentTr, contentEn, contentDe, contentAr;

  if (type === 'letter_boy') {
    titleTr = `${param} Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri`;
    titleEn = `Most Beautiful Kurdish Boy Names Starting with Letter ${param}`;
    titleDe = `Die schönsten kurdischen Jungennamen mit dem Buchstaben ${param}`;
    titleAr = `أجمل أسماء الأولاد الكردية التي تبدأ بحرف ${param}`;
    
    descTr = `${param} harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.`;
    descEn = `List of unique, modern, and meaningful Kurdish boy names starting with ${param}. Great suggestions for expecting families.`;
    descDe = `Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit ${param}. Tolle Vorschläge für werdende Familien.`;
    descAr = `قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف ${param}. اقتراحات رائعة للعائلات.`;
    
    slugTr = `${param.toLowerCase()}-harfi-kurtce-erkek-isimleri`;
    slugEn = `${param.toLowerCase()}-letter-kurdish-boy-names`;
    slugDe = `${param.toLowerCase()}-buchstabe-kurdische-jungennamen`;
    slugAr = `اسماء-اولاد-كردية-بحرف-${param.toLowerCase()}`;
    
    tagsTr = ["Erkek İsimleri", `${param} Harfi`, "Kürtçe İsimler"];
    tagsEn = ["Boy Names", `Letter ${param}`, "Kurdish Names"];
    tagsDe = ["Jungennamen", `Buchstabe ${param}`, "Kurdische Namen"];
    tagsAr = ["أسماء أولاد", `حرف ${param}`, "أسماء كردية"];
    
    contentTr = `## ${param} Harfi Kürtçe Erkek İsimleri\n\nErkek çocukları için isim seçimi, ailelerin en çok zorlandığı konulardan biridir. ${param} harfi ile başlayan isimler Mezopotamya'nın köklü geçmişinden ilham alır.`;
    contentEn = `## Kurdish Boy Names Starting with ${param}\n\nChoosing a name for boys is one of the most challenging tasks for families. Names starting with ${param} draw inspiration from the deep-rooted history of Mesopotamia.`;
    contentDe = `## Kurdische Jungennamen mit ${param}\n\nDie Wahl eines Namens für Jungen ist eine der schwierigsten Aufgaben für Familien. Namen mit ${param} lassen sich von der tief verwurzelten Geschichte Mesopotamiens inspirieren.`;
    contentAr = `## أسماء أولاد كردية تبدأ بحرف ${param}\n\nاختيار اسم للأولاد هو من أصعب المهام للعائلات. الأسماء التي تبدأ بـ ${param} تستلهم من تاريخ بلاد ما بين النهرين العميق.`;
  } else if (type === 'letter_girl') {
    titleTr = `${param} Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri`;
    titleEn = `Most Beautiful Kurdish Girl Names Starting with Letter ${param}`;
    titleDe = `Die schönsten kurdischen Mädchennamen mit dem Buchstaben ${param}`;
    titleAr = `أجمل أسماء البنات الكردية التي تبدأ بحرف ${param}`;
    
    descTr = `${param} harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.`;
    descEn = `List of delicate, modern, and meaningful Kurdish girl names starting with ${param}. Special name suggestions for your baby.`;
    descDe = `Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit ${param}. Besondere Namensvorschläge für Ihr Baby.`;
    descAr = `قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف ${param}. اقتراحات أسماء خاصة لطفلتك.`;
    
    slugTr = `${param.toLowerCase()}-harfi-kurtce-kiz-isimleri`;
    slugEn = `${param.toLowerCase()}-letter-kurdish-girl-names`;
    slugDe = `${param.toLowerCase()}-buchstabe-kurdische-maedchennamen`;
    slugAr = `اسماء-بنات-كردية-بحرف-${param.toLowerCase()}`;
    
    tagsTr = ["Kız İsimleri", `${param} Harfi`, "Kürtçe İsimler"];
    tagsEn = ["Girl Names", `Letter ${param}`, "Kurdish Names"];
    tagsDe = ["Mädchennamen", `Buchstabe ${param}`, "Kurdische Namen"];
    tagsAr = ["أسماء بنات", `حرف ${param}`, "أسماء كردية"];
    
    contentTr = `## ${param} Harfi Kürtçe Kız İsimleri\n\nKız çocukları için Kürtçe isim seçerken doğanın ve güzelliğin izleri sıkça görülür. İşte ${param} harfiyle başlayan en nadide isimler.`;
    contentEn = `## Kurdish Girl Names Starting with ${param}\n\nWhen choosing Kurdish names for girls, traces of nature and beauty are often seen. Here are the rarest names starting with ${param}.`;
    contentDe = `## Kurdische Mädchennamen mit ${param}\n\nBei der Auswahl kurdischer Namen für Mädchen sind oft Spuren von Natur und Schönheit zu erkennen. Hier sind die seltensten Namen, die mit ${param} beginnen.`;
    contentAr = `## أسماء بنات كردية تبدأ بحرف ${param}\n\nعند اختيار الأسماء الكردية للبنات، غالبًا ما تُرى آثار الطبيعة والجمال. إليك أندر الأسماء التي تبدأ بـ ${param}.`;
  } else if (type === 'letter_generic') {
    titleTr = `${param} Harfi İle Başlayan Duyulmamış Kürtçe İsimler`;
    titleEn = `Unique Kurdish Names Starting with Letter ${param}`;
    titleDe = `Einzigartige kurdische Namen mit dem Buchstaben ${param}`;
    titleAr = `أسماء كردية فريدة تبدأ بحرف ${param}`;
    
    descTr = `${param} harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.`;
    descEn = `Archive of the most unique Kurdish names starting with ${param}. Cultural meanings and origins.`;
    descDe = `Archiv der einzigartigsten kurdischen Namen beginnend mit ${param}. Kulturelle Bedeutungen und Ursprünge.`;
    descAr = `أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف ${param}. المعاني الثقافية والأصول.`;
    
    slugTr = `${param.toLowerCase()}-harfi-kurtce-isimler-rehberi`;
    slugEn = `${param.toLowerCase()}-letter-kurdish-names-guide`;
    slugDe = `${param.toLowerCase()}-buchstabe-kurdische-namen-ratgeber`;
    slugAr = `دليل-الاسماء-الكردية-بحرف-${param.toLowerCase()}`;
    
    tagsTr = ["Kürtçe İsimler", `${param} Harfi`];
    tagsEn = ["Kurdish Names", `Letter ${param}`];
    tagsDe = ["Kurdische Namen", `Buchstabe ${param}`];
    tagsAr = ["أسماء كردية", `حرف ${param}`];
    
    contentTr = `## ${param} Harfi Kürtçe İsimler\n\nİsimlerin harf analizleri kültürümüzde önemlidir. ${param} harfi ile başlayan isimlerin taşıdığı enerji ve anlam derinliklerini inceledik.`;
    contentEn = `## Kurdish Names Starting with ${param}\n\nLetter analysis of names is important in our culture. We examined the energy and depth of meaning carried by names starting with ${param}.`;
    contentDe = `## Kurdische Namen mit ${param}\n\nDie Buchstabenanalyse von Namen ist in unserer Kultur wichtig. Wir haben die Energie und Bedeutungstiefe von Namen, die mit ${param} beginnen, untersucht.`;
    contentAr = `## أسماء كردية تبدأ بحرف ${param}\n\nتحليل حروف الأسماء مهم في ثقافتنا. قمنا بفحص الطاقة وعمق المعنى الذي تحمله الأسماء التي تبدأ بـ ${param}.`;
  } else if (type === 'length') {
    let boygirl = gender === 'female' ? 'Kız' : 'Erkek';
    let boygirlEn = gender === 'female' ? 'Girl' : 'Boy';
    let boygirlDe = gender === 'female' ? 'Mädchen' : 'Jungen';
    let boygirlAr = gender === 'female' ? 'بنات' : 'أولاد';
    
    titleTr = `${param} Harfli Kısa ve Öz Kürtçe ${boygirl} İsimleri`;
    titleEn = `${param}-Letter Short and Sweet Kurdish ${boygirlEn} Names`;
    titleDe = `${param}-Buchstaben Kurze und Süße Kurdische ${boygirlDe}namen`;
    titleAr = `أسماء ${boygirlAr} كردية قصيرة وجميلة من ${param} حروف`;
    
    descTr = `${param} harften oluşan, modern, kolay telaffuz edilen ve estetik duran Kürtçe ${boygirl.toLowerCase()} isimleri listesi.`;
    descEn = `A list of ${param}-letter Kurdish ${boygirlEn.toLowerCase()} names that are modern, easy to pronounce, and aesthetic.`;
    descDe = `Eine Liste von ${param}-buchstabigen kurdischen ${boygirlDe.toLowerCase()}namen, die modern, leicht auszusprechen und ästhetisch sind.`;
    descAr = `قائمة بأسماء ${boygirlAr} كردية مكونة من ${param} حروف، حديثة وسهلة النطق وذات جمالية.`;
    
    slugTr = `${param}-harfli-kurtce-${gender}-isimleri`;
    slugEn = `${param}-letter-kurdish-${gender}-names`;
    slugDe = `${param}-buchstaben-kurdische-${gender}-namen`;
    slugAr = `اسماء-${gender}-كردية-من-${param}-حروف`;
    
    tagsTr = [`${param} Harfli İsimler`, "Kısa İsimler", "Kürtçe İsimler"];
    tagsEn = [`${param}-Letter Names`, "Short Names", "Kurdish Names"];
    tagsDe = [`${param}-Buchstaben Namen`, "Kurze Namen", "Kurdische Namen"];
    tagsAr = [`أسماء من ${param} حروف`, "أسماء قصيرة", "أسماء كردية"];
    
    contentTr = `## Kısa ve Etkili İsimler\n\nGünümüzde kısa isim trendi hızla artıyor. ${param} harfli Kürtçe isimler, sadeliği ve asaletleriyle dikkat çekiyor.`;
    contentEn = `## Short and Impactful Names\n\nToday, the trend of short names is rapidly increasing. ${param}-letter Kurdish names attract attention with their simplicity and nobility.`;
    contentDe = `## Kurze und Wirkungsvolle Namen\n\nHeutzutage nimmt der Trend zu kurzen Namen rasant zu. ${param}-buchstabige kurdische Namen fallen durch ihre Einfachheit und Noblesse auf.`;
    contentAr = `## أسماء قصيرة ومؤثرة\n\nاليوم، يتزايد الاتجاه نحو الأسماء القصيرة بسرعة. تلفت الأسماء الكردية المكونة من ${param} حروف الانتباه ببساطتها ونبلها.`;
  } else if (type === 'theme') {
    let boygirl = gender === 'female' ? 'Kız' : 'Erkek';
    let boygirlEn = gender === 'female' ? 'Girl' : 'Boy';
    let boygirlDe = gender === 'female' ? 'Mädchen' : 'Jungen';
    let boygirlAr = gender === 'female' ? 'بنات' : 'أولاد';
    
    let tTitle = param === 'nature' ? 'Doğa Temalı' : param === 'power' ? 'Güç ve Cesaret Temalı' : param === 'beauty' ? 'Güzellik Temalı' : param === 'light' ? 'Işık ve Umut Temalı' : 'Bilgelik Temalı';
    let tTitleEn = param === 'nature' ? 'Nature Themed' : param === 'power' ? 'Power and Courage Themed' : param === 'beauty' ? 'Beauty Themed' : param === 'light' ? 'Light and Hope Themed' : 'Wisdom Themed';
    let tTitleDe = param === 'nature' ? 'Naturbezogene' : param === 'power' ? 'Macht- und Mutbezogene' : param === 'beauty' ? 'Schönheitsbezogene' : param === 'light' ? 'Licht- und Hoffnungsbezogene' : 'Weisheitsbezogene';
    let tTitleAr = param === 'nature' ? 'مستوحاة من الطبيعة' : param === 'power' ? 'مستوحاة من القوة والشجاعة' : param === 'beauty' ? 'مستوحاة من الجمال' : param === 'light' ? 'مستوحاة من النور والأمل' : 'مستوحاة من الحكمة';
    
    titleTr = `${tTitle} Kürtçe ${boygirl} İsimleri`;
    titleEn = `${tTitleEn} Kurdish ${boygirlEn} Names`;
    titleDe = `${tTitleDe} Kurdische ${boygirlDe}namen`;
    titleAr = `أسماء ${boygirlAr} كردية ${tTitleAr}`;
    
    descTr = `${tTitle} en anlamlı ve özel Kürtçe ${boygirl.toLowerCase()} isimlerini keşfedin.`;
    descEn = `Discover the most meaningful and special ${tTitleEn.toLowerCase()} Kurdish ${boygirlEn.toLowerCase()} names.`;
    descDe = `Entdecken Sie die bedeutungsvollsten und besonderen ${tTitleDe.toLowerCase()} kurdischen ${boygirlDe.toLowerCase()}namen.`;
    descAr = `اكتشف أكثر أسماء الـ ${boygirlAr} الكردية ${tTitleAr} معنى وخصوصية.`;
    
    slugTr = `${param}-temali-kurtce-${gender}-isimleri`;
    slugEn = `${param}-themed-kurdish-${gender}-names`;
    slugDe = `${param}-thema-kurdische-${gender}-namen`;
    slugAr = `اسماء-${gender}-كردية-${param}`;
    
    tagsTr = [tTitle, "Kürtçe İsimler", boygirl];
    tagsEn = [tTitleEn, "Kurdish Names", boygirlEn];
    tagsDe = [tTitleDe, "Kurdische Namen", boygirlDe];
    tagsAr = [tTitleAr, "أسماء كردية", boygirlAr];
    
    contentTr = `## ${tTitle} İsimler\n\nKültürümüzde ${param} teması isimlerde çok sık kullanılır. Doğadan, erdemlerden ilham alan bu isimler çocuğun karakterine ışık tutar.`;
    contentEn = `## ${tTitleEn} Names\n\nIn our culture, the theme of ${param} is frequently used in names. Inspired by nature and virtues, these names shed light on the child's character.`;
    contentDe = `## ${tTitleDe} Namen\n\nIn unserer Kultur wird das Thema ${param} häufig in Namen verwendet. Von der Natur und Tugenden inspiriert, werfen diese Namen Licht auf den Charakter des Kindes.`;
    contentAr = `## أسماء ${tTitleAr}\n\nفي ثقافتنا، يُستخدم موضوع الـ ${param} بشكل متكرر في الأسماء. مستوحاة من الطبيعة والفضائل، تسلط هذه الأسماء الضوء على شخصية الطفل.`;
  }

  const payloadTr = { content: contentTr, isListicle: true, listicleNames };
  const payloadEn = { content: contentEn, isListicle: true, listicleNames };
  const payloadDe = { content: contentDe, isListicle: true, listicleNames };
  const payloadAr = { content: contentAr, isListicle: true, listicleNames };

  fs.writeFileSync(path.join(BLOG_DIR, 'tr', `${id}.json`), JSON.stringify(payloadTr, null, 2));
  fs.writeFileSync(path.join(BLOG_DIR, 'en', `${id}.json`), JSON.stringify(payloadEn, null, 2));
  fs.writeFileSync(path.join(BLOG_DIR, 'de', `${id}.json`), JSON.stringify(payloadDe, null, 2));
  fs.writeFileSync(path.join(BLOG_DIR, 'ar', `${id}.json`), JSON.stringify(payloadAr, null, 2));

  postsMeta.push({
    id,
    date: dateStr,
    author: "KurdishName Editorial",
    slugs: { tr: slugTr, en: slugEn, de: slugDe, ar: slugAr },
    tags: { tr: tagsTr, en: tagsEn, de: tagsDe, ar: tagsAr },
    titles: { tr: titleTr, en: titleEn, de: titleDe, ar: titleAr },
    descriptions: { tr: descTr, en: descEn, de: descDe, ar: descAr }
  });
}

// 1. A-Z Letters -> Boy Names (29 posts)
alphabetKurdish.forEach(letter => {
  const matchingNames = allNames.filter(n => (n.gender === 'male' || n.gender === 'unisex') && n.name.toUpperCase().startsWith(letter));
  if (matchingNames.length > 2) {
    generatePost(`letter-${letter.toLowerCase()}-boy-names`, 'letter_boy', letter, 'male', matchingNames);
  }
});

// 2. A-Z Letters -> Girl Names (29 posts)
alphabetKurdish.forEach(letter => {
  const matchingNames = allNames.filter(n => (n.gender === 'female' || n.gender === 'unisex') && n.name.toUpperCase().startsWith(letter));
  if (matchingNames.length > 2) {
    generatePost(`letter-${letter.toLowerCase()}-girl-names`, 'letter_girl', letter, 'female', matchingNames);
  }
});

// 3. Length based (3, 4, 5) x 2 (6 posts)
[3, 4, 5].forEach(len => {
  ['male', 'female'].forEach(gender => {
    const matchingNames = allNames.filter(n => (n.gender === gender || n.gender === 'unisex') && n.name.length === len);
    generatePost(`length-${len}-${gender}-names`, 'length', len, gender, matchingNames);
  });
});

// 4. Themes (10 posts)
const themes = ['nature', 'power', 'beauty', 'light', 'wisdom'];
const themeKeywords = {
  nature: ['doğa', 'su', 'dağ', 'çiçek', 'rüzgar', 'yağmur', 'ağaç', 'orman'],
  power: ['güç', 'cesaret', 'yiğit', 'kahraman', 'savaşçı', 'kral', 'lider'],
  beauty: ['güzel', 'sevgi', 'aşk', 'güzellik', 'narin', 'zarif'],
  light: ['ışık', 'aydınlık', 'güneş', 'ay', 'yıldız', 'parlak'],
  wisdom: ['bilgi', 'akıl', 'bilge', 'alim']
};

themes.forEach(theme => {
  ['male', 'female'].forEach(gender => {
    const kw = themeKeywords[theme];
    const matchingNames = allNames.filter(n => {
      if (n.gender !== gender && n.gender !== 'unisex') return false;
      const desc = (n.description || '').toLowerCase();
      const mean = (n.meaning || '').toLowerCase();
      return kw.some(k => desc.includes(k) || mean.includes(k));
    });
    if (matchingNames.length > 2) {
      generatePost(`theme-${theme}-${gender}-names`, 'theme', theme, gender, matchingNames);
    }
  });
});

// 5. General Letters (26 posts) to reach ~100
let needed = 100 - postsMeta.length;
if (needed > 0) {
  for (let i = 0; i < alphabetStandard.length; i++) {
    const letter = alphabetStandard[i];
    const matchingNames = allNames.filter(n => n.name.toUpperCase().startsWith(letter));
    if (matchingNames.length > 2) {
      generatePost(`letter-${letter.toLowerCase()}-generic-names`, 'letter_generic', letter, 'unisex', matchingNames);
      needed--;
      if (needed <= 0) break;
    }
  }
}

console.log(`Generated ${postsMeta.length} new blog posts!`);

// Append to blogPosts.ts
let blogPostsTsContent = fs.readFileSync(BLOG_POSTS_REGISTRY_PATH, 'utf-8');

// Find the position before the last ];
const endIdx = blogPostsTsContent.lastIndexOf('];');
if (endIdx > -1) {
  const beforeStr = blogPostsTsContent.substring(0, endIdx);
  const afterStr = blogPostsTsContent.substring(endIdx);
  
  // Format the objects properly with 2 spaces indentation
  const injectObjects = postsMeta.map(meta => `  ${JSON.stringify(meta, null, 2).replace(/\n/g, '\n  ')}`).join(',\n');
  
  // Create final content
  const finalContent = beforeStr.replace(/,\s*$/, '') + ',\n' + injectObjects + '\n' + afterStr;
  fs.writeFileSync(BLOG_POSTS_REGISTRY_PATH, finalContent, 'utf-8');
  console.log(`Injected into ${BLOG_POSTS_REGISTRY_PATH}`);
} else {
  console.error("Could not find the end of blogPostsRegistry array!");
}
