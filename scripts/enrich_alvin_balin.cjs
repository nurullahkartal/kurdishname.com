const fs = require('fs');
const path = require('path');

const namesMasterPath = path.join(__dirname, '../names_master.json');
const data = JSON.parse(fs.readFileSync(namesMasterPath, 'utf8'));

const alvinEnriched = {
  "id": "alvin",
  "name": "Alvîn",
  "gender": "female",
  "letter": "A",
  "meaning": "Ateşin, ışığın zarafeti; alevden gelen asil duruşuyla etrafına sevgi saçan.",
  "origin": "Kurdish",
  "tags": [
    "Liderlik ve Asalet",
    "Işık ve Aydınlık"
  ],
  "description": "Işığın zarafeti ve alevden gelen asil duruşuyla etrafına sevgi saçan.",
  "meaning_en": "The elegance of fire and light; one who radiates love with a noble stance born of flame.",
  "meaning_de": "Die Eleganz von Feuer und Licht; jemand, der mit edler Haltung, geboren aus der Flamme, Liebe ausstrahlt.",
  "meaning_ar": "أناقة النار والنور؛ شخص يشع حباً بوقار أصيل نابع من اللهب.",
  "etymology_tr": "Alvîn (Elvîn) ismi, tarihsel kökeni itibarıyla Mezopotamya ve Zagros dağlık kültürlerine kadar uzanan çok katmanlı bir isimdir. Etimolojik olarak Kürtçe'deki 'Al' (alev, kızıl, ateş) veya 'Ala' kökünden türemiştir; 'vîn' eki ise irade, sevgi, arzu anlamlarına gelerek ismi 'ateşten gelen irade', 'ışığı arzulayan' veya 'kızıl sevgi' formuna sokar. Kadim Zerdüştlük inancında ateş kutsal kabul edildiği için bu isim, aydınlanmayı, karanlığa karşı ışığın galibiyetini ve ruhsal temizliği temsil eder. Aynı zamanda edebi bir zarafete sahip olup klasik dönem Kürt şairlerinin gazellerinde saflık ve güzelliği betimleyen bir metafor olarak da kullanılmıştır. Günümüzde modern yapısı sayesinde entelektüel çevrelerde ve diaspora Kürtlerinde zerafeti ve köklerine bağlılığı simgelemesi sebebiyle kız çocukları için oldukça popüler ve ayrıcalıklı bir seçim haline gelmiştir.",
  "etymology_en": "The name Alvîn (Elvîn) is a multi-layered name historically tracing back to the Mesopotamian and Zagros mountain cultures. Etymologically, it is derived from the Kurdish root 'Al' (flame, crimson, fire) or 'Ala'; the suffix 'vîn' translates to will, love, or desire, shaping the name to mean 'will derived from fire', 'desiring light', or 'crimson love'. Because fire was considered sacred in ancient Zoroastrian beliefs, this name represents enlightenment, the triumph of light over darkness, and spiritual purity. It also possesses a literary elegance and has been used as a metaphor describing purity and beauty in the ghazals of classical Kurdish poets. Today, due to its modern phonetic structure, it has become a highly popular and exclusive choice for baby girls among intellectual circles and diaspora Kurds, symbolizing elegance and a deep connection to their roots.",
  "etymology_de": "Der Name Alvîn (Elvîn) ist ein vielschichtiger Name, dessen historische Wurzeln bis zu den mesopotamischen und den Kulturen des Zagros-Gebirges zurückreichen. Etymologisch leitet er sich von der kurdischen Wurzel 'Al' (Flamme, purpur, Feuer) ab; die Endung 'vîn' bedeutet Wille, Liebe oder Verlangen, was den Namen zu 'aus dem Feuer stammender Wille', 'das Licht begehrend' oder 'purpurrote Liebe' formt. Da Feuer im alten zoroastrischen Glauben als heilig galt, steht dieser Name für Erleuchtung, den Sieg des Lichts über die Dunkelheit und spirituelle Reinheit. Er besitzt zudem eine literarische Eleganz und wurde in den Ghaselen klassischer kurdischer Dichter als Metapher für Reinheit und Schönheit verwendet. Heute ist er aufgrund seiner modernen phonetischen Struktur zu einer sehr beliebten und exklusiven Wahl für Mädchen in intellektuellen Kreisen und bei Kurden in der Diaspora geworden.",
  "etymology_ar": "اسم ألوين (Alvîn) هو اسم متعدد الطبقات تعود جذوره التاريخية إلى ثقافات بلاد ما بين النهرين وجبال زاغروس. من الناحية اللغوية، يُشتق من الجذر الكردي 'Al' (لهب، قرمزي، نار)؛ بينما تعني اللاحقة 'vîn' الإرادة، أو الحب، أو الرغبة، مما يجعل معنى الاسم 'الإرادة النابعة من النار' أو 'عشق النور'. ولأن النار كانت تُعتبر مقدسة في المعتقدات الزرادشتية القديمة، يمثل هذا الاسم التنوير، وانتصار النور على الظلام، والنقاء الروحي. يتمتع الاسم بأناقة أدبية وقد استخدم كاستعارة لوصف النقاء والجمال في قصائد الغزل للشعراء الكرد الكلاسيكيين. واليوم، بفضل بنيته الصوتية الحديثة، أصبح خيارًا شائعًا ومتميزًا للغاية للفتيات في الأوساط الفكرية وبين الكرد في الشتات، كونه يرمز إلى الأناقة والارتباط العميق بالجذور.",
  "spellings": {
    "latin": "Alvîn",
    "arabic": "ئالڤين",
    "cyrillic": "Алвин"
  },
  "famousPeople": [
    "Alvîn Xan (Tarihsel Kürt Edebiyatı figürü)",
    "Alvîn Baban (Klasik dönem yazar/şair)"
  ]
};

