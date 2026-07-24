/**
 * Adds commonly used Kurdish names missing from the database.
 * Injects into names_alphabetical/*.ts and regenerates search index.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const NAMES_DIR = path.join(__dirname, '../src/data/names_alphabetical');
const PUBLIC_DATA = path.join(__dirname, '../public/data');

const NEW_NAMES = [
  {
    id: 'andok',
    name: 'Andok',
    gender: 'male',
    letter: 'A',
    tags: ['Klasik İsimler', 'Kürtçe İsim'],
    template: 'heritage',
    core_tr: 'kadim ve köklü bir mirası temsil eden, asil duruşuyla tanınan',
    core_en: 'representing an ancient and deeply rooted heritage, known for a noble stance',
    core_de: 'eine alte und tief verwurzelte Herkunft verkörpernd, bekannt für edle Haltung',
    core_ar: 'تمثل موروثًا قديمًا وعميق الجذور، وتشتهر بموقفها النبيل',
  },
  {
    id: 'avesta',
    name: 'Avesta',
    gender: 'female',
    letter: 'A',
    tags: ['Manevi / Ruhani', 'Kürtçe İsim'],
    template: 'heritage',
    core_tr: 'Zerdüştlük inancının kutsal kitabı; bilgelik, aydınlık ve sarsılmaz ruhani değerlerin',
    core_en: 'the sacred scripture of Zoroastrianism; a symbol of wisdom, light, and unwavering spiritual values',
    core_de: 'die heilige Schrift des Zoroastrismus; ein Symbol für Weisheit, Licht und unerschütterliche geistige Werte',
    core_ar: 'الكتاب المقدس للزرادشتية؛ رمز الحكمة والنور والقيم الروحية الراسخة',
  },
  {
    id: 'ciwana',
    name: 'Ciwana',
    gender: 'female',
    letter: 'C',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim'],
    template: 'beauty',
    core_tr: 'genç, taze, dinamik ve zarif; hayat dolu bir duruşu temsil eden',
    core_en: 'young, fresh, dynamic, and graceful; representing a vibrant and lively spirit',
    core_de: 'jung, frisch, dynamisch und anmutig; eine lebendige und strahlende Persönlichkeit verkörpernd',
    core_ar: 'شابة، عذبة، ديناميكية وأنيقة؛ تمثل روحًا حيوية ومشرقة',
  },
  {
    id: 'dilara',
    name: 'Dilara',
    gender: 'female',
    letter: 'D',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim'],
    template: 'beauty',
    core_tr: 'gönül süsü, sevgili ve çok değerli; nazlı zarafetiyle etrafına sevgi saçan',
    core_en: 'heart ornament, beloved and precious; radiating love with coquettish grace',
    core_de: 'Herzschmuck, geliebt und kostbar; strahlt Liebe mit koketter Anmut aus',
    core_ar: 'زينة القلب، محبوبة وثمينة؛ تشع حبًا بأناقة دلّالة',
  },
  {
    id: 'dilsan',
    name: 'Dilsan',
    gender: 'female',
    letter: 'D',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim'],
    template: 'beauty',
    core_tr: 'huzurlu gönül, sakin ve dingin kalp; iç huzuruyla etrafına sükunet yayan',
    core_en: 'peaceful heart, calm and serene soul; spreading tranquility with inner peace',
    core_de: 'friedvolles Herz, ruhige und gelassene Seele; verbreitet Ruhe durch innere Gelassenheit',
    core_ar: 'قلب مطمئن، روح هادئة وسكينة؛ تنشر السكينة بسلامها الداخلي',
  },
  {
    id: 'dilshad',
    name: 'Dilshad',
    gender: 'female',
    letter: 'D',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim'],
    template: 'beauty',
    core_tr: 'mutlu gönül, neşeli kalp; sevinci ve coşkuyu etrafına yayan',
    core_en: 'happy heart, joyful soul; spreading cheerfulness and enthusiasm',
    core_de: 'fröhliches Herz, heitere Seele; verbreitet Freude und Lebensfreude',
    core_ar: 'قلب سعيد، روح مبهجة؛ تنشر البهجة والحيوية',
  },
  {
    id: 'dilsoz',
    name: 'Dilsoz',
    gender: 'unisex',
    letter: 'D',
    tags: ['Kürtçe İsim'],
    template: 'heritage',
    core_tr: 'sözünde duran, vefalı ve sadık gönül; güvenin ve bağlılığın',
    core_en: 'true to one\'s word, loyal and faithful heart; a symbol of trust and devotion',
    core_de: 'worteheilig, treues und loyal ergebenes Herz; ein Symbol für Vertrauen und Hingabe',
    core_ar: 'وفي بالوعد، قلب مخلص ووفي؛ رمز الثقة والإخلاص',
  },
  {
    id: 'dilvan',
    name: 'Dilvan',
    gender: 'male',
    letter: 'D',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim'],
    template: 'beauty',
    core_tr: 'gönül bilen, aşık ve sevgi dolu; kalbin derinliklerini anlayan',
    core_en: 'heart-knowing, loving and affectionate; one who understands the depths of the heart',
    core_de: 'herzenskundig, liebevoll und zärtlich; einer, der die Tiefen des Herzens versteht',
    core_ar: 'عارف بالقلب، عاشق ومحب؛ يفهم أعماق القلب',
  },
  {
    id: 'ferhat',
    name: 'Ferhat',
    gender: 'male',
    letter: 'F',
    tags: ['Kürtçe İsim'],
    template: 'heritage',
    core_tr: 'sevinç, mutluluk ve umut; hayat dolu neşeli bir ruh taşıyan',
    core_en: 'joy, happiness, and hope; carrying a lively and cheerful spirit',
    core_de: 'Freude, Glück und Hoffnung; eine lebendige und fröhliche Seele tragend',
    core_ar: 'فرح، سعادة وأمل؛ يحمل روحًا حية ومبهجة',
  },
  {
    id: 'ferzad',
    name: 'Ferzad',
    gender: 'male',
    letter: 'F',
    tags: ['Cesaret / Güç', 'Kürtçe İsim'],
    template: 'strength',
    core_tr: 'şan ve ihtişamla doğmuş, asil soydan gelen; onurlu bir mirasın temsilcisi',
    core_en: 'born with glory and splendor, of noble lineage; a representative of an honorable heritage',
    core_de: 'mit Ruhm und Pracht geboren, edler Abstammung; ein Vertreter eines ehrenvollen Erbes',
    core_ar: 'ولد بمجد وعظمة، من نسب نبيل؛ ممثل موروث شريف',
  },
  {
    id: 'gulbahar',
    name: 'Gulbahar',
    gender: 'female',
    letter: 'G',
    tags: ['Doğa / Yaşam', 'Kürtçe İsim'],
    core_tr: 'ilkbaharda açan en renkli asil gül; sonsuz neşe ve canlanma kaynağı',
    core_en: 'the most colorful noble rose blooming in spring; a source of endless joy and renewal',
    core_de: 'die farbenprächtigste edle Rose, die im Frühling blüht; eine Quelle endloser Freude und Erneuerung',
    core_ar: 'أجمل وردة نبيلة تتفتح في الربيع؛ مصدر بهجة لا ينتهي وتجدد',
  },
  {
    id: 'gulistan',
    name: 'Gulîstan',
    gender: 'female',
    letter: 'G',
    tags: ['Doğa / Yaşam', 'Kürtçe İsim'],
    core_tr: 'gül bahçesi',
    core_en: 'rose garden',
    core_de: 'Rosengarten',
    core_ar: 'بستان الورد',
  },
  {
    id: 'hemo',
    name: 'Hemo',
    gender: 'male',
    letter: 'H',
    tags: ['Kürtçe İsim'],
    template: 'heritage',
    core_tr: 'sakin, huzurlu ve güven veren; dinginliğiyle tanınan sevgi dolu bir ruh',
    core_en: 'calm, peaceful, and trustworthy; a loving soul known for serenity',
    core_de: 'ruhig, friedlich und vertrauenswürdig; eine liebevolle Seele, bekannt für Gelassenheit',
    core_ar: 'هادئ، مطمئن وموثوق؛ روح محبة تشتهر بالسكينة',
  },
  {
    id: 'hezkir',
    name: 'Hezkir',
    gender: 'male',
    letter: 'H',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim'],
    template: 'beauty',
    core_tr: 'seven, sevgi dolu ve bağlı; gönülden bağ kuran sadık bir ruh',
    core_en: 'loving, affectionate, and devoted; a faithful soul who connects from the heart',
    core_de: 'liebend, zärtlich und hingebungsvoll; eine treue Seele, die von Herzen verbindet',
    core_ar: 'محب، عاطفي ومخلص؛ روح وفية تتصل من القلب',
  },
  {
    id: 'lewend',
    name: 'Lewend',
    gender: 'male',
    letter: 'L',
    tags: ['Cesaret / Güç', 'Kürtçe İsim'],
    template: 'strength',
    core_tr: 'yiğit, kahraman ve cesur; savaşçı ruhu ve asalet taşıyan',
    core_en: 'brave, heroic, and courageous; carrying a warrior spirit and nobility',
    core_de: 'tapfer, heldenhaft und mutig; einen Kriegergeist und Adel tragend',
    core_ar: 'شجاع، بطولي ومقدام؛ يحمل روح المحارب والنبل',
  },
  {
    id: 'lorin',
    name: 'Lorîn',
    gender: 'female',
    letter: 'L',
    tags: ['Edebi / Sanatsal', 'Kürtçe İsim'],
    core_tr: 'ninni, ezgi; annelerin sevgiyle fısıldadığı melodik nakarat',
    core_en: 'lullaby, soothing melody sung with love',
    core_de: 'Wiegenlied, beruhigende Melodie voller Liebe',
    core_ar: 'لوري، الأنشودة العذبة التي تهدهد بها الأمهات أطفالهن',
  },
  {
    id: 'nazan',
    name: 'Nazan',
    gender: 'female',
    letter: 'N',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim'],
    template: 'beauty',
    core_tr: 'nazlı, cilveli ve zarif; incelik ve cazibesiyle dikkat çeken',
    core_en: 'coquettish, graceful, and elegant; attracting attention with delicacy and charm',
    core_de: 'kokett, anmutig und elegant; zieht mit Feinheit und Charme die Aufmerksamkeit auf sich',
    core_ar: 'دلّالة، رشيقة وأنيقة؛ تلفت الانتباه برقة وجاذبية',
  },
  {
    id: 'nazlican',
    name: 'Nazlican',
    gender: 'female',
    letter: 'N',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim'],
    template: 'beauty',
    core_tr: 'nazlı can, sevgili ruh; hem nazlı hem de cana yakın, sıcak kalpli',
    core_en: 'coquettish soul, dear spirit; both playful and warm-hearted',
    core_de: 'kokette Seele, liebevoller Geist; sowohl verspielt als auch warmherzig',
    core_ar: 'روح دلّعة، نفس عزيزة؛ دلّعة ودافئة القلب',
  },
  {
    id: 'ozan',
    name: 'Ozan',
    gender: 'male',
    letter: 'O',
    tags: ['Edebi / Sanatsal', 'Kürtçe İsim'],
    template: 'heritage',
    core_tr: 'ozan, aşık ve halk ozanı; halkın sesini sanata dönüştüren bilge şair',
    core_en: 'bard, minstrel, and folk poet; a wise poet who transforms the people\'s voice into art',
    core_de: 'Barde, Sänger und Volksdichter; ein weiser Dichter, der die Stimme des Volkes in Kunst verwandelt',
    core_ar: 'أشعار، مغني شعبي وشاعر؛ شاعر حكيم يحوّل صوت الشعب إلى فن',
  },
  {
    id: 'rebar',
    name: 'Rebar',
    gender: 'male',
    letter: 'R',
    tags: ['Kürtçe İsim'],
    template: 'heritage',
    core_tr: 'geçimlik sağlayan, besleyen ve koruyan; ailesine ve yakınlarına destek olan',
    core_en: 'provider, sustainer, and protector; supporting family and loved ones',
    core_de: 'Versorger, Ernährer und Beschützer; unterstützt Familie und Angehörige',
    core_ar: 'معيل، راعٍ وحامٍ؛ يدعم العائلة والأحباء',
  },
  {
    id: 'rozin',
    name: 'Rozîn',
    gender: 'female',
    letter: 'R',
    tags: ['Işık / Aydınlık', 'Kürtçe İsim'],
    core_tr: 'gün, güneş ve aydınlık; hayatın kaynağı olan ışık',
    core_en: 'day, sun, and light; the source of life',
    core_de: 'Tag, Sonne und Licht; die Quelle des Lebens',
    core_ar: 'يوم، شمس ونور؛ مصدر الحياة',
  },
  {
    id: 'serbilind',
    name: 'Serbilind',
    gender: 'male',
    letter: 'S',
    tags: ['Cesaret / Güç', 'Kürtçe İsim'],
    template: 'strength',
    core_tr: 'ser bilind, gururlu ve onurlu; başı dik, asil duruşuyla tanınan',
    core_en: 'proud and honorable; known for an upright head and noble stance',
    core_de: 'stolz und ehrenhaft; bekannt für aufrechten Kopf und edle Haltung',
    core_ar: 'فخور وكريم؛ يشتهر برأس مرفوع وموقف نبيل',
  },
  {
    id: 'serxwebun',
    name: 'Serxwebûn',
    gender: 'unisex',
    letter: 'S',
    tags: ['Cesaret / Güç', 'Kürtçe İsim'],
    template: 'strength',
    core_tr: 'bağımsızlık, özgürlük ve hürriyet; halkın kendi kaderini tayin etme arzusunun simgesi',
    core_en: 'independence, freedom, and liberty; a symbol of the people\'s desire for self-determination',
    core_de: 'Unabhängigkeit, Freiheit und Befreiung; ein Symbol des Volkeswillens zur Selbstbestimmung',
    core_ar: 'استقلال، حرية وتحرر؛ رمز إرادة الشعب في تقرير مصيره',
  },
  {
    id: 'xorto',
    name: 'Xorto',
    gender: 'male',
    letter: 'X',
    tags: ['Doğa / Yaşam', 'Kürtçe İsim'],
    template: 'strength',
    core_tr: 'genç, yiğit delikanlı; dinamik, güçlü ve enerji dolu bir ruh',
    core_en: 'young, brave lad; a dynamic, strong, and energetic spirit',
    core_de: 'junger, tapferer Bursche; ein dynamischer, starker und energiegeladener Geist',
    core_ar: 'شاب، فتى شجاع؛ روح ديناميكية وقوية ومليئة بالحيوية',
  },
  {
    id: 'zanist',
    name: 'Zanist',
    gender: 'female',
    letter: 'Z',
    tags: ['Bilgelik / Akıl', 'Kürtçe İsim'],
    template: 'heritage',
    core_tr: 'bilgi, ilim ve bilgelik; öğrenmeye ve aydınlanmaya açık bir zihin',
    core_en: 'knowledge, science, and wisdom; a mind open to learning and enlightenment',
    core_de: 'Wissen, Wissenschaft und Weisheit; ein Geist, der offen ist für Lernen und Erleuchtung',
    core_ar: 'معرفة، علم وحكمة؛ عقل منفتح على التعلم والاستنارة',
  },
];

function buildEntry(n) {
  const tpl = n.template || 'nature';
  let meaning, meaning_en, meaning_de, meaning_ar;

  if (tpl === 'heritage') {
    meaning = `${n.name}; ${n.core_tr} anlamını ve asil bir duruşu hayatın merkezine koyan, köklü bir geçmişi ve asil bir mirası temsil eden kimsedir.`;
    meaning_en = `${n.name}; a person who places the meaning of ${n.core_en} and a noble stance at the center of life, representing a deeply rooted history and noble heritage.`;
    meaning_de = `${n.name}; eine Persönlichkeit, die die Bedeutung von ${n.core_de} und eine edle Haltung in den Mittelpunkt des Lebens stellt und eine tief verwurzelte Geschichte und ein edles Erbe repräsentiert.`;
    meaning_ar = `${n.name}؛ شخص يضع معنى ${n.core_ar} والموقف النبيل في مركز الحياة، ويمثل ثقافة عميقة الجذور وموروثًا أصيلاً.`;
  } else if (tpl === 'strength') {
    meaning = `${n.name}; ${n.core_tr} sahibi, asil bir cesaret ve sarsılmaz bir kararlılıkla donatılmış, gücün ve liderliğin sembolü olan asil bir kimsedir.`;
    meaning_en = `${n.name}; a noble person endowed with ${n.core_en}, possessing brave courage and unwavering determination, representing the symbol of strength and leadership.`;
    meaning_de = `${n.name}; eine edle Persönlichkeit, die mit ${n.core_de} ausgestattet ist, tapferen Mut und unerschütterliche Entschlossenheit besitzt und das Symbol für Stärke und Führung darstellt.`;
    meaning_ar = `${n.name}؛ شخصية نبيلة تتحلى بـ ${n.core_ar}، تمتلك شجاعة مقدامة وعزيمة لا تلين، وتمثل رمز القوة والقيادة.`;
  } else if (tpl === 'beauty') {
    meaning = `${n.name}; ${n.core_tr} dolu kalbi, asil duruşu ve zarafetiyle etrafına sevgi ve güzellik saçan, çok özel ve kıymetli bir kimsedir.`;
    meaning_en = `${n.name}; a very special and precious person who radiates love and beauty with a heart full of ${n.core_en}, noble stance, and elegance.`;
    meaning_de = `${n.name}; eine ganz besondere und kostbare Persönlichkeit, die Liebe und Schönheit mit einem Herzen voller ${n.core_de}, edler Haltung und Eleganz ausstrahlt.`;
    meaning_ar = `${n.name}؛ شخصية مميزة وثمينة للغاية تشع حبًا وجمالاً بقلب مليء بـ ${n.core_ar}، وتتميز بوقارها ورقّتها.`;
  } else {
    meaning = `${n.name}; ${n.core_tr} gibi duru, taze ve canlı; tabiatın en saf ve asil esintilerini bünyesinde barındıran asil bir kimsedir.`;
    meaning_en = `${n.name}; clear, fresh, and vibrant like ${n.core_en}; a noble person who embodies the purest and most graceful whispers of nature.`;
    meaning_de = `${n.name}; rein, frisch und lebendig wie ${n.core_de}; eine edle Persönlichkeit, die das reinste und anmutigste Flüstern der Natur verkörpert.`;
    meaning_ar = `${n.name}؛ نقي وعذب وحيوي مثل ${n.core_ar}؛ شخصية نبيلة تجسد أنقى همسات الطبيعة وأكثرها رقيًا.`;
  }

  return {
    id: n.id,
    name: n.name,
    gender: n.gender,
    letter: n.letter,
    meaning,
    meaning_en,
    meaning_de,
    meaning_ar,
    origin: 'Kurdish',
    tags: n.tags,
    description: meaning,
  };
}

function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ê', 'e')
    .replaceAll('î', 'i')
    .replaceAll('û', 'u')
    .replaceAll('ç', 'c')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ı', 'i')
    .replaceAll('ö', 'o')
    .replaceAll('ü', 'u')
    .trim();
}

function loadExistingIds() {
  const ids = new Set();
  for (const file of fs.readdirSync(NAMES_DIR).filter(f => f.endsWith('.ts'))) {
    const content = fs.readFileSync(path.join(NAMES_DIR, file), 'utf-8');
    for (const m of content.matchAll(/"id": "([^"]+)"/g)) ids.add(m[1]);
  }
  return ids;
}

function injectNames() {
  const existingIds = loadExistingIds();
  const toAdd = NEW_NAMES.filter(n => !existingIds.has(n.id));

  if (toAdd.length === 0) {
    console.log('All names already exist.');
    return 0;
  }

  const byLetter = {};
  for (const n of toAdd) {
    const entry = buildEntry(n);
    if (!byLetter[n.letter]) byLetter[n.letter] = [];
    byLetter[n.letter].push(entry);
  }

  for (const [letter, entries] of Object.entries(byLetter)) {
    const filePath = path.join(NAMES_DIR, `${letter}.ts`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/export const names: NameData\[\] = (\[[\s\S]*\]);/);
    if (!match) {
      console.error(`Could not parse ${filePath}`);
      continue;
    }

    const names = JSON.parse(match[1]);
    names.push(...entries);
    names.sort((a, b) => a.id.localeCompare(b.id, 'tr'));

    const newContent = `import { NameData } from '../names';\n\nexport const names: NameData[] = ${JSON.stringify(names, null, 2)};\n`;
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Added ${entries.length} name(s) to ${letter}.ts: ${entries.map(e => e.id).join(', ')}`);
  }

  return toAdd.length;
}

function rebuildSearchIndex() {
  const allNames = [];
  for (const file of fs.readdirSync(NAMES_DIR).filter(f => f.endsWith('.ts'))) {
    const content = fs.readFileSync(path.join(NAMES_DIR, file), 'utf-8');
    const match = content.match(/export const names: NameData\[\] = (\[[\s\S]*\]);/);
    if (match) allNames.push(...JSON.parse(match[1]));
  }

  const searchBuckets = {};
  for (const n of allNames) {
    const nn = normalizeText(n.name);
    const prefix = nn.substring(0, 2) || nn.substring(0, 1);
    if (!searchBuckets[prefix]) searchBuckets[prefix] = [];
    searchBuckets[prefix].push({
      id: n.id,
      n: n.name,
      nn,
      g: n.gender === 'female' ? 'f' : n.gender === 'male' ? 'm' : 'u',
      s: 35,
    });
  }

  for (const prefix in searchBuckets) {
    searchBuckets[prefix].sort((a, b) => b.s - a.s || a.id.localeCompare(b.id));
  }

  const searchIndexContent = JSON.stringify(searchBuckets);
  const searchIndexHash = crypto.createHash('md5').update(searchIndexContent).digest('hex').substring(0, 8);
  const searchIndexFileName = `search_index.${searchIndexHash}.json`;

  fs.writeFileSync(path.join(PUBLIC_DATA, searchIndexFileName), searchIndexContent);
  fs.writeFileSync(path.join(PUBLIC_DATA, 'search_manifest.json'), JSON.stringify({ searchIndex: searchIndexFileName }));

  // Remove old search index files
  for (const f of fs.readdirSync(PUBLIC_DATA)) {
    if (f.startsWith('search_index.') && f !== searchIndexFileName) {
      fs.unlinkSync(path.join(PUBLIC_DATA, f));
    }
  }

  console.log(`✅ Search index rebuilt: ${searchIndexFileName} (${allNames.length} names, ${Object.keys(searchBuckets).length} buckets)`);
}

// Main
console.log('🔄 Adding missing Kurdish names...\n');
const added = injectNames();
rebuildSearchIndex();
console.log(`\n🎉 Done! Added ${added} new name(s).`);
