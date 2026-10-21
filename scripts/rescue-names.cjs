const fs = require('fs');
const path = require('path');

const namesMasterPath = path.resolve(__dirname, '../names_master.json');
const deletedPath = path.resolve(__dirname, '../silinen-uydurma-isimler.json');
const backupPath = path.resolve(__dirname, '../names_master.json.bak-2026-10-21-rescue');

const currentNames = JSON.parse(fs.readFileSync(namesMasterPath, 'utf8'));
fs.writeFileSync(backupPath, JSON.stringify(currentNames, null, 2), 'utf8');
console.log(`[1] Backup created at: ${backupPath}`);

const junkIds = [
  'amandok', 'amandoz', 'andoz', 'anjos', 'ankos', 'arandoz', 'ardoz', 'arikos', 'arkos', 'arnos',
  'arnoswan', 'arnosyar', 'avkos', 'azari', 'azaro', 'azaryar', 'benazar', 'bendok', 'candoz', 'gadok',
  'mirkos', 'zaradar', 'zarati', 'zarmani', 'zarvan', 'zaryar', 'agirbaz', 'arbaz', 'gurbaz', 'cengbaz'
];

const rescued = [
  {
    id: 'rojin',
    name: 'Rojîn',
    gender: 'female',
    letter: 'R',
    meaning: 'Rojîn; güneş ışığı, güneşe ait; parlaklığı ve sıcaklığıyla etrafını aydınlatan, hayat dolu kimse.',
    description: 'Rojîn; güneş ışığı, güneşe ait; parlaklığı ve sıcaklığıyla etrafını aydınlatan, hayat dolu kimse.',
    meaning_en: 'Rojîn; belonging to the sun, sunlight; a radiant person who illuminates their surroundings with warmth and vitality.',
    meaning_de: 'Rojîn; zum Sonnenlicht gehörend, Sonnenlicht; eine strahlende Persönlichkeit, die ihre Umgebung mit Wärme und Vitalität erhellt.',
    meaning_ar: 'Rojîn؛ منتمية إلى الشمس، نور الشمس؛ شخصية مشرقة تضيء ما حولها بالدفء والحيوية.',
    origin: 'Kurdish',
    tags: ['Işık / Aydınlık', 'Popüler']
  },
  {
    id: 'berfin',
    name: 'Berfîn',
    gender: 'female',
    letter: 'B',
    meaning: 'Berfîn; kardan olan, kardelen çiçeği; kışın ardından gelen baharın müjdecisi ve zarafetin sembolü.',
    description: 'Berfîn; kardan olan, kardelen çiçeği; kışın ardından gelen baharın müjdecisi ve zarafetin sembolü.',
    meaning_en: 'Berfîn; snowdrop flower, made of snow; herald of spring following winter and symbol of pure elegance.',
    meaning_de: 'Berfîn; Schneeglöckchen, aus Schnee gemacht; Frühlingsbote nach dem Winter und Symbol reiner Eleganz.',
    meaning_ar: 'Berfîn؛ زهرة الثلج، ناصعة كالثلج؛ بشارة الربيع بعد الشتاء ورمز النقاء والأناقة.',
    origin: 'Kurdish',
    tags: ['Çiçek / Doğa', 'Popüler']
  },
  {
    id: 'arin',
    name: 'Arîn',
    gender: 'female',
    letter: 'A',
    meaning: 'Arîn; ateşten olan, soylu, aydınlık ve enerjik kimse.',
    description: 'Arîn; ateşten olan, soylu, aydınlık ve enerjik kimse.',
    meaning_en: 'Arîn; of fire, noble, brilliant, and full of vitality.',
    meaning_de: 'Arîn; aus Feuer, edel, strahlend und voller Lebenskraft.',
    meaning_ar: 'Arîn؛ من النار، نبيلة، مشرقة ومفعمة بالحيوية.',
    origin: 'Kurdish',
    tags: ['Işık / Aydınlık', 'Kürtçe İsim']
  },
  {
    id: 'agirin',
    name: 'Agirîn',
    gender: 'female',
    letter: 'A',
    meaning: 'Agirîn; ateşli, coşkulu, alev gibi parlak ve cesur.',
    description: 'Agirîn; ateşli, coşkulu, alev gibi parlak ve cesur.',
    meaning_en: 'Agirîn; fiery, passionate, radiant like a flame, and brave.',
    meaning_de: 'Agirîn; feurig, leidenschaftlich, wie eine Flamme strahlend und mutig.',
    meaning_ar: 'Agirîn؛ نارية، متقدة، مشرقة كاللهب وشجاعة.',
    origin: 'Kurdish',
    tags: ['Güç / Cesaret', 'Kürtçe İsim']
  },
  {
    id: 'alin',
    name: 'Alîn',
    gender: 'female',
    letter: 'A',
    meaning: 'Alîn; asil ışık, parlaklık, yükseklerde parıldayan zarafet.',
    description: 'Alîn; asil ışık, parlaklık, yükseklerde parıldayan zarafet.',
    meaning_en: 'Alîn; noble light, radiance, elegance shining from high places.',
    meaning_de: 'Alîn; edles Licht, Glanz, in Höhen strahlende Eleganz.',
    meaning_ar: 'Alîn؛ نور نبيل، بهاء، وأناقة تشع من الأعالي.',
    origin: 'Kurdish',
    tags: ['Işık / Aydınlık', 'Kürtçe İsim']
  },
  {
    id: 'avin',
    name: 'Avîn',
    gender: 'female',
    letter: 'A',
    meaning: 'Avîn; aşk, sevgi, berrak su gibi temiz ve derin duygular besleyen.',
    description: 'Avîn; aşk, sevgi, berrak su gibi temiz ve derin duygular besleyen.',
    meaning_en: 'Avîn; love, passion; one who nurtures pure and deep feelings like clear water.',
    meaning_de: 'Avîn; Liebe, Leidenschaft; jemand, der reine und tiefe Gefühle wie klares Wasser hegt.',
    meaning_ar: 'Avîn؛ حب، عشق؛ صاحبة المشاعر النقية والعميقة كالماء الزلال.',
    origin: 'Kurdish',
    tags: ['Sevgi / Güzellik', 'Popüler']
  },
  {
    id: 'narin',
    name: 'Narîn',
    gender: 'female',
    letter: 'N',
    meaning: 'Narîn; narin, kibar, ince yapılı ve zarif duruşlu.',
    description: 'Narîn; narin, kibar, ince yapılı ve zarif duruşlu.',
    meaning_en: 'Narîn; delicate, gentle, graceful, and elegant.',
    meaning_de: 'Narîn; zart, sanft, anmutig und elegant.',
    meaning_ar: 'Narîn؛ رقيقة، لطيفة، أنيقة وعذبة الحضور.',
    origin: 'Kurdish',
    tags: ['Sevgi / Güzellik', 'Popüler']
  },
  {
    id: 'pelin',
    name: 'Pelîn',
    gender: 'female',
    letter: 'P',
    meaning: 'Pelîn; taze yaprak, yeşillik, tabiatın saf canlılığı.',
    description: 'Pelîn; taze yaprak, yeşillik, tabiatın saf canlılığı.',
    meaning_en: 'Pelîn; fresh leaf, greenery, the pure vitality of nature.',
    meaning_de: 'Pelîn; frisches Blatt, Grün, die reine Vitalität der Natur.',
    meaning_ar: 'Pelîn؛ ورقة خضراء نضرة، حيوية الطبيعة النقية.',
    origin: 'Kurdish',
    tags: ['Doğa / Yaşam', 'Kürtçe İsim']
  },
  {
    id: 'tavin',
    name: 'Tavîn',
    gender: 'female',
    letter: 'T',
    meaning: 'Tavîn; güneş ışığı tabiatlı, gün ışığı sıcaklığı saçan.',
    description: 'Tavîn; güneş ışığı tabiatlı, gün ışığı sıcaklığı saçan.',
    meaning_en: 'Tavîn; of sunlight nature, radiating the warmth of dawn.',
    meaning_de: 'Tavîn; von der Natur des Sonnenlichts, die Wärme des Tageslichts ausstrahlend.',
    meaning_ar: 'Tavîn؛ بطبيعة نور الشمس، تشع بدفء ضوء النهار.',
    origin: 'Kurdish',
    tags: ['Işık / Aydınlık', 'Kürtçe İsim']
  },
  {
    id: 'gulin',
    name: 'Gulîn',
    gender: 'female',
    letter: 'G',
    meaning: 'Gulîn; güle ait, gül gibi taze ve açılmış çiçek güzelliğinde.',
    description: 'Gulîn; güle ait, gül gibi taze ve açılmış çiçek güzelliğinde.',
    meaning_en: 'Gulîn; belonging to the rose, fresh and beautiful like a blooming flower.',
    meaning_de: 'Gulîn; zur Rose gehörend, frisch und schön wie eine blühende Blume.',
    meaning_ar: 'Gulîn؛ وردية، نضرة وجميلة كزهرة متفتحة.',
    origin: 'Kurdish',
    tags: ['Çiçek / Doğa', 'Kürtçe İsim']
  },
  {
    id: 'dilvin',
    name: 'Dilvîn',
    gender: 'female',
    letter: 'D',
    meaning: 'Dilvîn; gönül sevgisi, kalbin derin sevgisi ve güzelliği.',
    description: 'Dilvîn; gönül sevgisi, kalbin derin sevgisi ve güzelliği.',
    meaning_en: 'Dilvîn; love of the heart, deep affection, and inner beauty.',
    meaning_de: 'Dilvîn; Herzensliebe, tiefe Zuneigung und innere Schönheit.',
    meaning_ar: 'Dilvîn؛ محبة القلب، العاطفة الصادقة والجمال الداخلي.',
    origin: 'Kurdish',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim']
  },
  {
    id: 'dilin',
    name: 'Dilîn',
    gender: 'female',
    letter: 'D',
    meaning: 'Dilîn; gönülden, içten, samimi ve sevgi dolu kimse.',
    description: 'Dilîn; gönülden, içten, samimi ve sevgi dolu kimse.',
    meaning_en: 'Dilîn; sincere, from the heart, warm, and loving.',
    meaning_de: 'Dilîn; von Herzen kommend, aufrichtig, herzlich und liebevoll.',
    meaning_ar: 'Dilîn؛ قلبية، نابعة من صميم القلب، صادقة ومحبة.',
    origin: 'Kurdish',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim']
  },
  {
    id: 'hevidar',
    name: 'Hêvîdar',
    gender: 'unisex',
    letter: 'H',
    meaning: 'Hêvîdar; umutlu, geleceğe umut ve inançla bakan.',
    description: 'Hêvîdar; umutlu, geleceğe umut ve inançla bakan.',
    meaning_en: 'Hêvîdar; hopeful, optimistic, looking to the future with faith.',
    meaning_de: 'Hêvîdar; hoffnungsvoll, optimistisch, mit Zuversicht in die Zukunft blickend.',
    meaning_ar: 'Hêvîdar؛ مفعم بالأمل، متفائل، ينظر إلى المستقبل بإيمان ورجاء.',
    origin: 'Kurdish',
    tags: ['Umut / Sevinç', 'Popüler']
  },
  {
    id: 'zanyar',
    name: 'Zanyar',
    gender: 'male',
    letter: 'Z',
    meaning: 'Zanyar; bilgin, bilim insanı, hakikat ve bilgi peşinde koşan bilge.',
    description: 'Zanyar; bilgin, bilim insanı, hakikat ve bilgi peşinde koşan bilge.',
    meaning_en: 'Zanyar; scholar, scientist, wise seeker of knowledge and truth.',
    meaning_de: 'Zanyar; Gelehrter, Wissenschaftler, weiser Sucher nach Wissen und Wahrheit.',
    meaning_ar: 'Zanyar؛ عالم، باحث، حكيم يسعى وراء المعرفة والحقيقة.',
    origin: 'Kurdish',
    tags: ['Bilgelik / Akıl', 'Popüler']
  },
  {
    id: 'berivan',
    name: 'Bêrîvan',
    gender: 'female',
    letter: 'B',
    meaning: 'Bêrîvan; süt sağan genç kadın, yayla kızı ve dağların taze çiçeği.',
    description: 'Bêrîvan; süt sağan genç kadın, yayla kızı ve dağların taze çiçeği.',
    meaning_en: 'Bêrîvan; milkmaid, shepherdess, symbol of highland meadows and nature freshness.',
    meaning_de: 'Bêrîvan; Milchmädchen, Almhüterin, Symbol der Hochlandwiesen und Bergnatur.',
    meaning_ar: 'Bêrîvan؛ فتاة المراعي الجبلية، رمز العفوية وجمال الطبيعة العذراء.',
    origin: 'Kurdish',
    tags: ['Doğa / Yaşam', 'Popüler']
  },
  {
    id: 'nazdar',
    name: 'Nazdar',
    gender: 'female',
    letter: 'N',
    meaning: 'Nazdar; nazlı, sevimli, cana yakın ve zarif güzel.',
    description: 'Nazdar; nazlı, sevimli, cana yakın ve zarif güzel.',
    meaning_en: 'Nazdar; coquettish, lovely, charming, and gracefully beautiful.',
    meaning_de: 'Nazdar; anmutig, reizend, liebenswert und charmant schön.',
    meaning_ar: 'Nazdar؛ مدللة، محبوبة، لطيفة المعشر وجميلة المحيا.',
    origin: 'Kurdish',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim']
  },
  {
    id: 'besdar',
    name: 'Beşdar',
    gender: 'male',
    letter: 'B',
    meaning: 'Beşdar; katılımcı, ortak, hayata ve dayanışmaya katkı sunan.',
    description: 'Beşdar; katılımcı, ortak, hayata ve dayanışmaya katkı sunan.',
    meaning_en: 'Beşdar; participant, contributor, one who shares in solidarity and life.',
    meaning_de: 'Beşdar; Teilnehmer, Mitwirkender, einer der Solidarität und Leben teilt.',
    meaning_ar: 'Beşdar؛ مشارك، مساهم، يعزز التكافل والتعاون في الحياة.',
    origin: 'Kurdish',
    tags: ['Toplum / Birlik', 'Kürtçe İsim']
  },
  {
    id: 'avdar',
    name: 'Avdar',
    gender: 'unisex',
    letter: 'A',
    meaning: 'Avdar; sulu, taze, bereketli; baharın gelişi ve Mart ayı.',
    description: 'Avdar; sulu, taze, bereketli; baharın gelişi ve Mart ayı.',
    meaning_en: 'Avdar; fresh, lush, fertile; the arrival of spring and the month of March.',
    meaning_de: 'Avdar; saftig, frisch, fruchtbar; Frühlingsbeginn und Monat März.',
    meaning_ar: 'Avdar؛ ريان، يانع، مبارك؛ قدوم الربيع وشهر آذار.',
    origin: 'Kurdish',
    tags: ['Doğa / Yaşam', 'Kürtçe İsim']
  },
  {
    id: 'dozdar',
    name: 'Dozdar',
    gender: 'male',
    letter: 'D',
    meaning: 'Dozdar; davasına inanan, idealist ve ilkeli kimse.',
    description: 'Dozdar; davasına inanan, idealist ve ilkeli kimse.',
    meaning_en: 'Dozdar; committed to a noble cause, idealistic and principled.',
    meaning_de: 'Dozdar; einer edlen Sache verpflichtet, idealistisch und prinzipientreu.',
    meaning_ar: 'Dozdar؛ صاحب قضية ومبدأ، مخلص لأهدافه النبيلة.',
    origin: 'Kurdish',
    tags: ['Güç / Cesaret', 'Kürtçe İsim']
  },
  {
    id: 'robar',
    name: 'Robar',
    gender: 'unisex',
    letter: 'R',
    meaning: 'Robar; ırmak, akarsu, vadilerden coşkuyla akan su.',
    description: 'Robar; ırmak, akarsu, vadilerden coşkuyla akan su.',
    meaning_en: 'Robar; river, flowing stream running passionately through valleys.',
    meaning_de: 'Robar; Fluss, strömender Bach der lebendig durch Täler fließt.',
    meaning_ar: 'Robar؛ نهر، جدول جارٍ يتدفق بحيوية عبر الوديان.',
    origin: 'Kurdish',
    tags: ['Doğa / Yaşam', 'Kürtçe İsim']
  },
  {
    id: 'rubar',
    name: 'Rûbar',
    gender: 'unisex',
    letter: 'R',
    meaning: 'Rûbar; nehir, akarsu, bereket ve hayat taşıyan büyük su.',
    description: 'Rûbar; nehir, akarsu, bereket ve hayat taşıyan büyük su.',
    meaning_en: 'Rûbar; great river, flowing waters carrying life and abundance.',
    meaning_de: 'Rûbar; großer Fluss, lebensspendende und fruchtbare Gewässer.',
    meaning_ar: 'Rûbar؛ نهر عظيم، مياه جارية تحمل الحياة والخصوبة.',
    origin: 'Kurdish',
    tags: ['Doğa / Yaşam', 'Popüler']
  },
  {
    id: 'sirvan',
    name: 'Şîrvan',
    gender: 'male',
    letter: 'Ş',
    meaning: 'Şîrvan; aslanlar yurdu, cesur ve yiğit; tarihi Kürdistan coğrafyası.',
    description: 'Şîrvan; aslanlar yurdu, cesur ve yiğit; tarihi Kürdistan coğrafyası.',
    meaning_en: 'Şîrvan; realm of lions, brave and valiant; historical Kurdish region.',
    meaning_de: 'Şîrvan; Reich der Löwen, tapfer und mutig; historische Region.',
    meaning_ar: 'Şîrvan؛ ديار الأسود، شجاع ومقدام؛ موطن تاريخي عريق.',
    origin: 'Kurdish',
    tags: ['Tarih / Kültür', 'Popüler']
  },
  {
    id: 'hejin',
    name: 'Hêjîn',
    gender: 'female',
    letter: 'H',
    meaning: 'Hêjîn; değerli, kıymetli, layık ve sevilmeye değer.',
    description: 'Hêjîn; değerli, kıymetli, layık ve sevilmeye değer.',
    meaning_en: 'Hêjîn; precious, worthy, valued, and deserving of high esteem.',
    meaning_de: 'Hêjîn; kostbar, würdig, wertvoll und hochgeschätzt.',
    meaning_ar: 'Hêjîn؛ ثمينة، جديرة بالاحترام، غالية ومحبوبة.',
    origin: 'Kurdish',
    tags: ['Kürtçe İsim']
  },
  {
    id: 'kejin',
    name: 'Kejîn',
    gender: 'female',
    letter: 'K',
    meaning: 'Kejîn; sarışın, kumral, sarı saçlı güzel kız.',
    description: 'Kejîn; sarışın, kumral, sarı saçlı güzel kız.',
    meaning_en: 'Kejîn; fair-haired, blonde beauty with golden locks.',
    meaning_de: 'Kejîn; blond, hellhaarig, Schönheit mit goldenen Locken.',
    meaning_ar: 'Kejîn؛ شقراء، صهباء، حسناء ذات خصلات ذهبية.',
    origin: 'Kurdish',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim']
  },
  {
    id: 'lawin',
    name: 'Lawîn',
    gender: 'unisex',
    letter: 'L',
    meaning: 'Lawîn; genç, dinç, delikanlı, hayatın en verimli çağındaki cesaret.',
    description: 'Lawîn; genç, dinç, delikanlı, hayatın en verimli çağındaki cesaret.',
    meaning_en: 'Lawîn; youth, vigorous, energetic young person in the prime of life.',
    meaning_de: 'Lawîn; jugendlich, vital, voller Tatkraft in der Blüte des Lebens.',
    meaning_ar: 'Lawîn؛ شاب، فتي، يافع مفعم بالعنفوان والحيوية.',
    origin: 'Kurdish',
    tags: ['Güç / Cesaret', 'Kürtçe İsim']
  },
  {
    id: 'nermin',
    name: 'Nermîn',
    gender: 'female',
    letter: 'N',
    meaning: 'Nermîn; yumuşak huylu, şefkatli, nazik ve iyi kalpli.',
    description: 'Nermîn; yumuşak huylu, şefkatli, nazik ve iyi kalpli.',
    meaning_en: 'Nermîn; soft-hearted, gentle, compassionate, and kind.',
    meaning_de: 'Nermîn; sanftmütig, mitfühlend, zart und gutherzig.',
    meaning_ar: 'Nermîn؛ لينة الطبع، عطوفة، رقيقة وطيبة القلب.',
    origin: 'Kurdish',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim']
  },
  {
    id: 'nexsin',
    name: 'Nexşîn',
    gender: 'female',
    letter: 'N',
    meaning: 'Nexşîn; nakışlı, bezeli, süslü ve oya gibi işlenmiş güzellik.',
    description: 'Nexşîn; nakışlı, bezeli, süslü ve oya gibi işlenmiş güzellik.',
    meaning_en: 'Nexşîn; embroidered, ornamented, delicate like fine artwork.',
    meaning_de: 'Nexşîn; verziert, wie feine Stickerei kunstvoll gestaltet.',
    meaning_ar: 'Nexşîn؛ منقوشة، مزخرفة، كالتطريز الفني البديع.',
    origin: 'Kurdish',
    tags: ['Sevgi / Güzellik', 'Kürtçe İsim']
  },
  {
    id: 'rastin',
    name: 'Rastîn',
    gender: 'unisex',
    letter: 'R',
    meaning: 'Rastîn; doğru, dürüst, hakiki, hakikat peşinde olan.',
    description: 'Rastîn; doğru, dürüst, hakiki, hakikat peşinde olan.',
    meaning_en: 'Rastîn; righteous, honest, true, genuine, seeker of truth.',
    meaning_de: 'Rastîn; wahrhaftig, ehrlich, aufrichtig, der Wahrheit verpflichtet.',
    meaning_ar: 'Rastîn؛ صادق، مستقيم، حقيقي، باحث عن الحق.',
    origin: 'Kurdish',
    tags: ['Bilgelik / Akıl', 'Kürtçe İsim']
  },
  {
    id: 'destin',
    name: 'Destîn',
    gender: 'female',
    letter: 'D',
    meaning: 'Destîn; kader, nasip, hayatın getirdiği güzel yazgı.',
    description: 'Destîn; kader, nasip, hayatın getirdiği güzel yazgı.',
    meaning_en: 'Destîn; destiny, fate, beautiful fortune brought by life.',
    meaning_de: 'Destîn; Schicksal, Bestimmung, glückliche Fügung des Lebens.',
    meaning_ar: 'Destîn؛ قدر، نصيب، مشيئة الحياة الجميلة.',
    origin: 'Kurdish',
    tags: ['Umut / Sevinç', 'Kürtçe İsim']
  },
  {
    id: 'hevin',
    name: 'Hevîn',
    gender: 'female',
    letter: 'H',
    meaning: 'Hevîn; aşk, derin sevgi, gönülden bağlanan muhabbet ve umut.',
    description: 'Hevîn; aşk, derin sevgi, gönülden bağlanan muhabbet ve umut.',
    meaning_en: 'Hevîn; love, deep affection, heartfelt attachment, and hope.',
    meaning_de: 'Hevîn; Liebe, tiefe Zuneigung, herzliche Verbundenheit und Hoffnung.',
    meaning_ar: 'Hevîn؛ محبة، عشق عميق، مودة قلبية وأمل.',
    origin: 'Kurdish',
    tags: ['Sevgi / Güzellik', 'Popüler']
  }
];

