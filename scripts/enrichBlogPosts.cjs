const fs = require('fs');
const path = require('path');

// Category mapping for the 22 blog posts
const categories = {
  "girls-names-list": "girls",
  "famous-100-girls-names": "girls",
  "flower-100-names": "girls",
  "color-100-names": "girls",
  
  "boys-names-list": "boys",
  "famous-100-boys-names": "boys",
  "dynasty-100-names": "boys",
  
  "popular-names-list": "general",
  "modern-names-guide": "general",
  "2026-populer-isimler": "general",
  "modern-100-names": "general",
  "modern-ve-nadir-isimler": "general",
  "rare-100-names": "general",
  
  "mitolojik-isimler-rehberi": "mythology",
  "mythology-100-names": "mythology",
  "folklore-100-names": "mythology",
  
  "nature-100-names": "nature",
  "regional-100-names": "nature",
  
  "virtue-100-names": "virtue",
  "spiritual-100-names": "virtue",
  "artistic-100-names": "virtue",
  
  "nature-names": "nature",
  "power-courage-names": "boys",
  "light-brightness-names": "girls",
  "wisdom-intellect-names": "virtue",
  "leadership-nobility-names": "boys",
  "love-beauty-names": "girls",
  "traditional-classic-names": "general"
};

// Localized headings for sections
const headings = {
  tr: {
    origins: "## İsim Kökenleri",
    significance: "## Kültürel Önem",
    faq: "## Sık Sorulan Sorular (FAQ)",
    extra: "## Tarihsel Gelişim ve İsim Verme Gelenekleri",
    listHeader: "## İsim Listesi ve Anlamları",
    questionPrefix: "Soru: ",
    answerPrefix: "Cevap: "
  },
  en: {
    origins: "## Name Origins",
    significance: "## Cultural Significance",
    faq: "## Frequently Asked Questions (FAQ)",
    extra: "## Historical Development and Naming Traditions",
    listHeader: "## List of Names and Meanings",
    questionPrefix: "Question: ",
    answerPrefix: "Answer: "
  },
  de: {
    origins: "## Namensursprung",
    significance: "## Kulturelle Bedeutung",
    faq: "## Häufig gestellte Fragen (FAQ)",
    extra: "## Historische Entwicklung und Namensgebungstraditionen",
    listHeader: "## Liste der Namen und Bedeutungen",
    questionPrefix: "Frage: ",
    answerPrefix: "Antwort: "
  },
  ar: {
    origins: "## أصول الأسماء",
    significance: "## الأهمية الثقافية",
    faq: "## الأسئلة الشائعة (FAQ)",
    extra: "## التطور التاريخي وتقاليد التسمية",
    listHeader: "## قائمة الأسماء ومعانيها",
    questionPrefix: "سؤال: ",
    answerPrefix: "جواب: "
  }
};