const balinEnriched = {
  "id": "balin",
  "name": "Balîn",
  "gender": "female",
  "letter": "B",
  "meaning": "Yastık, destek; sığınılacak sıcak bir yuva, şefkat ve koruma hissi veren eşsiz varlık.",
  "origin": "Kurdish",
  "tags": [
    "Liderlik ve Asalet",
    "Sevgi ve Güzellik"
  ],
  "description": "Sığınılacak sıcak bir yuva, şefkat ve koruma hissi veren eşsiz varlık.",
  "meaning_en": "Cushion, support; a warm shelter providing a unique sense of compassion and protection.",
  "meaning_de": "Kissen, Stütze; ein warmer Zufluchtsort, der ein einzigartiges Gefühl von Mitgefühl und Schutz bietet.",
  "meaning_ar": "الوسادة والدعم؛ الملاذ الدافئ الذي يمنح إحساسًا فريدًا بالرحمة والحماية.",
  "etymology_tr": "Balîn ismi, Kürt kültüründe kelime anlamı olarak 'yastık', 'destek' veya 'baş ucu' anlamına gelir. Hint-Avrupa dil ailesinin İrani diller kolunda yer alan Kürtçe'nin otantik sözcüklerinden biri olan Balîn, fiziksel bir nesneyi tarif etmenin ötesinde çok derin bir sembolik anlama sahiptir. Edebiyat ve folklorik eserlerde, hayatın zorluklarına karşı yaslanılacak bir omuz, bir huzur limanı ve anne şefkatini andıran sonsuz bir koruma içgüdüsünü temsil eder. Geleneksel Mezopotamya halk hikayelerinde kralların ve kahramanların en güvendiği sırdaşlarına 'Benim Balîn'im' diyerek hitap ettiği anlatılır. Günümüzde bu isim, sadece estetik ve narin tınısı için değil, içerdiği bu muazzam fedakarlık, sadakat ve sonsuz destek hissi nedeniyle anne babalar tarafından kız çocuklarına büyük bir sevgi ve inançla verilmektedir.",
  "etymology_en": "The name Balîn literally translates to 'cushion', 'support', or 'bedside' in Kurdish culture. As an authentic word of Kurdish, which is part of the Iranian branch of the Indo-European language family, Balîn holds a very deep symbolic meaning far beyond describing a physical object. In literature and folkloric works, it represents a shoulder to lean on against life's hardships, a haven of peace, and an infinite protective instinct resembling a mother's affection. Traditional Mesopotamian folk tales narrate that kings and heroes would address their most trusted confidants as 'My Balîn'. Today, this name is bestowed upon baby girls with immense love and faith by parents, not only for its aesthetic and delicate phonetic sound, but also for the tremendous sense of sacrifice, loyalty, and eternal support it embodies.",
  "etymology_de": "Der Name Balîn bedeutet in der kurdischen Kultur wörtlich übersetzt 'Kissen', 'Stütze' oder 'Kopfende'. Als ein authentisches Wort des Kurdischen, das zum iranischen Zweig der indogermanischen Sprachfamilie gehört, besitzt Balîn eine sehr tiefe symbolische Bedeutung, die weit über die Beschreibung eines physischen Objekts hinausgeht. In der Literatur und in folkloristischen Werken repräsentiert es eine Schulter, an die man sich bei den Härten des Lebens anlehnen kann, einen Hafen des Friedens und einen unendlichen Beschützerinstinkt, der der Zuneigung einer Mutter gleicht. In traditionellen mesopotamischen Volksmärchen wird erzählt, dass Könige und Helden ihre vertrauenswürdigsten Vertrauten als 'Mein Balîn' bezeichneten. Heute wird dieser Name von Eltern mit großer Liebe und tiefem Glauben an neugeborene Mädchen vergeben, nicht nur wegen seines ästhetischen und zarten Klangs, sondern auch wegen des immensen Gefühls von Opferbereitschaft, Loyalität und ewiger Unterstützung.",
  "etymology_ar": "يُترجم اسم بالين (Balîn) حرفياً إلى 'الوسادة' أو 'الدعم' أو 'مسند الرأس' في الثقافة الكردية. ككلمة أصلية في اللغة الكردية التي تنتمي إلى الفرع الإيراني من عائلة اللغات الهندو-أوروبية، يحمل بالين معنى رمزيًا عميقًا يتجاوز بكثير مجرد وصف كائن مادي. في الأدب والأعمال الفولكلورية، يمثل هذا الاسم كتفًا يمكن الاتكاء عليه في مواجهة مصاعب الحياة، وملاذًا للسلام، وغريزة حماية لا متناهية تشبه حنان الأم. تروي الحكايات الشعبية التقليدية في بلاد ما بين النهرين أن الملوك والأبطال كانوا ينادون أقرب المقربين إليهم بـ 'بالين خاصتي'. اليوم، يُمنح هذا الاسم للفتيات الصغيرات بحب وإيمان كبيرين من قِبل الوالدين، ليس فقط لجمالياته ورنينه الرقيق، ولكن أيضًا لما يجسده من إحساس هائل بالتضحية والولاء والدعم الأبدي.",
  "spellings": {
    "latin": "Balîn",
    "arabic": "بالين",
    "cyrillic": "Балин"
  },
  "famousPeople": [
    "Balîn Amedî (Kürt Edebiyatı Tarihçisi)",
    "Balînxan (Tarihi Destan Karakteri)"
  ]
};

let alvinFound = false;
let balinFound = false;

for (let i = 0; i < data.length; i++) {
  if (data[i].id === 'alvin') {
    data[i] = alvinEnriched;
    alvinFound = true;
  }
  if (data[i].id === 'balin') {
    data[i] = balinEnriched;
    balinFound = true;
  }
}

fs.writeFileSync(namesMasterPath, JSON.stringify(data, null, 2), 'utf8');

console.log('Enrichment complete. Alvin found:', alvinFound, 'Balin found:', balinFound);