const junkSet = new Set(junkIds);
const filteredCurrent = currentNames.filter(item => {
  if (junkSet.has(item.id)) {
    return false;
  }
  return true;
});

const removedJunkItems = currentNames.filter(item => junkSet.has(item.id));
console.log(`[2] Removed ${removedJunkItems.length} artificial names.`);

const updatedNames = [...filteredCurrent, ...rescued];

// Sort alphabetically by name
updatedNames.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

console.log(`[3] Added ${rescued.length} authentic rescued names.`);
console.log(`[4] Total names in master: ${updatedNames.length} (Previous: ${currentNames.length})`);

fs.writeFileSync(namesMasterPath, JSON.stringify(updatedNames, null, 2), 'utf8');
console.log(`[5] Saved updated names_master.json`);

// Update silinen-uydurma-isimler.json
const currentDeleted = JSON.parse(fs.readFileSync(deletedPath, 'utf8'));
const rescuedIdSet = new Set(rescued.map(r => r.id));
const rescuedNameSet = new Set(rescued.map(r => r.name.toLowerCase()));

// Remove rescued items from deleted
const filteredDeleted = currentDeleted.filter(item => {
  if (rescuedIdSet.has(item.id)) return false;
  if (rescuedNameSet.has((item.name || '').toLowerCase())) return false;
  return true;
});

// Append removed junk items to deleted
const updatedDeleted = [...filteredDeleted, ...removedJunkItems];
fs.writeFileSync(deletedPath, JSON.stringify(updatedDeleted, null, 2), 'utf8');
console.log(`[6] Updated silinen-uydurma-isimler.json (Total: ${updatedDeleted.length})`);