// Category text templates (extremely rich, localized, academic prose)
const templates = {
  girls: {
    tr: {
      origins: "Kürtçe kız isimlerinin kökenleri, Hint-Avrupa dil ailesinin İrani grubuna dahil olan Kürt dilinin zengin tarihi katmanlarına dayanır. Bu isimlerin birçoğu antik Avesta metinlerinden, Med uygarlığının dil kalıntılarından ve klasik Kürt edebiyatından süzülerek günümüze ulaşmıştır. Fonetik yapıları itibarıyla son derece melodik ve yumuşak tınılara sahip olan bu isimler, genellikle doğanın canlanışını, göksel cisimleri ve asil duyguları temsil eder. Kürtçe dil bilgisindeki dişil takılar ve kelime köklerinin estetik uyumu, kız isimlerine eşsiz bir zarafet ve akıcılık kazandırır.",
      significance: "Kürt kültüründe kadın, yaşamın, bereketin ve toplumsal direncin en önemli simgesidir. Bu durum, kız çocuklarına verilen isimlerde de kendini açıkça gösterir. 'Jiyan' (yaşam) veya 'Hevîn' (umut) gibi isimler, kadının toplumdaki kurucu ve birleştirici rolünü yüceltir. Ayrıca Mezopotamya'nın bereketli toprakları, ulu dağları ve kır çiçekleri, kız isimlerinin en büyük ilham kaynağıdır. Kız isimleri seçilirken, çocuğun ailesine uğur, bereket ve aydınlık getirmesi temenni edilir; bu nedenle ışık, güneş ve bahar temalı isimler tarih boyunca her zaman el üstünde tutulmuştur."
    },
    en: {
      origins: "The origins of Kurdish girls' names are deeply rooted in the historical layers of the Kurdish language, which belongs to the Iranian group of the Indo-European language family. Many of these names have survived to the present day by filtering through ancient Avestan texts, linguistic remnants of the Medes civilization, and classical Kurdish literature. Possessing extremely melodic and soft tones phonetically, these names usually represent the revival of nature, celestial bodies, and noble emotions. The aesthetic harmony of feminine suffixes and word roots in Kurdish grammar gives girl names a unique elegance and fluidity.",
      significance: "In Kurdish culture, woman is the most important symbol of life, abundance, and social resilience. This situation is clearly reflected in the names given to baby girls. Names like 'Jiyan' (life) or 'Hevîn' (hope) glorify the founding and unifying role of women in society. In addition, the fertile lands, majestic mountains, and wildflowers of Mesopotamia are the greatest source of inspiration for girls' names. When choosing a girl's name, it is wished that the child will bring good luck, abundance, and light to her family; therefore, names themed around light, sun, and spring have always been cherished throughout history."
    },
    de: {
      origins: "Die Ursprünge kurdischer Mädchennamen sind tief in den historischen Schichten der kurdischen Sprache verwurzelt, die zur iranischen Gruppe der indogermanischen Sprachfamilie gehört. Viele dieser Namen haben bis heute überlebt, indem sie durch alte avestische Texte, sprachliche Überreste der Meder-Zivilisation und klassische kurdische Literatur gefiltert wurden. Diese Namen besitzen phonetisch äußerst melodische und weiche Töne und stehen meist für das Wiedererwachen der Natur, Himmelskörper und edle Gefühle. Die ästhetische Harmonisierung weiblicher Suffixe und Wortwurzeln in der kurdischen Grammatik verleiht Mädchennamen eine einzigartige Eleganz und Flüssigkeit.",
      significance: "In der kurdischen Kultur ist die Frau das wichtigste Symbol für Leben, Fruchtbarkeit und gesellschaftliche Widerstandskraft. Dies spiegelt sich deutlich in den Namen wider, die Mädchen gegeben werden. Namen wie „Jiyan“ (Leben) oder „Hevîn“ (Hoffnung) verherrlichen die gründende und einende Rolle der Frau in der Gesellschaft. Zudem sind die fruchtbaren Böden, majestätischen Berge und Wildblumen Mesopotamiens die größte Inspirationsquelle für Mädchennamen. Bei der Wahl eines Mädchennamens wird gewünscht, dass das Kind seiner Familie Glück, Fülle und Licht bringt; daher wurden Namen rund um Licht, Sonne und Frühling in der Geschichte schon immer geschätzt."
    },
    ar: {
      origins: "تضرب أصول أسماء البنات الكردية بجذورها عميقاً في الطبقات التاريخية للغة الكردية، التي تنتمي إلى المجموعة الإيرانية من عائلة اللغات الهندية الأوروبية. وقد صمدت العديد من هذه الأسماء حتى يومنا هذا من خلال تصفيتها عبر النصوص الأفستية القديمة، والبقايا اللغوية للحضارة الميدية، والأدب الكردي الكلاسيكي. تمتاز هذه الأسماء ببنيتها الصوتية العذبة واللحنية للغاية، وغالباً ما تمثل تجدد الطبيعة، والأجرام السماوية، والمشاعر النبيلة. يمنح الانسجام الجمالي للواحق التأنيث وجذور الكلمات في القواعد الكردية أسماء البنات أناقة وفرادة لا مثيل لها.",
      significance: "تمثل المرأة في الثقافة الكردية رمز الحياة والخصوبة والصمود الاجتماعي، وينعكس هذا بوضوح في الأسماء المختارة للبنات. تعزز أسماء مثل 'جيان' (الحياة) أو 'هيفين' (الأمل) الدور التأسيسي والتوحيدي للمرأة في المجتمع. بالإضافة إلى ذلك، تعتبر الأراضي الخصبة والجبال الشامخة والزهور البرية في بلاد ما بين النهرين المصدر الأكبر لإلهام أسماء الإناث. عند اختيار اسم للبنت، يُتمنى دائماً أن تجلب الطفلة لعائلتها الخير والبركة والضياء، ولذلك حظيت الأسماء المرتبطة بالنور والشمس والربيع بمكانة رفيعة عبر التاريخ."
    }
  },
  boys: {
    tr: {
      origins: "Kürtçe erkek isimlerinin kökeni, Kürt halkının binlerce yıllık göçebe ve savaşçı tarihi, coğrafi mücadeleleri ve Mezopotamya'nın asil destanlarıyla şekillenmiştir. İrani dil grubunun kadim köklerinden gelen bu isimler, genellikle heybetli doğa olaylarını, gücü, cesareti ve bilgeliği temsil eden kelimelerden türetilmiştir. Kürtçenin eril ses yapısı ve fonetik vurguları, erkek isimlerine karakteristik bir güç ve vakur bir tını kazandırır. Bu isimler, hem tarihi liderlerin anısını yaşatır hem de geleceğe yönelik asil bir duruşu simgeler.",
      significance: "Kürt toplumsal yapısında erkek isimleri; dürüstlük, cesaret, cömertlik ve koruyuculuk gibi evrensel erdemleri yüceltmek amacıyla seçilir. 'Agît' (yiğit) veya 'Serhat' (sınır boyu kahramanı) gibi isimler, bireyin topluma ve vatanına karşı sorumluluklarını simgeler. Aynı zamanda 'Baran' (yağmur) gibi doğanın bereketini ve gücünü simgeleyen isimler de yaygındır. Erkek isimleri seçilirken, çocuğun adıyla büyümesi, karakterinin adının taşıdığı asalet ve güçle şekillenmesi en büyük temennidir."
    },
    en: {
      origins: "The origins of Kurdish boys' names are shaped by the thousands-of-years-old nomadic and warrior history of the Kurdish people, their geographical struggles, and the noble epics of Mesopotamia. Coming from the ancient roots of the Iranian language group, these names are usually derived from words representing grand natural phenomena, power, courage, and wisdom. The masculine phonetic structure and vocal emphasis of Kurdish give boy names a characteristic power and dignified tone. These names preserve the memory of historical leaders while symbolizing a noble stance for the future.",
      significance: "In the Kurdish social structure, boys' names are chosen to glorify universal virtues such as honesty, courage, generosity, and protectiveness. Names like 'Agît' (brave) or 'Serhat' (frontier hero) symbolize the individual's responsibilities towards society and their homeland. At the same time, names like 'Baran' (rain), representing the abundance and power of nature, are also common. When choosing a boy's name, the greatest wish is that the child will grow up with his name, and his character will be shaped by the nobility and strength that his name carries."
    },
    de: {
      origins: "Die Ursprünge kurdischer Jungennamen sind geprägt von der jahrtausendealten Nomaden- und Kriegergeschichte des kurdischen Volkes, seinen geografischen Kämpfen und den edlen Epen Mesopotamiens. Aus den alten Wurzeln der iranischen Sprachgruppe stammend, leiten sich diese Namen meist von Wörtern ab, die erhabene Naturphänomene, Kraft, Mut und Weisheit darstellen. Die maskuline phonetische Struktur und stimmliche Betonung des Kurdischen verleihen Jungennamen eine charakteristische Kraft und einen würdevollen Ton. Diese Namen bewahren das Gedenken an historische Führer und symbolisieren gleichzeitig eine edle Haltung für die Zukunft.",
      significance: "In der kurdischen Sozialstruktur werden Jungennamen gewählt, um universelle Tugenden wie Ehrlichkeit, Mut, Großzügigkeit und Schutzbereitschaft zu verherrlichen. Namen wie „Agît“ (tapfer) oder „Serhat“ (Grenzeheld) symbolisieren die Verantwortung des Einzelnen gegenüber der Gesellschaft und seiner Heimat. Gleichzeitig sind auch Namen wie „Baran“ (Regen), die die Fülle und Kraft der Natur repräsentieren, weit verbreitet. Bei der Wahl eines Jungennamens ist es der größte Wunsch, dass das Kind mit seinem Namen aufwächst und sein Charakter durch die Würde und Stärke geformt wird, die sein Name in sich trägt."
    },
    ar: {
      origins: "تشكلت أصول أسماء الأولاد الكردية عبر آلاف السنين من تاريخ الشعب الكردي المرتبط بالترحال والفروسية، ونضالاته الجغرافية، والملاحم النبيلة في بلاد ما بين النهرين. وتستمد هذه الأسماء جذورها من لغات المجموعة الإيرانية القديمة، وغالباً ما تشتق من الكلمات التي تمثل الظواهر الطبيعية المهيبة، والقوة، والشجاعة، والحكمة. يمنح التركيب الصوتي الذكوري للغة الكردية أسماء الأولاد نبرة قوية ووقورة مميزة، تخلد ذكرى القادة التاريخيين وتعبر عن وقوف شامخ نحو المستقبل.",
      significance: "في البنية الاجتماعية الكردية، يتم اختيار أسماء الأولاد لتمجيد الفضائل الإنسانية والقبلية مثل الصدق، والشهامة، والكرم، وحماية المستضعفين. ترمز أسماء مثل 'أغيت' (الجريء) أو 'سرحات' (بطل الحدود) إلى مسؤوليات الفرد تجاه مجتمعه ووطنه. وفي الوقت نفسه، تشيع الأسماء التي ترمز إلى بركة الطبيعة وقوتها مثل 'باران' (المطر). عند اختيار اسم للولد، تكون الأمنية الكبرى دائماً أن ينمو الطفل ومعه خصال اسمه، وأن يتشكل طابعه بالنبل والقوة اللذين يحملهما الاسم."
    }
  },
  general: {
    tr: {
      origins: "Modern ve popüler Kürtçe bebek isimleri, kadim köklerin çağdaş dil estetiğiyle harmanlanmasından doğar. Bu isimlerin kökeni genellikle klasik Kürtçedeki doğa betimlemelerine, duygusal kavramlara ve sanatsal ifadelere dayanır. Ancak yeni nesil isimlerin en belirgin özelliği, fonetik olarak kısa, akıcı ve uluslararası düzeyde kolay telaffuz edilebilir olmalarıdır. Dilin tarihsel gelişim süreci içerisinde, ağır fonetik yapılar sadeleşerek modern dünya dillerine uyum sağlayan ve aynı zamanda kültürel anlam derinliğini koruyan yepyeni bir isim hazinesi oluşturmuştur.",
      significance: "Günümüzde bebek isimleri seçilirken kültürel kimliği koruma ve küreselleşen dünyaya uyum sağlama kaygısı bir arada yaşanmaktadır. Popüler Kürtçe isimler, ebeveynlerin çocuklarına hem asil bir miras bırakmalarını hem de onların modern toplumda rahatça kendilerini ifade edebilmelerini sağlar. 'Arîn' veya 'Rênas' gibi modern tınılı popüler isimler, hem taşıdıkları derin felsefi anlamlar hem de kulağa hoş gelen yapıları nedeniyle son derece büyük ilgi görmektedir. Bu isimler, kültürel sürekliliğin en estetik köprüleridir."
    },
    en: {
      origins: "Modern and popular Kurdish baby names are born from the blending of ancient roots with contemporary linguistic aesthetics. The origins of these names are generally based on nature descriptions, emotional concepts, and artistic expressions in classical Kurdish. However, the most distinctive feature of the new generation of names is that they are phonetically short, fluid, and easily pronounceable internationally. In the historical development process of the language, heavy phonetic structures simplified to form a brand new treasure of names that harmonize with modern world languages while preserving cultural depth of meaning.",
      significance: "Today, when choosing baby names, the concern of preserving cultural identity and adapting to the globalizing world are experienced together. Popular Kurdish names allow parents to both leave a noble heritage to their children and enable them to express themselves easily in modern society. Popular names with modern tones like 'Arîn' or 'Rênas' attract extremely great interest due to both their deep philosophical meanings and their pleasant-sounding structures. These names are the most aesthetic bridges of cultural continuity."
    },
    de: {
      origins: "Moderne und beliebte kurdische Babynamen entstehen aus der Verschmelzung alter Wurzeln mit zeitgenössischer Sprachästhetik. Die Ursprünge dieser Namen basieren im Allgemeinen auf Naturbeschreibungen, emotionalen Konzepten und künstlerischen Ausdrücken im klassischen Kurdisch. Das markanteste Merkmal der neuen Generation von Namen ist jedoch, dass sie phonetisch kurz, flüssig und international leicht auszusprechen sind. Im historischen Entwicklungsprozess der Sprache vereinfachten sich schwere phonetische Strukturen, um einen völlig neuen Namensschatz zu bilden, der mit modernen Weltsprachen harmoniert und gleichzeitig die kulturelle Bedeutungstiefe bewahrt.",
      significance: "Bei der Auswahl von Babynamen stehen heute die Bewahrung der kulturellen Identität und die Anpassung an die globalisierte Welt nebeneinander im Vordergrund. Beliebte kurdische Namen ermöglichen es Eltern, ihren Kindern ein edles Erbe zu hinterlassen und sich in der modernen Gesellschaft problemlos auszudrücken. Beliebte Namen mit modernen Klängen wie „Arîn“ oder „Rênas“ stoßen sowohl aufgrund ihrer tiefen philosophischen Bedeutung als auch ihrer wohlklingenden Strukturen auf enormes Interesse. Diese Namen sind die ästhetischsten Brücken kultureller Kontinuität."
    },
    ar: {
      origins: "تولد أسماء الأطفال الكردية الحديثة والشائعة من مزج الجذور التاريخية القديمة مع جماليات اللغة المعاصرة. وتعتمد أصول هذه الأسماء عموماً على أوصاف الطبيعة، والمفاهيم العاطفية، والتعبيرات الفنية في اللغة الكردية الكلاسيكية. ومع ذلك، فإن الميزة الأكثر وضوحاً لجيل الأسماء الجديد هي قصرها الصوتي وانسيابيتها وسهولة نطقها على المستوى الدولي. في سياق التطور التاريخي للغة، تبسطت الهياكل الصوتية الثقيلة لتشكل كنزاً جديداً بالكامل من الأسماء التي تتوافق مع لغات العالم المعاصر مع الحفاظ على عمق المعنى الثقافي.",
      significance: "في وقتنا الحالي، يتزامن الاهتمام بالحفاظ على الهوية الثقافية مع الرغبة في التكيف مع العالم المتجانس عند اختيار أسماء المواليد. تتيح الأسماء الكردية الشائعة للآباء توريث أطفالهم إرثاً نبيلاً وتسهل عليهم التعبير عن أنفسهم في المجتمع الحديث. تحظى الأسماء الحديثة مثل 'آرين' أو 'ريناس' باهتمام واسع بسبب معانيها الفلسفية العميقة وبنيتها الموسيقية اللطيفة. وتعتبر هذه الأسماء بمثابة الجسور الأكثر جمالاً لاستمرار الثقافة."
    }
  },
  mythology: {
    tr: {
      origins: "Kürt mitolojik ve destansı isimlerinin kökenleri, insanlık tarihinin ve medeniyetinin beşiği sayılan kadim Mezopotamya topraklarına ve antik inanç sistemlerine dayanır. Bu isimler, Zerdüştlük felsefesinin kutsal metinlerinden, Demirci Kawa ve Şahmaran gibi ölümsüz kahramanlık destanlarından ve köklü Mezopotamya mitlerinden süzülerek günümüze ulaşmıştır. Dilsel açıdan bakıldığında, her bir mitolojik isim, kökünde derin felsefi mücadeleleri, iyilik ile kötülüğün savaşını ve özgürlük arayışını barındıran zengin etimolojik yapılara sahiptir.",
      significance: "Mitolojik isimler, Kürt kültürel hafızasında ve kimliğinde son derece kritik bir yere sahiptir. Bu isimler sıradan birer kelime olmayıp, binlerce yıllık onurlu bir direncin, bilgeliğin ve toplumsal uyanışın canlı sembolleridir. Çocuğuna mitolojik bir isim veren aileler, ona yalnızca bir ad değil, aynı zamanda saygı duyulacak bir karakter ve köklü bir tarih bilinci armağan ederler. 'Kawa' ismi hürriyeti ve emeği temsil ederken, 'Şahmaran' ismi şifa ve kadim bilgeliği simgeler. Bu nedenle mitolojik isimler her çağda asaletini ve popülaritesini korur."
    },
    en: {
      origins: "The origins of Kurdish mythological and epic names are based on the ancient lands of Mesopotamia, considered the cradle of human history and civilization, and ancient belief systems. These names have reached the present day by filtering through the sacred texts of Zoroastrian philosophy, immortal heroic epics like Kawa the Blacksmith and Shahmaran, and deep-rooted Mesopotamian myths. From a linguistic point of view, each mythological name has rich etymological structures containing deep philosophical struggles, the battle between good and evil, and the quest for freedom at its root.",
      significance: "Mythological names have an extremely critical place in Kurdish cultural memory and identity. These names are not just ordinary words, but living symbols of thousands of years of honorable resistance, wisdom, and social awakening. Families who give their children a mythological name present them not just with a name, but also with a character to be respected and a deep-rooted historical consciousness. While the name 'Kawa' represents freedom and labor, the name 'Shahmaran' symbolizes healing and ancient wisdom. Therefore, mythological names preserve their nobility and popularity in every age."
    },
    de: {
      origins: "Die Ursprünge kurdischer mythologischer und epischer Namen basieren auf den alten Ländern Mesopotamiens, der Wiege der Menschheitsgeschichte und Zivilisation, und alten Glaubenssystemen. Diese Namen haben die Gegenwart erreicht, indem sie durch die heiligen Texte der zoroastrischen Philosophie, unsterbliche Heldenepen wie Kawa der Schmied und Shahmaran sowie tief verwurzelte mesopotamische Mythen gefiltert wurden. Aus linguistischer Sicht besitzt jeder mythologische Name reiche etymologische Strukturen, die tiefe philosophische Kämpfe, den Kampf zwischen Gut und Böse und das Streben nach Freiheit an seiner Wurzel enthalten.",
      significance: "Mythologische Namen haben einen äußerst kritischen Platz im kurdischen kulturellen Gedächtnis und der Identität. Diese Namen sind nicht nur gewöhnliche Wörter, sondern lebendige Symbole einer jahrtausendealten ehrenvollen Widerstandskraft, Weisheit und gesellschaftlichen Erweckung. Familien, die ihren Kindern einen mythologischen Namen geben, schenken ihnen nicht nur einen Namen, sondern auch einen zu respektierenden Charakter und ein tief verwurzeltes historisches Bewusstsein. Während der Name „Kawa“ Freiheit und Arbeit repräsentiert, symbolisiert der Name „Shahmaran“ Heilung und alte Weisheit. Daher bewahren mythologische Namen in jeder Epoche ihre Würde und Popularität."
    },
    ar: {
      origins: "تعتمد أصول الأسماء الملحمية والأسطورية الكردية على بلاد ما بين النهرين القديمة، التي تُعتبر مهد التاريخ البشري والحضارة الإنسانية، وعلى النظم العقائدية الغابرة. وقد وصلت هذه الأسماء إلى يومنا هذا عبر نصوص الفلسفة الزرادشتية المقدسة وملاحم الأبطال الخالدين مثل 'كاوه الحداد' و'شاهماران' وقصص ميزوبوتاميا العريقة. ومن الناحية اللغوية، يمتلك كل اسم أسطوري بنية اشتقاقية غنية تعبر عن صراعات فلسفية عميقة، وحروب الخير والشر، والبحث المستمر عن الحرية.",
      significance: "تحتل الأسماء الأسطورية مكانة بالغة الأهمية في الذاكرة والهوية الثقافية الكردية. فهذه الأسماء ليست مجرد مفردات عادية، بل هي رموز حية لآلاف السنين من المقاومة الشريفة والحكمة والصحوة الاجتماعية. تمنح العائلات التي تختار اسماً أسطورياً لأطفالها ليس مجرد لقب، بل طابعاً جديراً بالاحترام ووعياً تاريخياً عميقاً. فبينما يمثل اسم 'كاوه' الحرية والكفاح، يرمز اسم 'شاهماران' إلى الشفاء والحكمة القديمة. لذلك، تحتفظ هذه الأسماء بهيبتها وشعبيتها في كل العصور."
    }
  },
  nature: {
    tr: {
      origins: "Kürtçe doğa ve coğrafya isimlerinin kökenleri, Kürt halkının tarih boyunca Zagros ve Munzur dağlarının yamaçlarında, Dicle ve Fırat nehirlerinin kıyılarında sürdürdüğü pastoral yaşam tarzına dayanır. Doğanın her bir unsuruna derin bir saygı duyan Kürtler, bu canlılığı dillerine ve isimlerine yansıtmışlardır. Yağmur (Baran), rüzgar (Bager), şimşek (Brûsk) ve nehirler gibi doğanın en görkemli halleri, Kürtçenin zengin coğrafi kelime haznesi aracılığıyla asil ve heybetli bebek isimlerine dönüşmüştür.",
      significance: "Kürt kültüründe tabiat, sadece fiziksel bir çevre değil, özgürlüğün, direncin ve yaşamın kendisinin bir ifadesidir. Bu nedenle doğa isimleri, çocuğun karakterinin de tıpkı bir dağ gibi sarsılmaz, bir nehir gibi coşkulu ve bahar çiçekleri gibi narin ve taze olmasını simgeler. Doğa temalı isimler seçilirken, çocuğun evrenle olan uyumu ve doğanın sunduğu sonsuz bereket ve enerjiyi hayatı boyunca taşıması temenni edilir. Bu isimler hem doğaya duyulan minnettarlığı simgeler hem de kültürel sürekliliği sağlar."
    },
    en: {
      origins: "The origins of Kurdish nature and geography names are based on the pastoral lifestyle that the Kurdish people have maintained throughout history on the slopes of the Zagros and Munzur mountains, and on the banks of the Tigris and Euphrates rivers. Possessing a deep respect for every element of nature, the Kurds reflected this vitality in their language and names. The most grand states of nature, such as rain (Baran), wind (Bager), lightning (Brûsk), and rivers, have turned into noble and majestic baby names through the rich geographical vocabulary of Kurdish.",
      significance: "In Kurdish culture, nature is not just a physical environment, but an expression of freedom, resilience, and life itself. Therefore, nature names symbolize that the child's character should be unwavering like a mountain, enthusiastic like a river, and delicate and fresh like spring flowers. When choosing nature-themed names, it is wished that the child will carry the harmony with the universe and the infinite abundance and energy offered by nature throughout their life. These names represent both gratitude towards nature and ensure cultural continuity."
    },
    de: {
      origins: "Die Ursprünge kurdischer Natur- und Geografienamen basieren auf der pastoralen Lebensweise, die das kurdische Volk im Laufe der Geschichte an den Hängen der Zagros- und Munzur-Berge sowie an den Ufern der Flüsse Tigris und Euphrat gepflegt hat. Mit tiefem Respekt vor jedem Element der Natur spiegelten die Kurden diese Vitalität in ihrer Sprache und ihren Namen wider. Die großartigsten Zustände der Natur wie Regen (Baran), Wind (Bager), Blitz (Brûsk) und Flüsse haben sich durch den reichen geografischen Wortschatz des Kurdischen in edle und majestätische Babynamen verwandelt.",
      significance: "In der kurdischen Kultur ist die Natur nicht nur eine physische Umwelt, sondern Ausdruck von Freiheit, Beständigkeit und dem Leben selbst. Daher symbolisieren Naturnamen, dass der Charakter des Kindes unerschütterlich wie ein Berg, enthusiastisch wie ein Fluss und zart und frisch wie Frühlingsblumen sein sollte. Bei der Wahl von Namen rund um die Natur wird gewünscht, dass das Kind die Harmonie mit dem Universum und die unendliche Fülle und Energie, die die Natur bietet, sein Leben lang in sich trägt. Diese Namen stehen sowohl für Dankbarkeit gegenüber der Natur als auch für die Gewährleistung kultureller Kontinuität."
    },
    ar: {
      origins: "تعتمد أصول أسماء الطبيعة والجغرافيا الكردية على أسلوب الحياة الرعوي الذي حافظ عليه الشعب الكردي عبر التاريخ في سفوح جبال زاغروس ومُنْزُر، وعلى ضفاف نهري دجلة والفرات. وقد عكس الأكراد، الذين يكنون احتراماً عميقاً لكل عنصر من عناصر الطبيعة، هذه الحيوية في لغتهم وأسمائهم. وتحولت الحالات الأكثر جلالاً للطبيعة مثل المطر (باران)، والرياح (باغير)، والبرق (بروسك)، والأنهار، إلى أسماء أطفال نبيلة ومهيبة من خلال المفردات الجغرافية الغنية للغة الكردية.",
      significance: "لا تعتبر الطبيعة في الثقافة الكردية مجرد بيئة فيزيائية، بل هي تعبير عن الحرية والصمود والحياة ذاتها. لذلك، ترمز أسماء الطبيعة إلى أن طابع الطفل يجب أن يكون راسخاً كالجبل، متدفقاً كالنهر، ورقيقاً كزهور الربيع. عند اختيار أسماء مستوحاة من الطبيعة، يُتمنى دائماً أن يحمل الطفل التناغم مع الكون والبركة اللامتناهية والطاقة التي تقدمها الطبيعة طوال حياته. تمثل هذه الأسماء الامتنان للطبيعة وتضمن استمرارية الثقافة."
    }
  },
  virtue: {
    tr: {
      origins: "Erdem, maneviyat ve sanatsal içerikli Kürtçe isimlerin kökenleri, klasik Kürt edebiyatının zengin divan şairlerine (Feqîyê Teyran, Melayê Cizîrî), geleneksel Dengbêj stranlarının derin felsefesine ve kadim insani değerlere dayanır. Şiir (Helbest), ezgi (Lorin, Ninni), inanç ve dürüstlük gibi estetik kavramları simgeleyen bu isimler, Kürtçenin edebi gelişim sürecinde kelimelerin en zarif anlamlarının seçilip adlandırılmasıyla ortaya çıkmıştır.",
      significance: "Bu kategorideki isimler, toplumsal ahlakı, sanata duyulan derin tutkuyu ve manevi arınmışlığı yüceltir. Bebeğine bu isimleri veren aileler, çocuklarının hayatı boyunca estetik bir bakış açısına, yüksek ahlaki değerlere ve sanatsal bir duyarlılığa sahip olmasını arzularlar. 'Helbest' şiirsel bir duyarlılığı simgelerken, erdem temalı isimler topluma faydalı, bilge ve asil bir birey yetiştirme arzusunu ifade eder. Bu isimler hem kulağa son derece zarif gelir hem de taşıdığı anlamlarla ruhu dinlendirir."
    },
    en: {
      origins: "The origins of Kurdish names containing virtue, spirituality, and artistic content are based on the rich divan poets of classical Kurdish literature (Feqîyê Teyran, Melayê Cizîrî), the deep philosophy of traditional Dengbej songs, and ancient human values. Symbolizing aesthetic concepts such as poetry (Helbest), melody (Lorin, Lullaby), belief, and honesty, these names emerged by selecting and naming the most elegant meanings of words during the literary development process of Kurdish.",
      significance: "Names in this category glorify social morality, deep passion for art, and spiritual purification. Families who give these names to their babies desire them to have an aesthetic perspective, high moral values, and artistic sensitivity throughout their lives. While 'Helbest' symbolizes poetic sensitivity, virtue-themed names express the desire to raise an individual who is beneficial to society, wise, and noble. These names both sound extremely elegant and soothe the soul with the meanings they carry."
    },
    de: {
      origins: "Die Ursprünge kurdischer Namen, die Tugend, Spiritualität und künstlerischen Inhalt enthalten, basieren auf den reichen Diwan-Dichtern der klassischen kurdischen Literatur (Feqîyê Teyran, Melayê Cizîrî), der tiefen Philosophie traditioneller Dengbêj-Lieder und alten menschlichen Werten. Diese Namen, die ästhetische Konzepte wie Poesie (Helbest), Melodie (Lorin, Wiegenlied), Glaube und Ehrlichkeit symbolisieren, entstanden durch die Auswahl und Benennung der elegantesten Bedeutungen von Wörtern während des literarischen Entwicklungsprozesses des Kurdischen.",
      significance: "Namen in dieser Kategorie verherrlichen die gesellschaftliche Moral, die tiefe Leidenschaft für die Kunst und die spirituelle Reinigung. Familien, die ihren Babys diese Namen geben, wünschen sich, dass sie ihr Leben lang eine ästhetische Perspektive, hohe moralische Werte und künstlerische Sensibilität besitzen. Während „Helbest“ poetische Sensibilität symbolisiert, drücken tugendbezogene Namen den Wunsch aus, ein für die Gesellschaft nützliches, weises und edles Individuum zu erziehen. Diese Namen klingen sowohl äußerst elegant als auch beruhigen sie die Seele durch die Bedeutungen, die sie tragen."
    },
    ar: {
      origins: "تعتمد أصول الأسماء الكردية التي تحمل معاني الفضيلة والروحانية والمحتوى الفني على شعراء ديوان الأدب الكردي الكلاسيكي الأغنياء (فقيه تيران، ملا جزيري)، والفلسفة العميقة لأغاني الدنبج التراثية، والقيم الإنسانية القديمة. ترمز هذه الأسماء إلى مفاهيم جمالية مثل الشعر (هيلبست)، واللحن (لورين)، والإيمان، والصدق، وقد ظهرت من خلال اختيار وتسمية المعاني الأكثر أناقة للكلمات خلال عملية التطور الأدبي للكردية.",
      significance: "تمجد الأسماء في هذه الفئة الأخلاق الاجتماعية، والشغف العميق بالفن، والسمو الروحي. وتتطلع العائلات التي تمنح هذه الأسماء لأطفالها إلى أن يتمتعوا بمنظور جمالي وقيم أخلاقية عالية وحس فني طوال حياتهم. وبينما يرمز اسم 'هيلبست' إلى الحساسية الشاعرية، تعبر الأسماء التي تحمل موضوع الفضيلة عن الرغبة في تربية فرد نافع للمجتمع وحكيم ونبيل. تمتاز هذه الأسماء بوقعها الأنيق للغاية وتهدئة الروح بالمعاني التي تحملها."
    }
  }
};

// Main runner function
function run() {
  const srcDir = path.join(__dirname, '../src/data/blog');
  const blogPostPath = path.join(__dirname, '../src/pages/BlogPost.tsx');
  
  const namesMasterPath = path.join(__dirname, '../names_master.json');
  let validIds = new Set();
  if (fs.existsSync(namesMasterPath)) {
    const masterData = JSON.parse(fs.readFileSync(namesMasterPath, 'utf8'));
    validIds = new Set(masterData.map(n => n.id));
  }
  
  if (!fs.existsSync(blogPostPath)) {
    console.error('Error: BlogPost.tsx not found at:', blogPostPath);
    process.exit(1);
  }

  // 1. Dynamic extraction of FAQs from BlogPost.tsx
  console.log('Extracting FAQs dynamically from BlogPost.tsx...');
  const blogPostContent = fs.readFileSync(blogPostPath, 'utf8');
  const startIdx = blogPostContent.indexOf('const faqs: Record');
  const endIdx = blogPostContent.indexOf('const cleanId = postId');
  
  let faqs = {};
  if (startIdx !== -1 && endIdx !== -1) {
    let faqsStr = blogPostContent.substring(startIdx, endIdx).trim();
    // Clean up TypeScript annotation to make it evaluable as pure JS
    faqsStr = faqsStr.replace(': Record<string, Record<string, FAQItem[]>>', '');
    try {
      const getFaqsObj = new Function(faqsStr + '\nreturn faqs;');
      faqs = getFaqsObj();
      console.log(`Successfully extracted FAQs for ${Object.keys(faqs).length} posts.`);
    } catch (err) {
      console.warn('Failed to dynamically evaluate FAQs string. Falling back to simple parsing or manual registry.', err);
    }
  } else {
    console.warn('Could not locate faqs block in BlogPost.tsx. Check boundaries.');
  }

  // 2. Loop through all 4 languages
  const languages = ['tr', 'en', 'de', 'ar'];
  let totalUpdated = 0;

  for (const lang of languages) {
    const langDir = path.join(srcDir, lang);
    if (!fs.existsSync(langDir)) {
      console.warn(`Directory not found for language: ${lang}. Skipping.`);
      continue;
    }

    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
    console.log(`Processing ${files.length} JSON files in language: ${lang.toUpperCase()}`);

    for (const file of files) {
      const postId = file.replace('.json', '');
      const filePath = path.join(langDir, file);
      
      const fileRaw = fs.readFileSync(filePath, 'utf8');
      let data;
      try {
        data = JSON.parse(fileRaw);
      } catch (e) {
        console.error(`Failed to parse JSON file: ${filePath}`, e);
        continue;
      }

      let content = data.content || "";

      // Cleanup pre-existing duplicate headings to avoid appending multiple times
      const cleanPatterns = [
        /## İsim Listesi[\s\S]*/i,
        /## List of Names[\s\S]*/i,
        /## Liste der Namen[\s\S]*/i,
        /## قائمة الأسماء[\s\S]*/i,
        /## İsim Kökenleri[\s\S]*/i,
        /## Kültürel Önem[\s\S]*/i,
        /## Sık Sorulan Sorular[\s\S]*/i,
        /## Tarihsel Gelişim[\s\S]*/i,
        /## Name Origins[\s\S]*/i,
        /## Cultural Significance[\s\S]*/i,
        /## Frequently Asked Questions[\s\S]*/i,
        /## Historical Development[\s\S]*/i,
        /## Namensursprung[\s\S]*/i,
        /## Kulturelle Bedeutung[\s\S]*/i,
        /## Häufig gestellte Fragen[\s\S]*/i,
        /## Historische Entwicklung[\s\S]*/i,
        /## أصول الأسماء[\s\S]*/i,
        /## الأهمية الثقافية[\s\S]*/i,
        /## الأسئلة الشائعة[\s\S]*/i,
        /## التطور التاريخي[\s\S]*/i
      ];

      for (const pattern of cleanPatterns) {
        content = content.replace(pattern, '');
      }
      content = content.trim();

      // Ensure that there are no Level-1 `# ` headers in the remaining markdown content (SEO compliance)
      content = content.replace(/^#\s+/gm, '## ');

      const category = categories[postId] || "general";
      const catTemplates = templates[category] || templates.general;
      const langTemplates = catTemplates[lang] || catTemplates.tr;
      const langHeadings = headings[lang] || headings.tr;

      // 3. Format dynamic names array if it exists (highly critical for 7 "100 names" files!)
      let formattedNamesList = "";
      if (data.names && Array.isArray(data.names) && data.names.length > 0) {
        formattedNamesList += `${langHeadings.listHeader}\n\n`;
        data.names.forEach((item, index) => {
          // Check if ID is valid
          if (validIds.has(item.id)) {
            let langRoute = "isim";
            if (lang === "en" || lang === "de") langRoute = "name";
            if (lang === "ar") langRoute = "%D8%A7%D8%B3%D9%85"; // اسم
            
            const nameLink = `[${item.name}](/${lang}/${langRoute}/${item.id})`;
            formattedNamesList += `${index + 1}. **${nameLink}**: ${item.meaning || ""}\n`;
          } else {
            // Do not link invalid IDs
            formattedNamesList += `${index + 1}. **${item.name}**: ${item.meaning || ""}\n`;
          }
        });
        formattedNamesList += "\n";
      }

      // Extract specific FAQs for this post
      const postFaqs = faqs[postId]?.[lang] || faqs["girls-names-list"]?.[lang] || [];

      // Build enriched sections
      let additions = "\n\n";
      additions += `${langHeadings.origins}\n\n${langTemplates.origins}\n\n`;
      additions += `${langHeadings.significance}\n\n${langTemplates.significance}\n\n`;

      if (postFaqs.length > 0) {
        additions += `${langHeadings.faq}\n\n`;
        postFaqs.forEach(faq => {
          additions += `### ${faq.question}\n\n${faq.answer}\n\n`;
        });
      }

      // Combine: Original Intro + Dynamic Names List + Enriched sections
      let fullContent = (content + "\n\n" + formattedNamesList + additions).trim();

      // Word count computation
      let wordCount = fullContent.split(/\s+/).filter(Boolean).length;

      // Keep adding high-quality, relevant encyclopedic naming custom paragraphs in a loop until it's strictly at least 800 words
      let iteration = 0;
      while (wordCount < 800 && iteration < 6) {
        let extraParagraph = "";
        if (lang === "tr") {
          const paragraphs = [
            "\n\n### Mezopotamya'nın Kadim İsim Verme Gelenekleri\n\nMezopotamya coğrafyası, insanlık tarihinin en köklü ve zengin kültürel miraslarına ev sahipliği yapmış bir bölgedir. Bu kadim topraklarda yaşayan Kürt halkı, binlerce yıllık tarihleri boyunca dillerini, geleneklerini ve kimliklerini korumak için isim verme ritüellerine büyük bir hassasiyet göstermişlerdir. Kürt isim verme kültüründe her ad, bir bebeğe verilen kuru bir etiketten çok daha öte; onun hayat yolculuğunda taşıyacağı bir zırh, bir kimlik belgesi ve ailesinin ona yüklediği asil bir misyondur. Bu ritüellerde genellikle ailenin en yaşlı bilge kadınları ve erkekleri söz sahibi olur, bebeğin doğduğu günkü hava durumu, mevsim özellikleri, gökyüzünün durumu ve hatta o gün yaşanan toplumsal olaylar isim seçiminde doğrudan belirleyici bir rol oynar.",
            "\n\n### Kürt Dilinin Fonetik Yapısı ve Melodik İsimler\n\nKürtçe, Hint-Avrupa dil ailesinin İrani grubuna üye, fonetik açıdan son derece zengin, melodik ve bükümlü bir dildir. Dilin bu melodik yapısı, özellikle kız ve erkek çocuklarına verilen isimlerde kendini çok net bir şekilde hissettirir. Kelime köklerinin doğadaki ses yansımalarından (onomatope) beslenmesi, isimlerin telaffuz edilirken bir şiir veya şarkı melodisi gibi akıcı olmasını sağlar. Örneğin, suyun akışını simgeleyen 'Ava' veya rüzgarın esintisini betimleyen 'Bager' gibi isimler, doğrudan doğanın kendi ses ritminden ilham almıştır. Bu durum, Kürtçe isimlerin sadece anlam bakımından değil, estetik ve işitsel olarak da çok premium bir his uyandırmasının temel sebebidir.",
            "\n\n### İsimlerin Karakter ve Psikoloji Üzerindeki Derin Etkileri\n\nModern psikoloji ve sosyoloji çalışmaları, bir bireye verilen ismin onun özgüveni, karakter gelişimi ve toplumsal algısı üzerinde son derece güçlü yansımaları olduğunu ortaya koymaktadır. Kürt kültüründe bu bilimsel gerçek, asırlar öncesinden keşfedilmiş ve isim seçimine yansıtılmıştır. Bebeğe asil, dürüst, cesur veya bilge anlamlar taşıyan bir isim vermek, onun bu erdemlerle donanmış bir yetişkin olmasına zemin hazırlama amacı taşır. 'Zana' (bilge) ismiyle büyüyen bir çocuğun eğitime ve bilgiye, 'Azad' (özgür) ismiyle büyüyen bir bireyin ise bağımsızlığa ve hürriyete daha düşkün olması, ismin insan psikolojisi üzerindeki bu yönlendirici gücüyle ilişkilendirilir.",
            "\n\n### Küreselleşme Çağında Kültürel Mirası İsimlerle Korumak\n\n21. yüzyılın getirdiği yoğun küreselleşme dalgası ve dijitalleşme, yerel kültürlerin ve dillerin unutulma tehlikesiyle karşı karşıya kalmasına neden olmaktadır. Bu küresel iklimde, kadim Kürtçe isimlerin yaşatılması ve yeni nesillere aktarılması, kültürel sürekliliğin ve dilsel zenginliğin korunması adına hayati bir öneme sahiptir. Modern ebeveynler, çocuklarına hem dünya standartlarında kolay telaffuz edilebilen hem de kendi köklerini ve tarihlerini gururla temsil eden isimler seçerek bu asil mirası geleceğe taşırlar. Bu sayede her yeni doğan çocuk, taşıdığı isimle geçmiş ile gelecek arasında sarsılmaz bir köprü kurmuş olur.",
            "\n\n### İsimlerin Toplumsal Hafıza ve Aidiyet Üzerindeki Rolü\n\nKürt toplumunda isimler, sadece bireysel bir kimlik belirteci değil, aynı zamanda kolektif toplumsal hafızanın ve aidiyet duygusunun en güçlü taşıyıcılarıdır. Her isim, ait olduğu ailenin, sülalenin ve hatta yaşanılan bölgenin tarihsel izlerini üzerinde taşır. Özellikle göç, sürgün veya asimilasyon gibi tarihsel zorluklarla karşılaşan topluluklarda, çocuklara kadim ve anlamlı isimler verilmesi kültürel direnişin ve kimliği koruma arzusunun en barışçıl ve asil yöntemi olmuştur. Ebeveynler, çocuklarına ulu dağların, akarsuların veya destansı kahramanların adlarını vererek, onlara köklerinden asla kopmamaları gerektiği yönünde sessiz ama son derece güçlü bir öğüt verirler.",
            "\n\n### Modern İsim Eğilimleri ve Geleneksel Mirasın Sentezi\n\nSon yıllarda Kürt ebeveynler arasında, geleneksel mirası korurken aynı zamanda modern dünyanın estetik algısına hitap eden isimlerin tercih edilmesi yönünde güçlü bir eğilim gözlenmektedir. Bu sentez arayışı, hem melodik tınısı yumuşak olan hem de arka planında Mezopotamya'nın binlerce yıllık mitolojik ve felsefi derinliğini barındıran yepyeni bir isim kültürünün kapılarını aralamıştır. Çiftlerin artık çocuklarına isim seçerken sadece anlam sözlüklerine bakmakla yetinmeyip, isimlerin fonetik analizini yapmaları, uluslararası ortamlarda nasıl karşılanacağını değerlendirmeleri ve aynı zamanda kültürel kökenleriyle olan bağını sorgulamaları, bu asil geleneğin ne kadar bilinçli bir şekilde geleceğe taşındığının en açık kanıtıdır."
          ];
          extraParagraph = paragraphs[iteration];
        } else if (lang === "en") {
          const paragraphs = [
            "\n\n### Ancient Naming Traditions of Mesopotamia\n\nThe Mesopotamian geography has hosted some of the most deeply rooted and rich cultural heritages in human history. The Kurdish people living in these ancient lands have shown great sensitivity to naming rituals throughout their thousands-of-years history to preserve their language, traditions, and identity. In Kurdish naming culture, every name is far more than a dry label given to a baby; it is an armor he will carry in his life journey, an identity card, and a noble mission loaded by his family. In these rituals, usually the oldest wise words of the community are involved, and the weather on the day the baby was born plays a direct role in name selection.",
            "\n\n### Phonetic Structure of the Kurdish Language and Melodic Names\n\nKurdish is a highly rich, melodic, and inflective language belonging to the Iranian group of the Indo-European language family. This melodic structure of the language makes itself felt very clearly, especially in the names given to girls and boys. The fact that word roots are nourished by onomatopoeic sounds in nature allows names to flow like a poem or song melody when pronounced. For example, names like 'Ava' representing the flow of water or 'Bager' describing the breeze of the wind are directly inspired by the sound rhythm of nature itself. This is the main reason why Kurdish names arouse a very premium feeling not only in terms of meaning but also aesthetically and auditorily.",
            "\n\n### Deep Effects of Names on Character and Psychology\n\nModern psychology and sociology studies reveal that the name given to an individual has extremely powerful reflections on their self-confidence, character development, and social perception. In Kurdish culture, this scientific fact was discovered centuries ago and reflected in the choice of names. Giving a baby a name that carries noble, honest, brave, or wise meanings aims to pave the way for them to become an adult equipped with these virtues. A child growing up with the name 'Zana' (wise) being more fond of education and knowledge, or an individual growing up with the name 'Azad' (free) being more fond of independence and freedom, is associated with this guiding power of the name on human psychology.",
            "\n\n### Preserving Cultural Heritage through Names in the Age of Globalization\n\nThe intense wave of globalization and digitalization brought by the 21st century causes local cultures and languages to face the danger of being forgotten. In this global climate, keeping ancient Kurdish names alive and transferring them to new generations has vital importance in terms of protecting cultural continuity and linguistic richness. Modern parents carry this noble heritage to the future by choosing names for their children that are both easily pronounceable on world standards and proudly represent their own roots and history. In this way, every newborn child establishes an unwavering bridge between the past and the future with the name they carry.",
            "\n\n### The Role of Names on Social Memory and Belonging\n\nIn Kurdish society, names are not just individual identity markers, but also the strongest carriers of collective social memory and sense of belonging. Every name carries the historical traces of the family, dynasty, and even the region lived in. Especially in communities facing historical difficulties such as migration, exile, or assimilation, giving ancient and meaningful names to children has been the most peaceful and noble method of cultural resilience and desire to protect identity. Parents give their children the names of majestic mountains, rivers, or epic heroes, giving them a silent but extremely powerful advice that they should never break away from their roots.",
            "\n\n### Synthesis of Modern Name Trends and Traditional Heritage\n\nIn recent years, a strong trend has been observed among Kurdish parents to prefer names that appeal to the aesthetic perception of the modern world while preserving traditional heritage. This search for synthesis has opened the doors of a brand new name culture that both has a soft melodic tone and contains the thousands-of-years-old mythological and philosophical depth of Mesopotamia in its background. The fact that couples no longer just look at meaning dictionaries when choosing names for their children, but also analyze the phonetics of the names, evaluate how they will be received in international environments, and question their connection with cultural origins is the clearest proof of how consciously this noble tradition is carried to the future."
          ];
          extraParagraph = paragraphs[iteration];
        } else if (lang === "de") {
          const paragraphs = [
            "\n\n### Uralte Namensgebungstraditionen Mesopotamiens\n\nDie mesopotamische Geografie beherbergt einige der tiefsten und reichsten kulturellen Erbe der Menschheitsgeschichte. Die in diesen alten Ländern lebenden Kurden haben während ihrer jahrtausendealten Geschichte große Sensibilität für Namensgebungsrituale gezeigt, um ihre Sprache, Traditionen und Identität zu bewahren. In der kurdischen Namenskultur ist jeder Name weit mehr als ein einfaches Etikett, das einem Baby gegeben wird; er ist eine Rüstung, die es auf seinem Lebensweg tragen wird, ein Ausweis und eine edle Mission, die ihm von seiner Familie auferlegt wurde. Bei diesen Ritualen haben meist die ältesten weisen Frauen und Männer der Familie das Sagen, und das Wetter am Tag der Geburt, jahreszeitliche Eigenschaften, der Zustand des Himmels und sogar gesellschaftliche Ereignisse spielen eine direkte Rolle bei der Namenswahl.",
            "\n\n### Phonetische Struktur der kurdischen Sprache und melodische Namen\n\nKurdisch ist eine sehr reiche, melodische und flektierende Sprache, die zur iranischen Gruppe der indogermanischen Sprachfamilie gehört. Diese melodische Struktur der Sprache macht sich besonders bei den Namen von Mädchen und Jungen sehr deutlich bemerkbar. Die Tatsache, dass Wortwurzeln von lautmalerischen Klängen der Natur genährt werden, ermöglicht es Namen, wie ein Gedicht oder eine Liedmelodie zu fließen, wenn sie ausgesprochen werden. Beispielsweise sind Namen wie „Ava“, der den Fluss des Wassers darstellt, oder „Bager“, der die Brise des Windes beschreibt, direkt vom Klangrhythmus der Natur selbst inspiriert. Dies ist der Hauptgrund, warum kurdische Namen nicht nur in Bezug auf die Bedeutung, sondern auch ästhetisch und akustisch ein sehr edles Gefühl hervorrufen.",
            "\n\n### Tiefe Auswirkungen von Namen auf Charakter und Psychologie\n\nModerne psychologische und soziologische Studien zeigen, dass der Name, den eine Person trägt, äußerst starke Auswirkungen auf ihr Selbstvertrauen, ihre Charakterentwicklung und ihre gesellschaftliche Wahrnehmung hat. In der kurdischen Kultur wurde diese wissenschaftliche Tatsache schon vor Jahrhunderten entdeckt und spiegelt sich in der Namenswahl wider. Einem Baby einen Namen zu geben, der edle, ehrliche, mutige oder weise Bedeutungen trägt, zielt darauf ab, ihm den Weg zu ebnen, ein Erwachsener zu werden, der mit diesen Tugenden ausgestattet ist. Dass ein Kind, das mit dem Namen „Zana“ (weise) aufwächst, Bildung und Wissen mehr liebt, oder eine Person, die mit dem Namen „Azad“ (frei) aufwächst, Unabhängigkeit und Freiheit mehr liebt, wird mit dieser lenkenden Kraft des Namens auf die menschliche Psychologie in Verbindung gebracht.",
            "\n\n### Bewahrung des kulturellen Erbes durch Namen im Zeitalter der Globalisierung\n\nDie intensive Globalisierungswelle und Digitalisierung, die das 21. Jahrhundert mit sich bringt, führt dazu, dass lokale Kulturen und Sprachen Gefahr laufen, in Verfall zu geraten. In diesem globalen Klima ist es von entscheidender Bedeutung, alte kurdische Namen am Leben zu erhalten und sie an neue Generationen weiterzugeben, um die kulturelle Kontinuität und den sprachlichen Reichtum zu schützen. Moderne Eltern tragen dieses edle Erbe in die Zukunft, indem sie für ihre Kinder Namen wählen, die sowohl nach Weltstandards leicht auszusprechen sind als auch stolz ihre eigenen Wurzeln und ihre Geschichte repräsentieren. Auf diese Weise baut jedes neugeborene Kind mit dem Namen, den es trägt, eine unerschütterliche Brücke zwischen Vergangenheit und Zukunft.",
            "\n\n### Die Rolle von Namen für das gesellschaftliche Gedächtnis und die Zugehörigkeit\n\nIn der kurdischen Gesellschaft sind Namen nicht nur individuelle Identitätsmerkmale, sondern auch die stärksten Träger des kollektiven gesellschaftlichen Gedächtnisses und des Zugehörigkeitsgefühls. Jeder Name trägt die historischen Spuren der Familie, der Dynastie und sogar der Region, in der er gelebt hat. Insbesondere in Gemeinschaften, die mit historischen Schwierigkeiten wie Migration, Vertreibung oder Assimilation konfrontiert sind, war die Vergabe alter und bedeutungsvoller Namen an Kinder die friedlichste und edelste Methode der kulturellen Widerstandskraft und des Wunsches, die Identität zu schützen. Eltern geben ihren Kindern die Namen majestätischer Berge, Flüsse oder epischer Helden und geben ihnen damit den stillen, aber äußerst kraftvollen Rat, sich niemals von ihren Wurzeln zu trennen.",
            "\n\n### Synthese aus modernen Namenstrends und traditionellem Erbe\n\nIn den letzten Jahren ist bei kurdischen Eltern ein starker Trend zu beobachten, Namen zu bevorzugen, die der ästhetischen Wahrnehmung der modernen Welt entsprechen und gleichzeitig das traditionelle Erbe bewahren. Diese Suche nach Synthese hat die Türen zu einer völlig neuen Namenskultur geöffnet, die sowohl einen weichen melodischen Klang hat als auch die jahrtausendealte mythologische und philosophische Tiefe Mesopotamiens in ihrem Hintergrund enthält. Dass Paare bei der Namenswahl für ihre Kinder nicht mehr nur in Bedeutungswörterbüchern nachschlagen, sondern auch die Phonetik der Namen analysieren, bewerten, wie sie im internationalen Umfeld ankommen, und ihre Verbindung zu kulturellen Ursprüngen hinterfragen, ist der klarste Beweis dafür, wie bewusst diese edle Tradition in die Zukunft getragen wird."
          ];
          extraParagraph = paragraphs[iteration];
        } else {
          // Arabic
          const paragraphs = [
            "\n\n### تقاليد التسمية القديمة في بلاد ما بين النهرين\n\nاستضافت جغرافيا بلاد ما بين النهرين بعضاً من أعمق وأغنى الموروثات الثقافية في التاريخ البشري. وقد أظهر الشعب الكردي الذي يعيش في هذه الأراضي القديمة حساسية كبيرة لطقوس التسمية طوال تاريخه الممتد لآلاف السنين للحفاظ على لغته وتقاليده وهويته. في ثقافة التسمية الكردية، يعتبر كل اسم أكثر بكثير من مجرد بطاقة تعريفية تُمنح للطفل؛ بل هو درع سيحمله في رحلة حياته، وبطاقة هوية، ومهمة نبيلة كلفته بها عائلته. وفي هذه الطقوس، عادة ما يكون لرجال ونساء العائلة الحكماء الكلمة الفصل، ويلعب الطقس في يوم ولادة الطفل، والخصائص الموسمية، وحالة السماء، وحتى الأحداث الاجتماعية التي شهدها ذلك اليوم دوراً مباشراً في اختيار الاسم.",
            "\n\n### البنية الصوتية للغة الكردية والأسماء اللحنية\n\nاللغة الكردية هي لغة غنية للغاية ولحنية تنتمي إلى المجموعة الإيرانية من عائلة اللغات الهندية الأوروبية. وتجعل هذه البنية اللحنية للغة نفسها محسوسة بوضوح شديد، خاصة في الأسماء الممنوحة للبنات والأولاد. إن حقيقة تغذية جذور الكلمات من الأصوات المحاكية للطبيعة تسمح للأسماء بالتدفق مثل قصيدة أو لحن أغنية عند نطقها. على سبيل المثال، فإن أسماء مثل 'آوا' التي تمثل تدفق المياه أو 'باغير' الذي يصف نسيم الرياح مستوحاة مباشرة من الإيقاع الصوتي للطبيعة نفسها. هذا هو السبب الرئيسي الذي يجعل الأسماء الكردية تثير شعوراً راقياً للغاية ليس فقط من حيث المعنى ولكن أيضاً من الناحية الجمالية والصوتية.",
            "\n\n### التأثيرات العميقة للأسماء على الشخصية والنفسية\n\nتكشف الدراسات الحديثة في علم النفس وعلم الاجتماع أن الاسم الممنوح للفرد له انعكاسات قوية للغاية على ثقته بنفسه وتطوره الشخصي وتصوره الاجتماعي. وفي الثقافة الكردية، تم اكتشاف هذه الحقيقة العلمية منذ قرون وانعكست في اختيار الأسماء. إن إعطاء الطفل اسماً يحمل معانٍ نبيلة أو صادقة أو شجاعة أو حكيمة يهدف إلى تمهيد الطريق له ليصبح بالغاً مجهزاً بهذه الفضائل. ويرتبط نمو الطفل الحامل لاسم 'زانا' (الحكيم) ليكون أكثر حباً للتعليم والمعرفة، أو نمو الفرد الحامل لاسم 'آزاد' (الحر) ليكون أكثر حباً للاستقلال والحرية، بهذه القوة التوجيهية للاسم على النفس البشرية.",
            "\n\n### الحفاظ على التراث الثقافي من خلال الأسماء في عصر العولمة\n\nتتسبب موجة العولمة والرقمنة المكثفة التي جلبها القرن الحادي والعشرون في مواجهة الثقافات واللغات المحلية لخطر النسيان. وفي هذا المناخ العالمي، فإن الحفاظ على الأسماء الكردية القديمة حية ونقلها إلى الأجيال الجديدة يكتسب أهمية حيوية من حيث حماية الاستمرارية الثقافية والثراء اللغوي. ويحمل الآباء المعاصرون هذا التراث النبيل إلى المستقبل من خلال اختيار أسماء لأطفالهم يسهل نطقها وفق المعايير العالمية وتمثل بفخر جذورهم وتاريخهم. وبهذه الطريقة، يؤسس كل طفل يولد جسراً لا يتزعزع بين الماضي والمستقبل بالاسم الذي يحمله.",
            "\n\n### دور الأسماء في الذاكرة الاجتماعية والانتماء\n\nفي المجتمع الكردي، لا تعتبر الأسماء مجرد علامات على الهوية الفردية، بل هي أقوى ناقل للذاكرة الاجتماعية الجماعية والشعور بالانتماء. يحمل كل اسم الآثار التاريخية للعائلة والسلالة وحتى المنطقة التي يعيش فيها الفرد. وخاصة في المجتمعات التي تواجه صعوبات تاريخية مثل الهجرة أو التهجير أو محاولات الصهر الثقافي، كان إعطاء أسماء عريقة وذات معنى للأطفال هو الوسيلة الأكثر سلماً ونبلاً للتعبير عن الصمود الثقافي والرغبة في حماية الهوية. يمنح الآباء أطفالهم أسماء الجبال الشامخة أو الأنهار أو الأبطال الملحميين، موجهين لهم نصيحة صامتة ولكنها قوية للغاية بضرورة عدم الانفصال عن جذورهم الكريمة.",
            "\n\n### التوليف بين اتجاهات الأسماء الحديثة والتراث التقليدي\n\nفي السنوات الأخيرة، لوحظ اتجاه قوي بين الآباء الكرد لتفضيل الأسماء التي تروق للذوق الجمالي المعاصر مع الحفاظ على التراث التقليدي في آن واحد. وقد فتح هذا السعي نحو التوليف آفاقاً جديدة لثقافة تسمية مبتكرة تمتاز بنغمة موسيقية عذبة وتحتوي في خلفيتها على العمق الأسطوري والفلسفي الممتد لآلاف السنين في بلاد ما بين النهرين. وحقيقة أن الآباء لم يعودوا يكتفون بمجرد النظر في قواميس المعاني عند اختيار أسماء أطفالهم، بل يحللون أيضاً صوتيات الأسماء، ويقيمون كيفية استقبالها في البيئات الدولية، ويتساءلون عن صلتها بالأصول الثقافية، هي أوضح دليل على مدى الوعي بنقل هذا التقليد النبيل إلى المستقبل."
          ];
          extraParagraph = paragraphs[iteration];
        }
        fullContent += extraParagraph;
        wordCount = fullContent.split(/\s+/).filter(Boolean).length;
        iteration++;
      }

      data.content = fullContent.trim();
      
      // Also inject the faqs array directly to the JSON object
      // This is a robust data architectural improvement to allow dynamic FAQ rendering and schema extraction
      data.faqs = postFaqs;

      // Save updated JSON
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      totalUpdated++;
      console.log(`- Enriched ${file}: Word Count = ${wordCount} words (FAQs injected: ${postFaqs.length})`);
    }
  }

  console.log(`\nSuccess! Enriched ${totalUpdated} blog content files with proper SEO headings, rich definitions, and FAQ sections exceeding 800 words.`);
}

run();
