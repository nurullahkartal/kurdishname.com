export interface BlogPostMeta {
  id: string; // Core identifier, e.g. "girls-names-list"
  date: string;
  author: string;
  slugs: Record<string, string>; // Localized slugs for SEO
  tags: Record<string, string[]>; // Localized tags
  titles: Record<string, string>; // Localized titles for instant listing
  descriptions: Record<string, string>; // Localized descriptions for instant listing
  contentKey?: string; // Optional key for loading content from locales
}

export const blogPostsRegistry: BlogPostMeta[] = [
  {
    "id": "kurt-kulturunde-isimlerin-onemi-ve-etimolojisi",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurt-kulturunde-isimlerin-onemi-ve-etimolojisi",
      "en": "the-importance-and-etymology-of-names-in-kurdish-culture",
      "de": "die-bedeutung-und-etymologie-von-namen-in-der-kurdischen-kultur",
      "ar": "اهمية-الاسماء-واصلها-اللغوي-في-الثقافة-الكردية"
    },
    "tags": {
      "tr": ["Kültür", "Etimoloji", "Kürtçe İsimler", "Tarih", "Kürt Kültürü"],
      "en": ["Culture", "Etymology", "Kurdish Names", "History", "Kurdish Culture"],
      "de": ["Kultur", "Etymologie", "Kurdische Namen", "Geschichte", "Kurdische Kultur"],
      "ar": ["ثقافة", "علم الاشتقاق", "أسماء كردية", "تاريخ", "ثقافة كردية"]
    },
    "titles": {
      "tr": "Kürt Kültüründe İsimlerin Önemi ve Etimolojisi",
      "en": "The Importance and Etymology of Names in Kurdish Culture",
      "de": "Die Bedeutung und Etymologie von Namen in der kurdischen Kultur",
      "ar": "أهمية الأسماء وأصلها اللغوي في الثقافة الكردية"
    },
    "descriptions": {
      "tr": "İsimlerin Kürt tarihindeki ve kültüründeki yeri, anlamları, kökenleri ve etimolojik derinlikleri.",
      "en": "The place, meanings, origins, and etymological depths of names in Kurdish history and culture.",
      "de": "Der Platz, die Bedeutungen, die Ursprünge und die etymologischen Tiefen von Namen in der kurdischen Geschichte und Kultur.",
      "ar": "مكانة الأسماء في التاريخ والثقافة الكردية، معانيها، أصولها، وأعماقها اللغوية."
    }
  },
  {
    "id": "kurtce-sifali-bitki-isimleri-ve-anlamlari",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-sifali-bitki-isimleri-ve-anlamlari",
      "en": "kurdish-medicinal-plant-names-and-meanings",
      "de": "kurdische-heilpflanzennamen-und-bedeutungen",
      "ar": "اسماء-النباتات-الطبية-الكردية-ومعانيها"
    },
    "tags": {
      "tr": ["Şifalı Bitkiler", "Kürtçe İsimler", "Kız İsimleri", "Erkek İsimleri", "Doğa"],
      "en": ["Medicinal Plants", "Kurdish Names", "Girl Names", "Boy Names", "Nature"],
      "de": ["Heilpflanzen", "Kurdische Namen", "Mädchennamen", "Jungennamen", "Natur"],
      "ar": ["النباتات الطبية", "أسماء كردية", "أسماء بنات", "أسماء أولاد", "طبيعة"]
    },
    "titles": {
      "tr": "Kürtçe Şifalı Bitki İsimleri ve Anlamları",
      "en": "Kurdish Medicinal Plant Names and Meanings",
      "de": "Kurdische Heilpflanzennamen und ihre Bedeutungen",
      "ar": "أسماء النباتات الطبية الكردية ومعانيها"
    },
    "descriptions": {
      "tr": "Mezopotamya doğasının şifalı bitkilerinden ilham alan Kürtçe isimler ve derin anlamları.",
      "en": "Kurdish names inspired by the medicinal plants of Mesopotamian nature and their deep meanings.",
      "de": "Kurdische Namen, die von den Heilpflanzen der mesopotamischen Natur inspiriert sind, und ihre tiefen Bedeutungen.",
      "ar": "أسماء كردية مستوحاة من النباتات الطبية في طبيعة بلاد ما بين النهرين ومعانيها العميقة."
    }
  },
  {
    "id": "duyulmamis-modern-kurtce-erkek-isimleri-2026",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "duyulmamis-modern-kurtce-erkek-isimleri-2026",
      "en": "unique-modern-kurdish-boy-names-2026",
      "de": "einzigartige-moderne-kurdische-jungennamen-2026",
      "ar": "اسماء-ذكور-كردية-حديثة-ونادرة-2026"
    },
    "tags": {
      "tr": ["Modern İsimler", "Kürtçe Erkek İsimleri", "Nadir İsimler", "2026 İsimleri"],
      "en": ["Modern Names", "Kurdish Boy Names", "Rare Names", "2026 Names"],
      "de": ["Moderne Namen", "Kurdische Jungennamen", "Seltene Namen", "Namen 2026"],
      "ar": ["أسماء حديثة", "أسماء ذكور كردية", "أسماء نادرة", "أسماء 2026"]
    },
    "titles": {
      "tr": "Duyulmamış Modern Kürtçe Erkek İsimleri (2026 Koleksiyonu)",
      "en": "Unique Modern Kurdish Boy Names (2026 Collection)",
      "de": "Einzigartige moderne kurdische Jungennamen (Kollektion 2026)",
      "ar": "أسماء ذكور كردية حديثة ونادرة (مجموعة 2026)"
    },
    "descriptions": {
      "tr": "2026 yılının en nadir, duyulmamış ve modern Kürtçe erkek bebek isimleri.",
      "en": "The rarest, unheard, and modern Kurdish baby boy names of 2026.",
      "de": "Die seltensten, unerhörtesten und modernsten kurdischen Baby-Jungennamen des Jahres 2026.",
      "ar": "أندر وأحدث أسماء الأطفال الذكور الكردية لعام 2026."
    }
  },
  {
    "id": "kurtce-isimler-anlamlari-ve-kullanim-alanlari",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-isimler-anlamlari-ve-kullanim-alanlari",
      "en": "kurdish-names-meanings-and-usage-areas",
      "de": "kurdische-namen-bedeutungen-und-verwendungsbereiche",
      "ar": "اسماء-كردية-معانيها-ومجالات-استخدامها"
    },
    "tags": {
      "tr": ["Kürtçe İsimler", "Kürtçe Kız İsimleri", "Kürtçe Erkek İsimleri", "Kültürel Miras"],
      "en": ["Kurdish Names", "Kurdish Girl Names", "Kurdish Boy Names", "Cultural Heritage"],
      "de": ["Kurdische Namen", "Kurdische Mädchennamen", "Kurdische Jungennamen", "Kulturelles Erbe"],
      "ar": ["أسماء كردية", "أسماء بنات كردية", "أسماء أولاد كردية", "التراث الثقافي"]
    },
    "titles": {
      "tr": "Kürtçe İsimler: Anlamları ve Kullanım Alanları",
      "en": "Kurdish Names: Meanings and Usage Areas",
      "de": "Kurdische Namen: Bedeutungen und Verwendungsbereiche",
      "ar": "الأسماء الكردية: معانيها ومجالات استخدامها"
    },
    "descriptions": {
      "tr": "Kürtçe isimlerin tarihçesi, kökenleri, anlamları ve popüler Kürtçe kız ile erkek isimleri hakkında kapsamlı bir inceleme.",
      "en": "A comprehensive review of the history, origins, meanings, and popular Kurdish girl and boy names.",
      "de": "Ein umfassender Überblick über die Geschichte, Herkunft, Bedeutungen und beliebten kurdischen Mädchen- und Jungennamen.",
      "ar": "مراجعة شاملة لتاريخ وأصول ومعاني الأسماء الكردية للفتيات والفتيان بالإضافة إلى أشهرها."
    }
  },
  {
    "id": "modern-ve-populer-kurtce-isimler-ve-anlamlari",
    "date": "2026-07-01",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "modern-ve-populer-kurtce-isimler-ve-anlamlari",
      "en": "modern-and-popular-kurdish-names-and-meanings",
      "de": "moderne-und-beliebte-kurdische-namen-und-bedeutungen",
      "ar": "اسماء-كردية-حديثة-وشعبية-ومعانيها"
    },
    "tags": {
      "tr": ["Kürtçe İsimler", "Kürtçe Kız İsimleri", "Kürtçe Erkek İsimleri", "Modern İsimler"],
      "en": ["Kurdish Names", "Kurdish Girl Names", "Kurdish Boy Names", "Modern Names"],
      "de": ["Kurdische Namen", "Kurdische Mädchennamen", "Kurdische Jungennamen", "Moderne Namen"],
      "ar": ["أسماء كردية", "أسماء بنات كردية", "أسماء أولاد كردية", "أسماء حديثة"]
    },
    "titles": {
      "tr": "Modern ve Popüler Kürtçe İsimler ve Anlamları (Güncel Rehber)",
      "en": "Modern and Popular Kurdish Names and Meanings (Current Guide)",
      "de": "Moderne und beliebte kurdische Namen und Bedeutungen (Aktueller Leitfaden)",
      "ar": "أسماء كردية حديثة وشعبية ومعانيها (دليل محدث)"
    },
    "descriptions": {
      "tr": "Kürtçe isimler, kürtçe kız isimleri ve erkek isimleri arayanlar için modern, duyulmamış ve en popüler isim seçenekleri. Anlamları ve kökenleriyle tam liste.",
      "en": "Modern, unique, and the most popular Kurdish name options for those looking for Kurdish names, girl names, and boy names. Full list with meanings and origins.",
      "de": "Moderne, seltene und die beliebtesten kurdischen Namensoptionen für alle, die nach kurdischen Namen, Mädchennamen und Jungennamen suchen.",
      "ar": "خيارات أسماء كردية حديثة ونادرة وأكثرها شعبية للباحثين عن أسماء بنات وأولاد."
    }
  },
  {
    "id": "kurtce-isim-soru-cevap-rehberi-ava-ardil-ajwan-anlami",
    "date": "2026-07-01",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-isim-soru-cevap-rehberi-ava-ardil-ajwan-anlami",
      "en": "kurdish-names-q-a-guide-ava-ardil-ajwan-meaning",
      "de": "kurdische-namen-faq-ava-ardil-ajwan-bedeutung",
      "ar": "دليل-الاسئلة-والاجوبة-للاسماء-الكردية-افا-ارديل"
    },
    "tags": {
      "tr": ["Ava İsmi Kürtçe Mi", "Ardil Anlamı", "Kürtçe İsimler", "Soru Cevap"],
      "en": ["Ava Name Kurdish", "Ardil Meaning", "Kurdish Names", "Q&A"],
      "de": ["Ist Ava Kurdisch", "Ardil Bedeutung", "Kurdische Namen", "FAQ"],
      "ar": ["هل اسم افا كردي", "معنى ارديل", "أسماء كردية", "سؤال وجواب"]
    },
    "titles": {
      "tr": "Kürtçe İsim Soru-Cevap Rehberi: Ava, Ardil, Ajwan ve Daha Fazlası",
      "en": "Kurdish Names Q&A Guide: Ava, Ardil, Ajwan and More",
      "de": "Kurdische Namen FAQ Leitfaden: Ava, Ardil, Ajwan und mehr",
      "ar": "دليل الأسئلة والأجوبة للأسماء الكردية: آفا، أرديل، أجوان والمزيد"
    },
    "descriptions": {
      "tr": "Ava ismi Kürtçe mi? Ardil ne demek? Bejna ve Berxo ne anlama gelir? En çok merak edilen Kürtçe isimlerin anlamlarını ve kökenlerini cevaplıyoruz.",
      "en": "Is Ava a Kurdish name? What does Ardil mean? What do Bejna and Berxo mean? We answer the meanings and origins of the most curious Kurdish names.",
      "de": "Ist Ava ein kurdischer Name? Was bedeutet Ardil? Was bedeuten Bejna und Berxo? Wir beantworten die Bedeutungen und Ursprünge der neugierigsten kurdischen Namen.",
      "ar": "هل آفا اسم كردي؟ ماذا يعني أرديل؟ ما معنى بجنا وبرخو؟ نجيب على معاني وأصول الأسماء الكردية الأكثر فضولاً."
    }
  },
  {
    "id": "kurtce-isimlerin-tarihi-ve-bahoz-isminin-anlami",
    "date": "2026-07-01",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-isimlerin-tarihi-ve-bahoz-isminin-anlami",
      "en": "history-of-kurdish-names-and-meaning-of-bahoz",
      "de": "geschichte-kurdischer-namen-und-bedeutung-von-bahoz",
      "ar": "تاريخ-الاسماء-الكردية-ومعنى-اسم-باهوز"
    },
    "tags": {
      "tr": ["Bahoz Ne Demek", "Tarihi İsimler", "Kürtçe İsimler", "Bahoz İsmi Yasak Mı"],
      "en": ["Bahoz Meaning", "Historical Names", "Kurdish Names", "Is Bahoz Banned"],
      "de": ["Bahoz Bedeutung", "Historische Namen", "Kurdische Namen", "Ist Bahoz Verboten"],
      "ar": ["معنى باهوز", "أسماء تاريخية", "أسماء كردية", "هل باهوز ممنوع"]
    },
    "titles": {
      "tr": "Kürtçe İsimlerin Tarihi ve Bahoz İsminin Anlamı",
      "en": "History of Kurdish Names and Meaning of Bahoz",
      "de": "Geschichte der kurdischen Namen und Bedeutung von Bahoz",
      "ar": "تاريخ الأسماء الكردية ومعنى اسم باهوز"
    },
    "descriptions": {
      "tr": "Tarihsel Kürt isimleri, Bahoz ne demek, Bahoz isminin anlamı nedir ve bu isim yasak mı? Tüm hukuki ve tarihi gerçekler.",
      "en": "Historical Kurdish names, what Bahoz means, what is the meaning of the name Bahoz, and is this name banned? All legal and historical facts.",
      "de": "Historische kurdische Namen, was Bahoz bedeutet, was die Bedeutung des Namens Bahoz ist und ist dieser Name verboten? Alle rechtlichen und historischen Fakten.",
      "ar": "الأسماء الكردية التاريخية، ماذا يعني باهوز، ما معنى اسم باهوز، وهل هذا الاسم ممنوع؟ جميع الحقائق القانونية والتاريخية."
    }
  },
  {
    "id": "en-cok-tercih-edilen-100-kurtce-erkek-ismi-2026",
    "date": "2026-05-13",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "en-cok-tercih-edilen-100-kurtce-erkek-ismi-2026",
      "en": "most-preferred-100-kurdish-boy-names-2026",
      "de": "beliebtesten-100-kurdischen-jungennamen-2026",
      "ar": "أكثر-100-اسم-كردي-مفضل-للذكور-2026"
    },
    "tags": {
      "tr": [
        "Kürtçe Erkek İsimleri",
        "Erkek Kürtçe İsimler",
        "Bebek İsimleri",
        "Popüler İsimler"
      ],
      "en": [
        "Kurdish Boy Names",
        "Baby Names",
        "Popular Names"
      ],
      "de": [
        "Kurdische Jungennamen",
        "Babynamen",
        "Beliebte Namen"
      ],
      "ar": [
        "أسماء ذكور كردية",
        "أسماء ذكور",
        "معاني الأسماء",
        "أسماء شعبية"
      ]
    },
    "titles": {
      "tr": "Türkiye'de En Çok Tercih Edilen 100 Kürtçe Erkek İsmi [2026 Güncel Liste]",
      "en": "Most Preferred 100 Kurdish Boy Names in Turkey [2026 Current List]",
      "de": "Meistbevorzugte 100 kurdische Jungennamen in der Türkei [2026 Aktuelle Liste]",
      "ar": "أكثر 100 اسم ذكور كردي تفضيلاً في تركيا [قائمة 2026 المحدثة]"
    },
    "descriptions": {
      "tr": "2026 yılında Türkiye'de en çok tercih edilen 100 Kürtçe erkek ismi, anlamları ve detaylı analizi. Doğru ismi bulmak için en güncel rehber.",
      "en": "The most preferred 100 Kurdish boy names in Turkey in 2026, their meanings, and detailed analysis. The most current guide to finding the right name.",
      "de": "Die 100 meistbevorzugten kurdischen Jungennamen in der Türkei im Jahr 2026, ihre Bedeutungen und detaillierte Analyse. Der aktuellste Leitfaden zur Namensfindung.",
      "ar": "أكثر 100 اسم كردي تفضيلاً للذكور في تركيا لعام 2026، معانيها وتحليلها المفصل. الدليل الأحدث لمساعدتكم في اختيار الاسم الصحيح."
    }
  },
  {
    "id": "kurt-kahramanlarindan-esinlenen-50-guclu-erkek-ismi",
    "date": "2026-05-12",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurt-kahramanlarindan-esinlenen-50-guclu-erkek-ismi",
      "en": "50-powerful-boy-names-inspired-by-legendary-kurdish-heroes",
      "de": "50-starke-jungennamen-inspiriert-von-kurdischen-helden",
      "ar": "اسماء-ذكور-كردية-قوية-مستوحاة-من-ابطال"
    },
    "tags": {
      "tr": [
        "Kürtçe Erkek İsimleri",
        "Kürtçe Kahraman İsimleri",
        "Güçlü İsimler",
        "Bebek İsimleri"
      ],
      "en": [
        "Kurdish Boy Names",
        "Kurdish Hero Names",
        "Powerful Names",
        "Baby Names"
      ],
      "de": [
        "Kurdische Jungennamen",
        "Kurdische Heldennamen",
        "Starke Namen",
        "Babynamen"
      ],
      "ar": [
        "أسماء ذكور كردية",
        "أسماء أبطال كردية",
        "أسماء قوية",
        "أسماء مواليد"
      ]
    },
    "titles": {
      "tr": "Efsanevi Kürt Kahramanlarından Esinlenen 50 Güçlü Erkek İsmi",
      "en": "50 Powerful Boy Names Inspired by Legendary Kurdish Heroes",
      "de": "50 starke Jungennamen, inspiriert von legendären kurdischen Helden",
      "ar": "50 اسماً قوياً للذكور مستوحاة من أبطال الأكراد الأسطوريين"
    },
    "descriptions": {
      "tr": "Kürt tarihine ve mitolojisine damga vurmuş efsanevi kahramanlardan esinlenen en güçlü 50 erkek ismi listesi. Oğlunuza anlamlı bir miras bırakın.",
      "en": "A list of the strongest 50 boy names inspired by legendary heroes who left their mark on Kurdish history and mythology. Leave a meaningful legacy for your son.",
      "de": "Eine Liste der 50 stärksten Jungennamen, inspiriert von legendären Helden, die die kurdische Geschichte und Mythologie geprägt haben. Hinterlassen Sie Ihrem Sohn ein bedeutungsvolles Erbe.",
      "ar": "قائمة بأقوى 50 اسماً للذكور مستوحاة من الأبطال الأسطوريين الذين تركوا بصماتهم في التاريخ والميثولوجيا الكردية. اتركوا لابنكم إرثاً تاريخياً فخماً."
    }
  },
  {
    "id": "en-populer-100-kurtce-kiz-isimleri-ve-anlamlari-2026",
    "date": "2026-05-12",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "en-populer-100-kurtce-kiz-isimleri-ve-anlamlari-2026",
      "en": "most-popular-100-kurdish-girl-names-2026",
      "de": "beliebtesten-100-kurdischen-maedchennamen-2026",
      "ar": "أشهر-100-اسم-كردي-للبنات-2026"
    },
    "tags": {
      "tr": [
        "Kürtçe Kız İsimleri",
        "Kız Kürtçe İsimler",
        "Bebek İsimleri",
        "Popüler İsimler"
      ],
      "en": [
        "Kurdish Girl Names",
        "Baby Names",
        "Popular Names"
      ],
      "de": [
        "Kurdische Mädchennamen",
        "Babynamen",
        "Beliebte Namen"
      ],
      "ar": [
        "أسماء بنات كردية",
        "أسماء بنات",
        "معاني الأسماء",
        "أسماء شعبية"
      ]
    },
    "titles": {
      "tr": "En Popüler 100 Kürtçe Kız İsmi ve Derin Anlamları [2026 Rehberi]",
      "en": "Most Popular 100 Kurdish Girl Names and Deep Meanings [2026 Guide]",
      "de": "Beliebteste 100 kurdische Mädchennamen und tiefe Bedeutungen [2026 Leitfaden]",
      "ar": "أشهر 100 اسم كردي للبنات ومعانيها العميقة [دليل 2026]"
    },
    "descriptions": {
      "tr": "2026 yılı için en popüler 100 Kürtçe kız ismini, anlamlarını ve kültürel hikayelerini sizin için derledik. İsim seçiminizi kolaylaştıracak kapsamlı rehber.",
      "en": "We have compiled the most popular 100 Kurdish girl names, their meanings, and cultural stories for 2026. A comprehensive guide to ease your name choice.",
      "de": "Wir haben die beliebtesten 100 kurdischen Mädchennamen, ihre Bedeutungen und kulturellen Geschichten für 2026 zusammengestellt. Ein umfassender Leitfaden zur Erleichterung Ihrer Namenswahl.",
      "ar": "لقد قمنا بجمع أشهر 100 اسم كردي للبنات ومعانيها وقصصها الثقافية لعام 2026. دليل شامل لتسهيل اختياركم للاسم المناسب."
    }
  },
  {
    "id": "anlamli-dogadan-esintili-kurtce-kiz-isimleri",
    "date": "2026-05-12",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "anlamli-dogadan-esintili-kurtce-kiz-isimleri",
      "en": "meaningful-nature-inspired-kurdish-girls-names",
      "de": "bedeutungsvolle-natur-inspirierte-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-مستوحاة-من-الطبيعة"
    },
    "tags": {
      "tr": [
        "Kürtçe Kız İsimleri",
        "Doğa İsimleri",
        "Anlamlı İsimler",
        "Kız Bebek İsimleri"
      ],
      "en": [
        "Kurdish Girl Names",
        "Nature Names",
        "Meaningful Names",
        "Baby Names"
      ],
      "de": [
        "Kurdische Mädchennamen",
        "Naturnamen",
        "Bedeutungsvolle Namen",
        "Babynamen"
      ],
      "ar": [
        "أسماء بنات كردية",
        "أسماء من الطبيعة",
        "أسماء ذات معنى عميق",
        "أسماء مواليد"
      ]
    },
    "titles": {
      "tr": "Doğadan Esintiler: Anlamı Kadar Güzel 50 Kürtçe Kız İsmi",
      "en": "Nature's Whispers: 50 Kurdish Girl Names as Beautiful as Their Meanings",
      "de": "Hauch der Natur: 50 kurdische Mädchennamen, so schön wie ihre Bedeutung",
      "ar": "نسمات من الطبيعة: 50 اسماً كردياً للبنات بجمال معانيها"
    },
    "descriptions": {
      "tr": "Doğanın güzelliklerini yansıtan, anlamları kadar kulağa da hoş gelen en güzel 50 Kürtçe kız ismini keşfedin. Bebeğinize ilham verecek isimler listesi.",
      "en": "Discover the most beautiful 50 Kurdish girl names reflecting the beauty of nature, as pleasing to the ear as they are meaningful. A list of inspiration.",
      "de": "Entdecken Sie die 50 schönsten kurdischen Mädchennamen, die die Schönheit der Natur widerspiegeln. Eine inspirierende Liste für Ihr Baby.",
      "ar": "اكنشفوا أجمل 50 اسماً كردياً للبنات يعكس سحر الطبيعة وعذوبتها، مع معانيها العميقة ووقعها الموسيقي الملهم لتختاروا الأفضل لطفلتكم."
    }
  },
  {
    "id": "twin-names-guide",
    "date": "2026-05-12",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-ikiz-bebek-isimleri-ve-uyumlu-kombinasyonlar",
      "en": "kurdish-twin-baby-names-and-harmonious-combinations",
      "de": "kurdische-zwillinge-babynamen-und-kombinationen",
      "ar": "اسماء-توائم-كردية-متناسقة-ومعانيها"
    },
    "tags": {
      "tr": [
        "İkiz İsimleri",
        "Kürtçe İsimler",
        "Bebek İsimleri",
        "Uyumlu İsimler"
      ],
      "en": [
        "Twin Names",
        "Kurdish Names",
        "Baby Names",
        "Harmonious Names"
      ],
      "de": [
        "Zwillingsnamen",
        "Kurdische Namen",
        "Babynamen",
        "Kombinationen"
      ],
      "ar": [
        "اسماء توائم",
        "اسماء كردية",
        "اسماء اطفال",
        "اسماء متناسقة"
      ]
    },
    "titles": {
      "tr": "Kürtçe İkiz Bebek İsimleri ve Uyumlu Kombinasyonlar",
      "en": "Kurdish Twin Baby Names and Harmonious Combinations",
      "de": "Kurdische Zwillinge Babynamen und harmonische Kombinationen",
      "ar": "أجمل أسماء التوائم الكردية المتناسقة ومعانيها"
    },
    "descriptions": {
      "tr": "İkiz bebek bekleyen aileler için özel olarak hazırlanmış, hem fonetik hem de anlamsal olarak kusursuz uyum sağlayan Kürtçe ikiz bebek isim kombinasyonları rehberi.",
      "en": "A guide to Kurdish twin baby name combinations that provide perfect phonetic and semantic harmony, specially curated for families expecting twins.",
      "de": "Ein Ratgeber für kurdische Zwillingsnamen-Kombinationen mit perfekter phonetischer und semantischer Harmonie, speziell für werdende Eltern von Zwillingen.",
      "ar": "دليل متكامل لأجمل وأقوى أسماء التوائم الكردية المتناسقة لفظياً ومعنوياً، تم إعداده خصيصاً للعائلات التي تنتظر قدوم توائم مميزين."
    }
  },
  {
    "id": "girls-names-list",
    "date": "2026-05-06",
    "author": "KurdishName Team",
    "slugs": {
      "tr": "kurtce-kiz-isimleri-ve-anlamlari-en-guzel-duyulmamis-isimler",
      "en": "kurdish-girls-names-and-meanings-most-beautiful-names",
      "de": "kurdische-maedchennamen-und-bedeutungen",
      "ar": "اجمل-اسماء-البنات-الكردية-ومعانيها"
    },
    "tags": {
      "tr": [
        "Kürtçe Kız İsimleri",
        "Kız Kürtçe İsimler",
        "Bebek İsimleri"
      ],
      "en": [
        "Kurdish Girls Names",
        "Baby Names",
        "Kurdish Names"
      ],
      "de": [
        "Kurdische Mädchennamen",
        "Babynamen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء كردية",
        "أسماء بنات",
        "معاني الأسماء"
      ]
    },
    "titles": {
      "tr": "Kürtçe Kız İsimleri ve Anlamları (En Güzel, Duyulmamış İsimler)",
      "en": "Kurdish Girls Names and Meanings (Most Beautiful and Unheard)",
      "de": "Kurdische Mädchennamen und Bedeutungen (Schöne und Seltene)",
      "ar": "أجمل أسماء البنات الكردية ومعانيها المميزة"
    },
    "descriptions": {
      "tr": "En güzel, modern ve duyulmamış Kürtçe kız isimleri ve anlamlarını keşfedin. Bebeğinize isim seçerken size ilham verecek harika bir Kürtçe kız isimleri rehberi.",
      "en": "Discover the most beautiful, modern, and unique Kurdish girl names and meanings. A wonderful guide to inspire you when choosing a name for your baby.",
      "de": "Entdecken Sie die schönsten, modernsten und seltensten kurdischen Mädchennamen und deren Bedeutungen. Ein perfekter Leitfaden für Babynamen.",
      "ar": "اكتشفوا أجمل وأحدث أسماء البنات الكردية النادرة مع معانيها بالتفصيل. دليل متكامل لاختيار الاسم الأمثل لطفلتكم القادمة."
    }
  },
  {
    "id": "boys-names-list",
    "date": "2026-05-06",
    "author": "KurdishName Team",
    "slugs": {
      "tr": "kurtce-erkek-isimleri-ve-anlamlari-kapsamli-liste",
      "en": "kurdish-boys-names-comprehensive-list-with-meanings",
      "de": "kurdische-jungennamen-bedeutung-liste",
      "ar": "اسماء-الاولاد-الكردية-ومعانيها-كاملة"
    },
    "tags": {
      "tr": [
        "Kürtçe Erkek İsimleri",
        "Bebek İsimleri",
        "Erkek Kürtçe İsimler"
      ],
      "en": [
        "Kurdish Boys Names",
        "Baby Names",
        "Kurdish Names"
      ],
      "de": [
        "Kurdische Jungennamen",
        "Babynamen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "أسماء كردية أولاد",
        "معاني الأسماء"
      ]
    },
    "titles": {
      "tr": "Kürtçe Erkek İsimleri ve Anlamları (Kapsamlı Liste)",
      "en": "Kurdish Boys Names and Meanings (Comprehensive List)",
      "de": "Kurdische Jungennamen und Bedeutungen (Umfangreiche Liste)",
      "ar": "أسماء الأولاد الكردية ومعانيها الكاملة"
    },
    "descriptions": {
      "tr": "En popüler, modern ve asil Kürtçe erkek isimleri. Anne baba adayları için özenle hazırlanmış en güncel Kürtçe erkek isimleri listesi.",
      "en": "The most popular, modern, and noble Kurdish boy names. Carefully curated up-to-date Kurdish baby boy names list for expecting parents.",
      "de": "Die beliebtesten, modernsten und edelsten kurdischen Jungennamen. Eine sorgfältig zusammengestellte Liste kurdischer Babynamen für werdende Eltern.",
      "ar": "أجمل وأقوى أسماء الأولاد الكردية التقليدية والحديثة مع معانيها العميقة. الدليل الأحدث والكامل لتسمية المواليد الذكور."
    }
  },
  {
    "id": "popular-names-list",
    "date": "2026-05-06",
    "author": "KurdishName Team",
    "slugs": {
      "tr": "en-guzel-kiz-kurtce-isimler-ve-anlamlari",
      "en": "most-popular-kurdish-names-and-meanings",
      "de": "beliebte-kurdische-vornamen-bedeutungen",
      "ar": "اشهر-الاسماء-الكردية-ومعانيها-المميزة"
    },
    "tags": {
      "tr": [
        "Kız Kürtçe İsimler",
        "Kürtçe Kız İsimleri",
        "İsim Anlamları"
      ],
      "en": [
        "Popular Kurdish Names",
        "Kurdish Meanings",
        "Baby Names"
      ],
      "de": [
        "Beliebte kurdische Namen",
        "Kurdische Vornamen",
        "Bedeutungen"
      ],
      "ar": [
        "أشهر الأسماء الكردية",
        "أسماء مميزة",
        "معاني الأسماء"
      ]
    },
    "titles": {
      "tr": "En Güzel Kız Kürtçe İsimler ve Kürtçe Kız İsimleri Listesi",
      "en": "Most Popular Kurdish Names and Meanings",
      "de": "Beliebte kurdische Vornamen und Bedeutungen",
      "ar": "أشهر الأسماء الكردية ومعانيها المميزة"
    },
    "descriptions": {
      "tr": "En popüler, duyulmamış, dini ve modern kız Kürtçe isimler ile Kürtçe kız isimleri rehberi. Bebek bekleyen aileler için harika Kürtçe isim önerileri.",
      "en": "The most popular, unique, and modern Kurdish girl names list. Explore meanings and origins to find the ideal name for your child.",
      "de": "Die beliebtesten und seltensten kurdischen Vornamen für Mädchen. Ein umfassender Führer zur Auswahl des perfekten Vornamens.",
      "ar": "دليل شامل لأشهر وأحب الأسماء الكردية العريقة والجديدة مع معانيها وتفاصيلها الثقافية المميزة للعائلات المعاصرة."
    }
  },
  {
    "id": "modern-names-guide",
    "date": "2026-05-06",
    "author": "KurdishName Editorial",
    "contentKey": "blog4_content",
    "slugs": {
      "tr": "modern-kurtce-isimler-anlamli-duyulmamis-ve-en-yeni-isimler-rehberi",
      "en": "modern-kurdish-names-meanings-and-comprehensive-guide",
      "de": "moderne-kurdische-vornamen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-الحديثة"
    },
    "tags": {
      "tr": [
        "Modern Kürtçe İsimler",
        "Bebek İsimleri",
        "İsim Rehberi"
      ],
      "en": [
        "Modern Kurdish Names",
        "Baby Names",
        "Name Guide"
      ],
      "de": [
        "Moderne Kurdische Namen",
        "Babynamen",
        "Vornamen Ratgeber"
      ],
      "ar": [
        "أسماء حديثة",
        "أسماء كردية",
        "دليل التسمية"
      ]
    },
    "titles": {
      "tr": "Modern Kürtçe İsimler: Anlamlı, Duyulmamış ve En Yeni Bebek İsimleri Rehberi",
      "en": "Modern Kurdish Names: Meaningful, Unique, and Latest Baby Names Guide",
      "de": "Moderne kurdische Namen: Bedeutungsvolle, seltene und neueste Babynamen",
      "ar": "الأسماء الكردية الحديثة: دليل الأسماء ذات المعنى والنادرة"
    },
    "descriptions": {
      "tr": "2026 yılı için en güncel, modern ve anlamlı Kürtçe bebek isimleri rehberi. Duyulmamış isimler ve köken bilgileriyle kapsamlı analiz.",
      "en": "The most up-to-date, modern, and meaningful Kurdish baby names guide for 2026. Comprehensive analysis with unique names and origins.",
      "de": "Der aktuellste Ratgeber für moderne kurdische Babynamen im Jahr 2026. Umfassende Analyse mit seltenen Namen und Herkunft.",
      "ar": "أحدث الأسماء الكردية العصرية لعام 2026"
    }
  },
  {
    "id": "2026-populer-isimler",
    "date": "2026-05-06",
    "author": "KurdishName Editorial",
    "contentKey": "blog1_content",
    "slugs": {
      "tr": "2026-en-populer-kurtce-bebek-isimleri",
      "en": "2026-most-popular-kurdish-baby-names",
      "de": "2026-beliebteste-kurdische-babynamen",
      "ar": "اشهر-اسماء-الاطفال-الكردية-2026"
    },
    "tags": {
      "tr": [
        "Trendler",
        "Popüler İsimler",
        "Kürtçe İsimler 2026"
      ],
      "en": [
        "Trends",
        "Popular Names",
        "Kurdish Names 2026"
      ],
      "de": [
        "Trends",
        "Beliebte Namen",
        "Kurdische Namen 2026"
      ],
      "ar": [
        "اتجاهات",
        "اسماء مشهورة",
        "اسماء كردية 2026"
      ]
    },
    "titles": {
      "tr": "2026'nın En Popüler Kürtçe Bebek İsimleri",
      "en": "The Most Popular Kurdish Baby Names of 2026",
      "de": "Die beliebtesten kurdischen Babynamen 2026",
      "ar": "أشهر أسماء الأطفال الكردية لعام 2026"
    },
    "descriptions": {
      "tr": "2026 yılı Kürtçe isim tercihlerinde hem köklere dönüşün hem de modern tınıların harmanlandığı bir yıl oluyor. Bu rehberde, yılın en çok tercih edilen popüler Kürtçe bebek isimlerini inceliyoruz.",
      "en": "2026 is a year where a return to roots and modern tones blend in Kurdish name preferences. In this guide, we review the most popular Kurdish baby names of the year.",
      "de": "2026 ist ein Jahr, in dem sich Rückbesinnung auf die Wurzeln und moderne Klänge bei kurdischen Namenspräferenzen vermischen. In diesem Ratgeber stellen wir die beliebtesten kurdischen Babynamen des Jahres vor.",
      "ar": "أشهر الأسماء الكردية لعام 2026 مع المعاني والتحليلات"
    }
  },
  {
    "id": "mitolojik-isimler-rehberi",
    "date": "2026-05-06",
    "author": "KurdishName Editorial",
    "contentKey": "blog2_content",
    "slugs": {
      "tr": "mitolojik-kurt-isimleri-sahmaran-dan-kawa-ya",
      "en": "mythological-kurdish-names-from-shahmaran-to-kawa",
      "de": "mythologische-kurdische-namen-von-shahmaran-bis-kawa",
      "ar": "اسماء-كردية-اسطورية-من-شاهماران-الى-كاوا"
    },
    "tags": {
      "tr": [
        "Mitolojik İsimler",
        "Kürt Tarihi",
        "Efsanevi İsimler"
      ],
      "en": [
        "Mythological Names",
        "Kurdish History",
        "Legendary Names"
      ],
      "de": [
        "Mythologische Namen",
        "Kurdische Geschichte",
        "Sagenhafte Namen"
      ],
      "ar": [
        "اسماء اسطورية",
        "تاريخ كردي",
        "اسماء اسطورية"
      ]
    },
    "titles": {
      "tr": "Mitolojik Kürt İsimleri: Şahmaran'dan Kawa'ya Bir Miras",
      "en": "Mythological Kurdish Names: A Legacy from Shahmaran to Kawa",
      "de": "Mythologische kurdische Namen: Ein Erbe von Shahmaran bis Kawa",
      "ar": "الأسماء الكردية الأسطورية: إرث من شاهماران إلى كاوا"
    },
    "descriptions": {
      "tr": "Kürt mitolojisinden günümüze ulaşan efsanevi bebek isimleri. Çocuğunuza sadece bir isim değil, binlerce yıllık bir destan vermek istiyorsanız bu rehber tam size göre.",
      "en": "Legendary baby names from Kurdish mythology. If you want to give your child not just a name but a thousands-of-years-old epic, this guide is for you.",
      "de": "Sagenhafte Babynamen aus der kurdischen Mythologie. Wenn Sie Ihrem Kind nicht nur einen Namen, sondern ein jahrtausendealtes Epos geben wollen, ist dieser Ratgeber genau das Richtige.",
      "ar": "أسماء أطفال أسطورية من الأساطير الكردية. إذا كنت تريد إعطاء طفلك ليس مجرد اسم بل ملحمة تمتد لآلاف السنين، فهذا الدليل مناسب لك."
    }
  },
  {
    "id": "modern-ve-nadir-isimler",
    "date": "2026-05-06",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "modern-ve-nadir-kurtce-isimler-gizli-hazineler",
      "en": "modern-and-rare-kurdish-names-hidden-treasures",
      "de": "moderne-und-seltene-kurdische-namen-verborgene-schaetze",
      "ar": "اسماء-كردية-حديثة-ونادرة-كنوز-مخفية"
    },
    "tags": {
      "tr": [
        "Nadir İsimler",
        "Modern İsimler",
        "Gizli Hazineler"
      ],
      "en": [
        "Rare Names",
        "Modern Names",
        "Hidden Treasures"
      ],
      "de": [
        "Seltene Namen",
        "Moderne Namen",
        "Verborgene Schätze"
      ],
      "ar": [
        "أسماء نادرة",
        "أسماء حديثة",
        "كنوز مخفية"
      ]
    },
    "titles": {
      "tr": "Modern ve Nadir Kürtçe İsimler: Gizli Hazineler",
      "en": "Modern and Rare Kurdish Names: Hidden Treasures",
      "de": "Moderne und seltene kurdische Namen: Verborgene Schätze",
      "ar": "الأسماء الكردية الحديثة والنادرة: كنوز مخفية"
    },
    "descriptions": {
      "tr": "Kimsede olmayan, duyulmamış, modern ve anlamlı Kürtçe bebek isimleri. Rênas, Arîn gibi zarif ve güçlü isimlerle dolu özel bir rehber.",
      "en": "Unique, unheard of, modern and meaningful Kurdish baby names. A special guide full of elegant and strong names like Rênas and Arîn.",
      "de": "Einzigartige, unentdeckte, moderne und bedeutungsvolle kurdische Babynamen. Ein besonderer Ratgeber voller eleganter und starker Namen wie Rênas und Arîn.",
      "ar": "أسماء أطفال كردية فريدة وحديثة وذات معنى. دليل خاص مليء بالأسماء الأنيقة والقوية مثل ريناس وآرين."
    }
  },
  {
    "id": "famous-100-boys-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "en-unlu-100-kurtce-erkek-ismi-ve-anlamlari",
      "en": "top-100-famous-kurdish-boys-names-and-meanings",
      "de": "die-100-beruehmtesten-kurdischen-jungennamen-und-bedeutungen",
      "ar": "اشهر-100-اسم-ولد-كردي-ومعانيها-الجميلة"
    },
    "tags": {
      "tr": [
        "Kürtçe Erkek İsimleri",
        "Kürtçe İsimler",
        "Bebek İsimleri",
        "En Ünlü İsimler"
      ],
      "en": [
        "Kurdish Boys Names",
        "Kurdish Names",
        "Baby Names",
        "Famous Names"
      ],
      "de": [
        "Kurdische Jungennamen",
        "Kurdische Namen",
        "Babynamen",
        "Berühmte Namen"
      ],
      "ar": [
        "أسماء أولاد كردية",
        "أسماء كردية ذكور",
        "معاني الأسماء",
        "أشهر الأسماء"
      ]
    },
    "titles": {
      "tr": "En Ünlü 100 Kürtçe Erkek İsmi ve Anlamları",
      "en": "Top 100 Famous Kurdish Boys Names and Meanings",
      "de": "Die 100 berühmtesten kurdischen Jungennamen und Bedeutungen",
      "ar": "أشهر 100 اسم ولد كردي ومعانيها الجميلة"
    },
    "descriptions": {
      "tr": "Tarihten günümüze en çok tercih edilen, kültürel ağırlığı olan ve en ünlü 100 Kürtçe erkek ismi ve anlamları listesi.",
      "en": "A list of the 100 most famous Kurdish boys names and their meanings, highly preferred from history to the present day.",
      "de": "Eine Liste der 100 berühmtesten kurdischen Jungennamen und ihrer Bedeutungen, die von der Geschichte bis heute sehr beliebt sind.",
      "ar": "قائمة شاملة تضم أشهر 100 اسم ولد كردي عريق ومعانيها اللغوية والثقافية المميزة للأولاد."
    }
  },
  {
    "id": "famous-100-girls-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "en-unlu-100-kurtce-kiz-ismi-ve-anlamlari",
      "en": "top-100-famous-kurdish-girls-names-and-meanings",
      "de": "die-100-beruehmtesten-kurdischen-maedchennamen-und-bedeutungen",
      "ar": "اشهر-100-اسم-بنت-كردي-ومعانيها-الجميلة"
    },
    "tags": {
      "tr": [
        "Kürtçe Kız İsimleri",
        "Kürtçe İsimler",
        "Bebek İsimleri",
        "En Ünlü İsimler"
      ],
      "en": [
        "Kurdish Girls Names",
        "Kurdish Names",
        "Baby Names",
        "Famous Names"
      ],
      "de": [
        "Kurdische Mädchennamen",
        "Kurdische Namen",
        "Babynamen",
        "Berühmte Namen"
      ],
      "ar": [
        "أسماء بنات كردية",
        "أسماء كردية بنات",
        "معاني الأسماء",
        "أشهر الأسماء"
      ]
    },
    "titles": {
      "tr": "En Ünlü 100 Kürtçe Kız İsmi ve Anlamları",
      "en": "Top 100 Famous Kurdish Girls Names and Meanings",
      "de": "Die 100 berühmtesten kurdischen Mädchennamen und Bedeutungen",
      "ar": "أشهر 100 اسم بنت كردي ومعانيها الجميلة"
    },
    "descriptions": {
      "tr": "Tarihten günümüze en çok tercih edilen, son derece melodik ve derin anlamlı 100 Kürtçe kız ismi ve anlamları listesi.",
      "en": "A list of the 100 most famous Kurdish girls names and their meanings, highly preferred from history to the present day.",
      "de": "Eine Liste der 100 berühmtesten kurdischen Mädchennamen und ihrer Bedeutungen, die von der Geschichte bis heute sehr beliebt sind.",
      "ar": "قائمة شاملة تضم أشهر 100 اسم بنت كردي عريق ومعانيها اللغوية والثقافية المميزة للبنات."
    }
  },
  {
    "id": "modern-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "yeni-nesil-100-modern-kurtce-isim-ve-anlamlari",
      "en": "100-modern-kurdish-names-new-generation-and-popular",
      "de": "100-moderne-kurdische-namen-neue-generation-und-beliebt",
      "ar": "100-اسم-كردي-حديث-جيل-جديد-وشعبية-واسعة"
    },
    "tags": {
      "tr": [
        "Modern İsimler",
        "Kürtçe İsimler",
        "Yeni Nesil İsimler",
        "Bebek İsimleri"
      ],
      "en": [
        "Modern Names",
        "Kurdish Names",
        "New Generation Names",
        "Baby Names"
      ],
      "de": [
        "Moderne Namen",
        "Kurdische Namen",
        "Neue Generation Namen",
        "Babynamen"
      ],
      "ar": [
        "أسماء كردية حديثة",
        "أسماء حديثة",
        "أسماء أطفال",
        "جيل جديد"
      ]
    },
    "titles": {
      "tr": "Yeni Nesil 100 Modern Kürtçe İsim ve Anlamları",
      "en": "100 Modern Kurdish Names (New Generation & Popular)",
      "de": "100 moderne kurdische Namen (Neue Generation & Beliebt)",
      "ar": "100 اسم كردي حديث (جيل جديد وشعبية واسعة)"
    },
    "descriptions": {
      "tr": "Son yılların en popüler, kısa, melodik ve modern tınılı 100 yeni nesil Kürtçe bebek ismi ve anlamları rehberi.",
      "en": "A list of the 100 most popular, short, melodic, and modern-sounding Kurdish baby names preferred by the new generation.",
      "de": "Eine Liste der 100 beliebtesten, kurzen, melodischen und modern klingenden kurdischen Babynamen der neuen Generation.",
      "ar": "قائمة شاملة تضم أشهر 100 اسم كردي حديث ومميز لجيل جديد من الأطفال الإناث والذكور مع معانيها."
    }
  },
  {
    "id": "classic-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-eski-ve-geleneksel-kurtce-isim-ve-anlamlari",
      "en": "100-old-and-traditional-kurdish-names-classic-and-historical",
      "de": "100-alte-und-traditionelle-kurdischen-namen-klassisch-und-historisch",
      "ar": "100-اسم-كردي-قديم-وتقليدي-كلاسيكي-وتاريخي"
    },
    "tags": {
      "tr": [
        "Klasik İsimler",
        "Geleneksel İsimler",
        "Tarihi İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "Classic Names",
        "Traditional Names",
        "Historical Names",
        "Kurdish Names"
      ],
      "de": [
        "Klassische Namen",
        "Traditionelle Namen",
        "Historische Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء كلاسيكية",
        "أسماء تقليدية",
        "أسماء تاريخية",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Eski ve Geleneksel Kürtçe İsim (Klasik & Tarihi)",
      "en": "100 Old and Traditional Kurdish Names (Classic & Historical)",
      "de": "100 alte und traditionelle kurdische Namen (Klassisch & Historisch)",
      "ar": "100 اسم كردي قديم وتقليدي (كلاسيكي وتاريخي عريق)"
    },
    "descriptions": {
      "tr": "Tarihteki beyliklerden, asil aşiretlerden, destansı halk anlatılarından ve klasik edebiyattan süzülerek gelen en köklü 100 Kürtçe isim.",
      "en": "A guide to 100 of the most established, deep, and traditional Kurdish names originating from historical principalities, noble clans, and epics.",
      "de": "Ein Leitfaden zu 100 der am tiefsten verwurzelten kurdischen Namen aus alten Fürstentümern, edlen Stämmen und Volksmythen.",
      "ar": "دليل شامل يضم 100 من أعرق الأسماء الكردية التاريخية والتقليدية المستوحاة من الإمارات القديمة والقبائل والأدب الكلاسيكي."
    }
  },
  {
    "id": "nature-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-kurtce-doga-ismi-ve-anlamlari",
      "en": "100-kurdish-nature-names-and-meanings",
      "de": "100-kurdische-naturnamen-und-bedeutungen",
      "ar": "100-اسم-كردي-من-الطبيعة-ومعانيها"
    },
    "tags": {
      "tr": [
        "Doğa İsimleri",
        "Kürtçe İsimler",
        "Tabiat İsimleri",
        "Bebek İsimleri"
      ],
      "en": [
        "Nature Names",
        "Kurdish Names",
        "Environmental Names",
        "Baby Names"
      ],
      "de": [
        "Naturnamen",
        "Kurdische Namen",
        "Umweltnamen",
        "Babynamen"
      ],
      "ar": [
        "أسماء طبيعية",
        "أسماء كردية",
        "أسماء البيئة",
        "أسماء أطفال"
      ]
    },
    "titles": {
      "tr": "100 Kürtçe Doğa İsmi (Dağ, Nehir, Çiçek ve Tabiat)",
      "en": "100 Kurdish Nature Names (Mountains, Rivers, Flowers & Environment)",
      "de": "100 kurdische Naturnamen (Berge, Flüsse, Blumen & Umwelt)",
      "ar": "100 اسم كردي مستوحى من الطبيعة (الجبال، الأنهار، الزهور والبيئة)"
    },
    "descriptions": {
      "tr": "Mezopotamya coğrafyasının yüce dağlarından, hırçın nehirlerinden ve zarif çiçeklerinden gelen en sevilen 100 doğa ismi rehberi.",
      "en": "A guide to 100 of the most beloved nature-inspired Kurdish names originating from Mesopotamian mountains, rivers, and flora.",
      "de": "Ein Leitfaden zu 100 der beliebtesten von der Natur inspirierten kurdischen Namen aus mesopotamischen Bergen, Flüssen und Pflanzen.",
      "ar": "دليل شامل يضم 100 اسم كردي أصيل مستوحى من الجبال الشامخة، الأنهار الجارية، والزهور البرية العذبة."
    }
  },
  {
    "id": "mythology-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-kurtce-mitolojik-ve-destansi-isim-ve-anlamlari",
      "en": "100-kurdish-mythological-and-epic-names-and-meanings",
      "de": "100-kurdische-mythologische-und-epische-namen-und-bedeutungen",
      "ar": "100-اسم-كردي-اسطوري-وملحمي-تاريخي"
    },
    "tags": {
      "tr": [
        "Mitolojik İsimler",
        "Destansı İsimler",
        "Kahramanlık İsimleri",
        "Kürtçe İsimler"
      ],
      "en": [
        "Mythological Names",
        "Epic Names",
        "Heroic Names",
        "Kurdish Names"
      ],
      "de": [
        "Mythologische Namen",
        "Epische Namen",
        "Heldennamen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أسطورية",
        "أسماء ملحمية",
        "أسماء البطولة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Kürtçe Mitolojik ve Destansı İsim (Kahramanlar & Efsaneler)",
      "en": "100 Kurdish Mythological and Epic Names (Heroes & Legends)",
      "de": "100 kurdische mythologische und epische Namen (Helden & Legenden)",
      "ar": "100 اسم كردي أسطوري وملحمي (أبطال وأساطير تاريخية)"
    },
    "descriptions": {
      "tr": "Binlerce yıllık Mezopotamya tarihinden, Mem û Zîn destanından ve Şerefname'den süzülen en heybetli 100 Kürtçe mitolojik isim.",
      "en": "A comprehensive guide to 100 legendary mythological and epic Kurdish names from Mesopotamian tales, Mem u Zin, and history.",
      "de": "Ein umfassender Leitfaden zu 100 legendären mythologischen und epischen kurdischen Namen aus mesopotamischen Sagen und der Geschichte.",
      "ar": "دليل شامل يضم 100 من أعظم الأسماء الكردية الأسطورية والملحمية المستوحاة من ميزوبوتاميا وملحمة مم وزين."
    }
  },
  {
    "id": "rare-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-kurtce-duyulmamis-ve-nadir-isimler-ve-anlamlari",
      "en": "100-unheard-and-rare-kurdish-names-and-meanings",
      "de": "100-seltene-und-unbekannte-kurdische-namen-und-bedeutungen",
      "ar": "100-اسم-كردي-غريب-ونادر-ومعانيها"
    },
    "tags": {
      "tr": [
        "Nadir İsimler",
        "Duyulmamış İsimler",
        "Butik İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "Rare Names",
        "Unheard Names",
        "Authentic Names",
        "Kurdish Names"
      ],
      "de": [
        "Seltene Namen",
        "Unbekannte Namen",
        "Authentische Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء نادرة",
        "أسماء غريبة",
        "أسماء أصيلة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Kürtçe Duyulmamış ve Nadir İsimler (Gizli Hazineler)",
      "en": "100 Unheard and Rare Kurdish Names (Hidden Treasures)",
      "de": "100 seltene und unbekannte kurdische Namen (Verborgene Schätze)",
      "ar": "100 اسم كردي غريب ونادر (كنوز تراثية دفينة)"
    },
    "descriptions": {
      "tr": "Eski metinlerden ve uzak sınır köylerinden süzülerek gelen, melodisi güçlü ve anlamı muazzam 100 butik Kürtçe isim rehberi.",
      "en": "A comprehensive guide to 100 highly unique, authentic, and rare Kurdish names preserved in classical writings and remote valleys.",
      "de": "Ein Leitfaden zu 100 einzigartigen, authentischen und seltenen kurdischen Namen aus alten Schriften und entlegenen Dörfern.",
      "ar": "دليل فريد يضم 100 اسم كردي أصيل ونادر جداً مستخلص من المخطوطات القديمة واللهجات Tüşatî (تراثية)."
    }
  },
  {
    "id": "artistic-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-kurtce-edebi-ve-sanatsal-isim-ve-anlamlari",
      "en": "100-kurdish-literary-and-artistic-names-and-meanings",
      "de": "100-kurdische-literarische-und-kuenstlerische-namen-und-bedeutungen",
      "ar": "100-اسم-كردي-ادبي-وفني-ومعانيها"
    },
    "tags": {
      "tr": [
        "Edebi İsimler",
        "Sanatsal İsimler",
        "Şiirsel İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "Literary Names",
        "Artistic Names",
        "Poetic Names",
        "Kurdish Names"
      ],
      "de": [
        "Literarische Namen",
        "Künstlerische Namen",
        "Poetische Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أدبية",
        "أسماء فنية",
        "أسماء شاعرية",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Kürtçe Edebi ve Sanatsal İsim (Şiir, Müzik ve Sanat)",
      "en": "100 Kurdish Literary and Artistic Names (Poetry, Music & Art)",
      "de": "100 kurdische literarische und künstlerische Namen (Poesie, Musik & Kunst)",
      "ar": "100 اسم كردي أدبي وفني (الشعر، الموسيقى، والفن التراثي)"
    },
    "descriptions": {
      "tr": "Kürt halk edebiyatından, Dengbêj stranlarından, renklerden ve estetik divan motiflerinden süzülen en ruhlu 100 edebi Kürtçe isim.",
      "en": "A curated guide to 100 of the most poetic and emotional Kurdish names connected to classical literature, traditional songs, and art.",
      "de": "Ein kuratierter Leitfaden zu 100 der poetischsten kurdischen Namen aus klassischer Literatur, traditionellen Melodien und der Kunst.",
      "ar": "دليل شامل يضم 100 اسم كردي أدبي وشاعري مستوحى من كلاسيكيات الشعر وألحان الدنبج الوجدانية وفنون ميزوبوتاميا."
    }
  },
  {
    "id": "regional-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-bolgesel-ve-cografi-kurtce-isim-ve-anlamlari",
      "en": "100-regional-and-geographical-kurdish-names-and-meanings",
      "de": "100-regionale-und-geografische-kurdische-namen-und-bedeutungen",
      "ar": "100-اسم-كردي-اقليمي-وجغرافي-ومعانيها"
    },
    "tags": {
      "tr": [
        "Bölgesel İsimler",
        "Coğrafi İsimler",
        "Şehir İsimleri",
        "Kürtçe İsimler"
      ],
      "en": [
        "Regional Names",
        "Geographical Names",
        "City Names",
        "Kurdish Names"
      ],
      "de": [
        "Regionale Namen",
        "Geografische Namen",
        "Städtenamen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء إقليمية",
        "أسماء جغرافية",
        "أسماء المدن",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Bölgesel ve Coğrafi Kürtçe İsim (Şehir, Dağ, Nehir)",
      "en": "100 Regional and Geographical Kurdish Names (City, Mountain, River)",
      "de": "100 Regionale und geografische kurdische Namen (Stadt, Berg, Fluss)",
      "ar": "100 اسم كردي إقليمي وجغرافي (مدينة، جبل، نهر)"
    },
    "descriptions": {
      "tr": "Kürt coğrafyasının kalbinden, görkemli dağlarından, akarsularından ve kadim şehirlerinden süzülen en güzel 100 bölgesel isim.",
      "en": "A curated list of 100 beautiful regional Kurdish names inspired by cities, mountain ranges, and rivers of the homeland.",
      "de": "Eine kuratierte Liste von 100 schönen regionalen kurdischen Namen, inspiriert von Städten, Gebirgen und Flüssen der Heimat.",
      "ar": "دليل شامل يضم 100 اسم كردي إقليمي وجغرافي مستوحى من المدن العريقة والجبال الشامخة والوديان والأنهار."
    }
  },
  {
    "id": "folklore-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-kurtce-folklor-ve-destan-karakteri-ismi-ve-anlamlari",
      "en": "100-kurdish-folklore-and-epic-character-names-and-meanings",
      "de": "100-kurdische-folklore-und-epos-charakternamen-und-bedeutungen",
      "ar": "100-اسم-شخصية-فولكلورية-وملحمية-كردية-ومعانيها"
    },
    "tags": {
      "tr": [
        "Folklor İsimleri",
        "Destan İsimleri",
        "Halk Edebiyatı",
        "Kürtçe İsimler"
      ],
      "en": [
        "Folklore Names",
        "Epic Character Names",
        "Folk Literature",
        "Kurdish Names"
      ],
      "de": [
        "Folklorenamen",
        "Epos-Charakternamen",
        "Volksliteratur",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء فولكلورية",
        "أسماء الملاحم",
        "أدب شعبي",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Kürtçe Folklor ve Destan Karakteri İsmi (Efsaneler)",
      "en": "100 Kurdish Folklore and Epic Character Names (Legends)",
      "de": "100 kurdische Folklore- und Epos-Charakternamen (Legenden)",
      "ar": "100 اسم شخصية فولكلورية وملحمية كردية (أساطير)"
    },
    "descriptions": {
      "tr": "Sözlü halk edebiyatının, bilge Dengbêjlerin ve masalların ölümsüz karakterlerinden gelen en heybetli 100 halk ismi.",
      "en": "A guide to 100 names of immortal heroes and heroines from Kurdish folk literature, epics, and traditional storytelling.",
      "de": "Ein Leitfaden zu 100 Namen unsterblicher Helden und Heldinnen aus der kurdischen Volksliteratur und den Epen.",
      "ar": "قائمة فريدة تضم 100 اسم مستوحى من أبطال وبطلات الملاحم الشعبية والقصص الكردية التراثية."
    }
  },
  {
    "id": "virtue-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-kurtce-erdem-ve-karakter-ismi-ve-anlamlari",
      "en": "100-kurdish-virtue-and-character-names-and-meanings",
      "de": "100-kurdische-tugend-und-charakternamen-und-bedeutungen",
      "ar": "100-اسم-فضيلة-وشخصية-كردية-ومعانيها"
    },
    "tags": {
      "tr": [
        "Erdem İsimleri",
        "Karakter İsimleri",
        "Ahlaki İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "Virtue Names",
        "Character Names",
        "Moral Names",
        "Kurdish Names"
      ],
      "de": [
        "Tugendnamen",
        "Charakternamen",
        "Moralische Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء الفضائل",
        "أسماء الشخصية",
        "أسماء الأخلاق",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Kürtçe Erdem ve Karakter İsmi (Virtue Names)",
      "en": "100 Kurdish Virtue and Character Names (Aesthetic)",
      "de": "100 kurdische Tugend- und Charakternamen (Ästhetisch)",
      "ar": "100 اسم فضيلة وشخصية كردية (معاني أخلاقية)"
    },
    "descriptions": {
      "tr": "Kişilik özelliklerini, güzel ahlakı ve toplumsal değerleri yücelten en saygın 100 Kürtçe erdem ismi.",
      "en": "A collection of 100 highly respected Kurdish names honoring virtuous personality traits, high morals, and social ethics.",
      "de": "Eine Sammlung von 100 hoch angesehenen kurdischen Namen, die tugendhafte Persönlichkeitsmerkmale und Moral ehren.",
      "ar": "قائمة مميزة تضم 100 اسم كردي يعبر عن الفضائل الأخلاقية العالية والطباع الحميدة والسمات Nüktedanî."
    }
  },
  {
    "id": "dynasty-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-tarihi-kurt-hukumdar-ve-hanedan-ismi-ve-anlamlari",
      "en": "100-historical-kurdish-ruler-and-dynasty-names-and-meanings",
      "de": "100-historische-kurdische-herrscher-und-dynastienamen-und-bedeutungen",
      "ar": "100-اسم-حاكم-وسلالة-كردية-تاريخية-ومعانيها"
    },
    "tags": {
      "tr": [
        "Tarihi İsimler",
        "Hükümdar İsimleri",
        "Hanedan İsimleri",
        "Kürtçe İsimler"
      ],
      "en": [
        "Historical Names",
        "Ruler Names",
        "Dynasty Names",
        "Kurdish Names"
      ],
      "de": [
        "Historische Namen",
        "Herrschernamen",
        "Dynastienamen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء تاريخية",
        "أسماء الحكام",
        "أسماء السلالات",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Tarihi Kürt Hükümdar ve Hanedan İsmi (Asil Seçimler)",
      "en": "100 Historical Kurdish Ruler and Dynasty Names (Noble)",
      "de": "100 historische kurdische Herrscher- und Dynastienamen (Edel)",
      "ar": "100 اسم حاكم وسلالة كردية تاريخية (أصالة)"
    },
    "descriptions": {
      "tr": "Mervaniler, Eyyubiler, Zendliler ve tarihi beyliklerden gelen en asil, gururlu ve görkemli 100 lider ismi.",
      "en": "A list of 100 noble and powerful ruler names originating from the Marwanid, Ayyubid, Zand, and principalities eras.",
      "de": "Eine Liste von 100 edlen und mächtigen Herrschernamen aus den Epochen der Marwaniden, Ayyubiden und Zand.",
      "ar": "دليل شامل يضم 100 اسم ملكي وعسكري وسياسي عريق مستوحى من تاريخ الإمارات الكردية كالأيوبية والزندية والمروانية."
    }
  },
  {
    "id": "color-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-kurtce-renk-ve-isik-ismi-ve-anlamlari",
      "en": "100-kurdish-color-and-light-names-and-meanings",
      "de": "100-kurdische-farb-und-lichtnamen-und-bedeutungen",
      "ar": "100-اسم-كردي-للالوان-والضوء-ومعانيها"
    },
    "tags": {
      "tr": [
        "Renk İsimleri",
        "Işık İsimleri",
        "Görsel İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "Color Names",
        "Light Names",
        "Visual Names",
        "Kurdish Names"
      ],
      "de": [
        "Farbnamen",
        "Lichtnamen",
        "Visuelle Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء الألوان",
        "أسماء الضوء",
        "أسماء بصرية",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Kürtçe Renk ve Işık İsmi (Görsel Estetik)",
      "en": "100 Kurdish Color and Light Names (Aesthetic)",
      "de": "100 kurdische Farb- und Lichtnamen (Ästhetisch)",
      "ar": "100 اسم كردي للألوان والضوء (جمال بصري)"
    },
    "descriptions": {
      "tr": "Doğanın ve gökyüzünün en parlak tonlarını, göz alıcı renkleri ve ilahi ışık ışınlarını simgeleyen 100 estetik isim.",
      "en": "A collection of 100 visual names representing the brightest tones of nature, celestial lights, and elegant colors.",
      "de": "Eine Sammlung von 100 visuellen Namen, die die hellsten Töne der Natur, himmlisches Licht und elegante Farben darstellen.",
      "ar": "قائمة استثنائية تضم 100 اسم يعبر عن وهج الضياء والبريق وألوان الطبيعة الساحرة في ميزوبوتاميا."
    }
  },
  {
    "id": "flower-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-kurtce-cicek-ve-bitki-ismi-ve-anlamlari",
      "en": "100-kurdish-flower-and-plant-names-and-meanings",
      "de": "100-kurdische-blumen-und-pflanzennamen-und-bedeutungen",
      "ar": "100-اسم-زهور-ونباتات-كردية-ومعانيها"
    },
    "tags": {
      "tr": [
        "Çiçek İsimleri",
        "Bitki İsimleri",
        "Doğa İsimleri",
        "Kürtçe İsimler"
      ],
      "en": [
        "Flower Names",
        "Plant Names",
        "Nature Names",
        "Kurdish Names"
      ],
      "de": [
        "Blumennamen",
        "Pflanzennamen",
        "Naturnamen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء الزهور",
        "أسماء النباتات",
        "أسماء الطبيعة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Kürtçe Çiçek ve Bitki İsmi (Bahar Esintisi)",
      "en": "100 Kurdish Flower and Plant Names (Spring Vibe)",
      "de": "100 kurdische Blumen- und Pflanzennamen (Frühlingsduft)",
      "ar": "100 اسم زهور ونباتات كردية (نسيم الربيع)"
    },
    "descriptions": {
      "tr": "Baharın uyanışını, narin kır çiçeklerini, kokulu reyhanları ve Mezopotamya bitki örtüsünü simgeleyen en zarif 100 isim.",
      "en": "Explore 100 extremely elegant names representing spring awakening, delicate wildflowers, and the rich Mesopotamian flora.",
      "de": "Entdecken Sie 100 äußerst elegante Namen, die das Erwachen des Frühlings und die reiche mesopotamische Flora darstellen.",
      "ar": "قائمة زكية تضم 100 اسم مستوحى من نضارة الأزهار العطرة والورود الفواحة والنباتات الطبيعية الربيعية."
    }
  },
  {
    "id": "spiritual-100-names",
    "date": "2026-05-08",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "100-kurtce-ruhani-ve-kutsal-isim-ve-anlamlari",
      "en": "100-kurdish-spiritual-and-sacred-names-and-meanings",
      "de": "100-kurdische-spirituelle-und-heilige-namen-und-bedeutungen",
      "ar": "100-اسم-روحي-ومقدس-كردي-ومعانيها"
    },
    "tags": {
      "tr": [
        "Ruhani İsimler",
        "Kutsal İsimler",
        "Manevi İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "Spiritual Names",
        "Sacred Names",
        "Moral Names",
        "Kurdish Names"
      ],
      "de": [
        "Spirituelle Namen",
        "Heilige Namen",
        "Manevi-Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء روحية",
        "أسماء مقدسة",
        "أسماء معنوية",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "100 Kürtçe Ruhani ve Kutsal İsim (Maneviyat & Huzur)",
      "en": "100 Kurdish Spiritual and Sacred Names (Peace & Harmony)",
      "de": "100 kurdische spirituelle und heilige Namen (Frieden & Harmonie)",
      "ar": "100 اسم روحي ومقدس كردي (السكينة والروحانية)"
    },
    "descriptions": {
      "tr": "Kadim inançlardan, dualardan, manevi değerlerden ve yüce ahlaki arınmışlıktan gelen en derin 100 kutsal isim.",
      "en": "A guide to 100 deeply spiritual and sacred names representing ancient beliefs, blessings, and pure moral harmony.",
      "de": "Ein Leitfaden zu 100 tief spirituellen und heiligen Namen, die für alten Glauben, Segen und moralische Harmonie stehen.",
      "ar": "قائمة جليلة تضم 100 اسم روحي ومقدس مستمد من القيم الروحانية العميقة والسلام والسكينة والعبادات والبركة."
    }
  },
  {
    "id": "nature-names",
    "date": "2026-05-19",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-doga-ve-tabiat-isimleri",
      "en": "kurdish-nature-and-environment-names",
      "de": "kurdische-natur-und-umwelt-namen",
      "ar": "أسماء-الطبيعة-والبيئة-الكردية"
    },
    "tags": {
      "tr": [
        "Doğa ve Tabiat",
        "Kürtçe İsimler"
      ],
      "en": [
        "Nature Names",
        "Kurdish Names"
      ],
      "de": [
        "Naturnamen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء الطبيعة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Kürtçe Doğa ve Tabiat İsimleri Rehberi",
      "en": "Kurdish Nature Names Guide",
      "de": "Leitfaden für kurdische Naturnamen",
      "ar": "دليل أسماء الطبيعة الكردية"
    },
    "descriptions": {
      "tr": "Kürtçedeki en güzel doğa ve tabiat temalı isimlerin listesi ve anlamları.",
      "en": "List and meanings of the most beautiful nature-themed names in Kurdish.",
      "de": "Liste und Bedeutungen der schönsten naturthematischen Namen auf Kurdisch.",
      "ar": "قائمة ومعاني أجمل الأسماء المستوحاة من الطبيعة في الكردية."
    }
  },
  {
    "id": "power-courage-names",
    "date": "2026-05-19",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-guc-ve-cesaret-isimleri",
      "en": "kurdish-power-and-courage-names",
      "de": "kurdische-macht-und-mut-namen",
      "ar": "أسماء-القوة-والشجاعة-الكردية"
    },
    "tags": {
      "tr": [
        "Güç ve Cesaret",
        "Kürtçe İsimler"
      ],
      "en": [
        "Power and Courage",
        "Kurdish Names"
      ],
      "de": [
        "Macht und Mut",
        "Kurdische Namen"
      ],
      "ar": [
        "القوة والشجاعة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Kürtçe Güç ve Cesaret İsimleri Rehberi",
      "en": "Kurdish Power and Courage Names Guide",
      "de": "Leitfaden für kurdische Namen der Macht und des Mutes",
      "ar": "دليل أسماء القوة والشجاعة الكردية"
    },
    "descriptions": {
      "tr": "Kürtçedeki en güçlü ve cesaret veren isimlerin listesi ve anlamları.",
      "en": "List and meanings of the strongest and most courageous names in Kurdish.",
      "de": "Liste und Bedeutungen der stärksten und mutigsten Namen auf Kurdisch.",
      "ar": "قائمة ومعاني أقوى الأسماء الشجاعة في الكردية."
    }
  },
  {
    "id": "light-brightness-names",
    "date": "2026-05-19",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-isik-ve-aydinlik-isimleri",
      "en": "kurdish-light-and-brightness-names",
      "de": "kurdische-licht-und-helligkeit-namen",
      "ar": "أسماء-النور-والسطوع-الكردية"
    },
    "tags": {
      "tr": [
        "Işık ve Aydınlık",
        "Kürtçe İsimler"
      ],
      "en": [
        "Light and Brightness",
        "Kurdish Names"
      ],
      "de": [
        "Licht und Helligkeit",
        "Kurdische Namen"
      ],
      "ar": [
        "النور والسطوع",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Kürtçe Işık ve Aydınlık İsimleri Rehberi",
      "en": "Kurdish Light and Brightness Names Guide",
      "de": "Leitfaden für kurdische Licht- und Helligkeitsnamen",
      "ar": "دليل أسماء النور والسطوع الكردية"
    },
    "descriptions": {
      "tr": "Kürtçedeki ışık, aydınlık ve güneş temalı isimlerin listesi ve anlamları.",
      "en": "List and meanings of light, brightness and sun themed names in Kurdish.",
      "de": "Liste und Bedeutungen von Licht-, Helligkeits- und Sonnenthemen auf Kurdisch.",
      "ar": "قائمة ومعاني الأسماء المستوحاة من النور والسطوع والشمس في الكردية."
    }
  },
  {
    "id": "wisdom-intellect-names",
    "date": "2026-05-19",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-bilgelik-ve-akil-isimleri",
      "en": "kurdish-wisdom-and-intellect-names",
      "de": "kurdische-weisheit-und-intellekt-namen",
      "ar": "أسماء-الحكمة-والفكر-الكردية"
    },
    "tags": {
      "tr": [
        "Bilgelik ve Akıl",
        "Kürtçe İsimler"
      ],
      "en": [
        "Wisdom and Intellect",
        "Kurdish Names"
      ],
      "de": [
        "Weisheit und Intellekt",
        "Kurdische Namen"
      ],
      "ar": [
        "الحكمة والفكر",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Kürtçe Bilgelik ve Akıl İsimleri Rehberi",
      "en": "Kurdish Wisdom and Intellect Names Guide",
      "de": "Leitfaden für kurdische Weisheits- und Intellektnamen",
      "ar": "دليل أسماء الحكمة والفكر الكردية"
    },
    "descriptions": {
      "tr": "Kürtçedeki bilgelik, akıl ve zeka temalı isimlerin listesi ve anlamları.",
      "en": "List and meanings of wisdom, intellect and intelligence themed names in Kurdish.",
      "de": "Liste und Bedeutungen von Namen zum Thema Weisheit und Intellekt auf Kurdisch.",
      "ar": "قائمة ومعاني الأسماء المستوحاة من الحكمة والذكاء في الكردية."
    }
  },
  {
    "id": "leadership-nobility-names",
    "date": "2026-05-19",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-liderlik-ve-asalet-isimleri",
      "en": "kurdish-leadership-and-nobility-names",
      "de": "kurdische-fuehrung-und-adel-namen",
      "ar": "أسماء-القيادة-والنبالة-الكردية"
    },
    "tags": {
      "tr": [
        "Liderlik ve Asalet",
        "Kürtçe İsimler"
      ],
      "en": [
        "Leadership and Nobility",
        "Kurdish Names"
      ],
      "de": [
        "Führung und Adel",
        "Kurdische Namen"
      ],
      "ar": [
        "القيادة والنبالة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Kürtçe Liderlik ve Asalet İsimleri Rehberi",
      "en": "Kurdish Leadership and Nobility Names Guide",
      "de": "Leitfaden für kurdische Führungs- und Adelsnamen",
      "ar": "دليل أسماء القيادة والنبالة الكردية"
    },
    "descriptions": {
      "tr": "Kürtçedeki asil, öncü ve liderlik temalı isimlerin listesi ve anlamları.",
      "en": "List and meanings of noble, pioneer and leadership themed names in Kurdish.",
      "de": "Liste und Bedeutungen von edlen, Pionier- und Führungsthemen auf Kurdisch.",
      "ar": "قائمة ومعاني الأسماء النبيلة والريادية في الكردية."
    }
  },
  {
    "id": "love-beauty-names",
    "date": "2026-05-19",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-sevgi-ve-guzellik-isimleri",
      "en": "kurdish-love-and-beauty-names",
      "de": "kurdische-liebe-und-schoenheit-namen",
      "ar": "أسماء-الحب-والجمال-الكردية"
    },
    "tags": {
      "tr": [
        "Sevgi ve Güzellik",
        "Kürtçe İsimler"
      ],
      "en": [
        "Love and Beauty",
        "Kurdish Names"
      ],
      "de": [
        "Liebe und Schönheit",
        "Kurdische Namen"
      ],
      "ar": [
        "الحب والجمال",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Kürtçe Sevgi ve Güzellik İsimleri Rehberi",
      "en": "Kurdish Love and Beauty Names Guide",
      "de": "Leitfaden für kurdische Liebes- und Schönheitsnamen",
      "ar": "دليل أسماء الحب والجمال الكردية"
    },
    "descriptions": {
      "tr": "Kürtçedeki sevgi, aşk, zarafet ve güzellik temalı isimlerin listesi.",
      "en": "List of love, elegance and beauty themed names in Kurdish.",
      "de": "Liste von Namen zum Thema Liebe, Eleganz und Schönheit auf Kurdisch.",
      "ar": "قائمة بالأسماء المستوحاة من الحب والأناقة والجمال في الكردية."
    }
  },
  {
    "id": "traditional-classic-names",
    "date": "2026-05-19",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "kurtce-geleneksel-ve-klasik-isimler",
      "en": "kurdish-traditional-and-classic-names",
      "de": "kurdische-traditionelle-und-klassische-namen",
      "ar": "الأسماء-الكردية-التقليدية-والكلاسيكية"
    },
    "tags": {
      "tr": [
        "Geleneksel ve Klasik",
        "Kürtçe İsimler"
      ],
      "en": [
        "Traditional and Classic",
        "Kurdish Names"
      ],
      "de": [
        "Traditionell und Klassisch",
        "Kurdische Namen"
      ],
      "ar": [
        "تقليدية وكلاسيكية",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Kürtçe Geleneksel ve Klasik İsimler Rehberi",
      "en": "Kurdish Traditional and Classic Names Guide",
      "de": "Leitfaden für traditionelle und klassische kurdische Namen",
      "ar": "دليل الأسماء الكردية التقليدية والكلاسيكية"
    },
    "descriptions": {
      "tr": "Kürtçedeki en köklü, geleneksel ve klasik isimlerin listesi ve anlamları.",
      "en": "List and meanings of the most deep-rooted, traditional and classic names in Kurdish.",
      "de": "Liste und Bedeutungen der tief verwurzeltesten, traditionellen und klassischen Namen auf Kurdisch.",
      "ar": "قائمة ومعاني الأسماء الأكثر تجذراً وتقليدية وكلاسيكية في الكردية."
    }
  }
,
  {
    "id": "letter-a-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "a-harfi-kurtce-erkek-isimleri",
      "en": "a-letter-kurdish-boy-names",
      "de": "a-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-a"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "A Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter A",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe A",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف A",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "A Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter A",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben A",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف A"
    },
    "descriptions": {
      "tr": "A harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with A. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit A. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف A. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-b-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "b-harfi-kurtce-erkek-isimleri",
      "en": "b-letter-kurdish-boy-names",
      "de": "b-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-b"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "B Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter B",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe B",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف B",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "B Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter B",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben B",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف B"
    },
    "descriptions": {
      "tr": "B harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with B. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit B. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف B. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-c-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "c-harfi-kurtce-erkek-isimleri",
      "en": "c-letter-kurdish-boy-names",
      "de": "c-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-c"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "C Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter C",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe C",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف C",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "C Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter C",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben C",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف C"
    },
    "descriptions": {
      "tr": "C harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with C. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit C. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف C. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-ç-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "ç-harfi-kurtce-erkek-isimleri",
      "en": "ç-letter-kurdish-boy-names",
      "de": "ç-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-ç"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "Ç Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter Ç",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe Ç",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف Ç",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Ç Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter Ç",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben Ç",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف Ç"
    },
    "descriptions": {
      "tr": "Ç harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with Ç. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit Ç. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف Ç. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-d-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "d-harfi-kurtce-erkek-isimleri",
      "en": "d-letter-kurdish-boy-names",
      "de": "d-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-d"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "D Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter D",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe D",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف D",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "D Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter D",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben D",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف D"
    },
    "descriptions": {
      "tr": "D harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with D. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit D. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف D. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-e-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "e-harfi-kurtce-erkek-isimleri",
      "en": "e-letter-kurdish-boy-names",
      "de": "e-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-e"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "E Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter E",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe E",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف E",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "E Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter E",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben E",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف E"
    },
    "descriptions": {
      "tr": "E harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with E. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit E. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف E. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-f-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "f-harfi-kurtce-erkek-isimleri",
      "en": "f-letter-kurdish-boy-names",
      "de": "f-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-f"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "F Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter F",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe F",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف F",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "F Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter F",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben F",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف F"
    },
    "descriptions": {
      "tr": "F harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with F. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit F. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف F. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-g-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "g-harfi-kurtce-erkek-isimleri",
      "en": "g-letter-kurdish-boy-names",
      "de": "g-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-g"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "G Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter G",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe G",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف G",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "G Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter G",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben G",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف G"
    },
    "descriptions": {
      "tr": "G harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with G. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit G. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف G. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-h-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "h-harfi-kurtce-erkek-isimleri",
      "en": "h-letter-kurdish-boy-names",
      "de": "h-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-h"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "H Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter H",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe H",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف H",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "H Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter H",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben H",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف H"
    },
    "descriptions": {
      "tr": "H harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with H. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit H. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف H. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-j-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "j-harfi-kurtce-erkek-isimleri",
      "en": "j-letter-kurdish-boy-names",
      "de": "j-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-j"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "J Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter J",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe J",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف J",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "J Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter J",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben J",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف J"
    },
    "descriptions": {
      "tr": "J harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with J. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit J. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف J. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-k-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "k-harfi-kurtce-erkek-isimleri",
      "en": "k-letter-kurdish-boy-names",
      "de": "k-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-k"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "K Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter K",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe K",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف K",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "K Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter K",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben K",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف K"
    },
    "descriptions": {
      "tr": "K harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with K. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit K. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف K. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-l-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "l-harfi-kurtce-erkek-isimleri",
      "en": "l-letter-kurdish-boy-names",
      "de": "l-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-l"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "L Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter L",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe L",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف L",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "L Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter L",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben L",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف L"
    },
    "descriptions": {
      "tr": "L harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with L. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit L. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف L. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-m-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "m-harfi-kurtce-erkek-isimleri",
      "en": "m-letter-kurdish-boy-names",
      "de": "m-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-m"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "M Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter M",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe M",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف M",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "M Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter M",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben M",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف M"
    },
    "descriptions": {
      "tr": "M harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with M. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit M. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف M. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-n-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "n-harfi-kurtce-erkek-isimleri",
      "en": "n-letter-kurdish-boy-names",
      "de": "n-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-n"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "N Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter N",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe N",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف N",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "N Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter N",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben N",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف N"
    },
    "descriptions": {
      "tr": "N harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with N. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit N. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف N. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-o-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "o-harfi-kurtce-erkek-isimleri",
      "en": "o-letter-kurdish-boy-names",
      "de": "o-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-o"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "O Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter O",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe O",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف O",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "O Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter O",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben O",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف O"
    },
    "descriptions": {
      "tr": "O harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with O. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit O. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف O. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-p-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "p-harfi-kurtce-erkek-isimleri",
      "en": "p-letter-kurdish-boy-names",
      "de": "p-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-p"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "P Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter P",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe P",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف P",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "P Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter P",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben P",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف P"
    },
    "descriptions": {
      "tr": "P harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with P. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit P. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف P. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-q-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "q-harfi-kurtce-erkek-isimleri",
      "en": "q-letter-kurdish-boy-names",
      "de": "q-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-q"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "Q Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter Q",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe Q",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف Q",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Q Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter Q",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben Q",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف Q"
    },
    "descriptions": {
      "tr": "Q harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with Q. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit Q. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف Q. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-r-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "r-harfi-kurtce-erkek-isimleri",
      "en": "r-letter-kurdish-boy-names",
      "de": "r-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-r"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "R Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter R",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe R",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف R",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "R Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter R",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben R",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف R"
    },
    "descriptions": {
      "tr": "R harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with R. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit R. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف R. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-s-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "s-harfi-kurtce-erkek-isimleri",
      "en": "s-letter-kurdish-boy-names",
      "de": "s-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-s"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "S Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter S",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe S",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف S",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "S Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter S",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben S",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف S"
    },
    "descriptions": {
      "tr": "S harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with S. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit S. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف S. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-ş-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "ş-harfi-kurtce-erkek-isimleri",
      "en": "ş-letter-kurdish-boy-names",
      "de": "ş-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-ş"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "Ş Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter Ş",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe Ş",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف Ş",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Ş Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter Ş",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben Ş",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف Ş"
    },
    "descriptions": {
      "tr": "Ş harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with Ş. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit Ş. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف Ş. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-t-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "t-harfi-kurtce-erkek-isimleri",
      "en": "t-letter-kurdish-boy-names",
      "de": "t-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-t"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "T Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter T",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe T",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف T",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "T Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter T",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben T",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف T"
    },
    "descriptions": {
      "tr": "T harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with T. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit T. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف T. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-v-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "v-harfi-kurtce-erkek-isimleri",
      "en": "v-letter-kurdish-boy-names",
      "de": "v-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-v"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "V Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter V",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe V",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف V",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "V Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter V",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben V",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف V"
    },
    "descriptions": {
      "tr": "V harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with V. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit V. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف V. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-w-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "w-harfi-kurtce-erkek-isimleri",
      "en": "w-letter-kurdish-boy-names",
      "de": "w-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-w"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "W Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter W",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe W",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف W",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "W Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter W",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben W",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف W"
    },
    "descriptions": {
      "tr": "W harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with W. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit W. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف W. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-x-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "x-harfi-kurtce-erkek-isimleri",
      "en": "x-letter-kurdish-boy-names",
      "de": "x-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-x"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "X Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter X",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe X",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف X",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "X Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter X",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben X",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف X"
    },
    "descriptions": {
      "tr": "X harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with X. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit X. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف X. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-y-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "y-harfi-kurtce-erkek-isimleri",
      "en": "y-letter-kurdish-boy-names",
      "de": "y-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-y"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "Y Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter Y",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe Y",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف Y",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Y Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter Y",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben Y",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف Y"
    },
    "descriptions": {
      "tr": "Y harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with Y. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit Y. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف Y. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-z-boy-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "z-harfi-kurtce-erkek-isimleri",
      "en": "z-letter-kurdish-boy-names",
      "de": "z-buchstabe-kurdische-jungennamen",
      "ar": "اسماء-اولاد-كردية-بحرف-z"
    },
    "tags": {
      "tr": [
        "Erkek İsimleri",
        "Z Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Boy Names",
        "Letter Z",
        "Kurdish Names"
      ],
      "de": [
        "Jungennamen",
        "Buchstabe Z",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء أولاد",
        "حرف Z",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Z Harfi İle Başlayan En Güzel Kürtçe Erkek İsimleri",
      "en": "Most Beautiful Kurdish Boy Names Starting with Letter Z",
      "de": "Die schönsten kurdischen Jungennamen mit dem Buchstaben Z",
      "ar": "أجمل أسماء الأولاد الكردية التي تبدأ بحرف Z"
    },
    "descriptions": {
      "tr": "Z harfi ile başlayan duyulmamış, modern ve anlamlı Kürtçe erkek isimleri listesi. Bebek bekleyen aileler için harika öneriler.",
      "en": "List of unique, modern, and meaningful Kurdish boy names starting with Z. Great suggestions for expecting families.",
      "de": "Liste seltener, moderner und bedeutungsvoller kurdischer Jungennamen beginnend mit Z. Tolle Vorschläge für werdende Familien.",
      "ar": "قائمة بأسماء أولاد كردية نادرة وحديثة وذات معنى تبدأ بحرف Z. اقتراحات رائعة للعائلات."
    }
  },
  {
    "id": "letter-a-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "a-harfi-kurtce-kiz-isimleri",
      "en": "a-letter-kurdish-girl-names",
      "de": "a-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-a"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "A Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter A",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe A",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف A",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "A Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter A",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben A",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف A"
    },
    "descriptions": {
      "tr": "A harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with A. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit A. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف A. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-b-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "b-harfi-kurtce-kiz-isimleri",
      "en": "b-letter-kurdish-girl-names",
      "de": "b-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-b"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "B Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter B",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe B",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف B",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "B Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter B",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben B",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف B"
    },
    "descriptions": {
      "tr": "B harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with B. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit B. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف B. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-c-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "c-harfi-kurtce-kiz-isimleri",
      "en": "c-letter-kurdish-girl-names",
      "de": "c-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-c"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "C Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter C",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe C",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف C",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "C Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter C",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben C",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف C"
    },
    "descriptions": {
      "tr": "C harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with C. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit C. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف C. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-ç-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "ç-harfi-kurtce-kiz-isimleri",
      "en": "ç-letter-kurdish-girl-names",
      "de": "ç-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-ç"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "Ç Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter Ç",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe Ç",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف Ç",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Ç Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter Ç",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben Ç",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف Ç"
    },
    "descriptions": {
      "tr": "Ç harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with Ç. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit Ç. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف Ç. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-d-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "d-harfi-kurtce-kiz-isimleri",
      "en": "d-letter-kurdish-girl-names",
      "de": "d-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-d"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "D Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter D",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe D",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف D",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "D Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter D",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben D",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف D"
    },
    "descriptions": {
      "tr": "D harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with D. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit D. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف D. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-e-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "e-harfi-kurtce-kiz-isimleri",
      "en": "e-letter-kurdish-girl-names",
      "de": "e-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-e"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "E Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter E",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe E",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف E",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "E Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter E",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben E",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف E"
    },
    "descriptions": {
      "tr": "E harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with E. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit E. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف E. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-ê-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "ê-harfi-kurtce-kiz-isimleri",
      "en": "ê-letter-kurdish-girl-names",
      "de": "ê-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-ê"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "Ê Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter Ê",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe Ê",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف Ê",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Ê Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter Ê",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben Ê",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف Ê"
    },
    "descriptions": {
      "tr": "Ê harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with Ê. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit Ê. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف Ê. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-f-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "f-harfi-kurtce-kiz-isimleri",
      "en": "f-letter-kurdish-girl-names",
      "de": "f-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-f"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "F Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter F",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe F",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف F",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "F Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter F",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben F",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف F"
    },
    "descriptions": {
      "tr": "F harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with F. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit F. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف F. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-g-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "g-harfi-kurtce-kiz-isimleri",
      "en": "g-letter-kurdish-girl-names",
      "de": "g-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-g"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "G Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter G",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe G",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف G",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "G Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter G",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben G",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف G"
    },
    "descriptions": {
      "tr": "G harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with G. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit G. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف G. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-h-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "h-harfi-kurtce-kiz-isimleri",
      "en": "h-letter-kurdish-girl-names",
      "de": "h-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-h"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "H Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter H",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe H",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف H",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "H Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter H",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben H",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف H"
    },
    "descriptions": {
      "tr": "H harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with H. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit H. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف H. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-j-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "j-harfi-kurtce-kiz-isimleri",
      "en": "j-letter-kurdish-girl-names",
      "de": "j-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-j"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "J Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter J",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe J",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف J",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "J Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter J",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben J",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف J"
    },
    "descriptions": {
      "tr": "J harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with J. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit J. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف J. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-k-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "k-harfi-kurtce-kiz-isimleri",
      "en": "k-letter-kurdish-girl-names",
      "de": "k-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-k"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "K Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter K",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe K",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف K",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "K Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter K",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben K",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف K"
    },
    "descriptions": {
      "tr": "K harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with K. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit K. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف K. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-l-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "l-harfi-kurtce-kiz-isimleri",
      "en": "l-letter-kurdish-girl-names",
      "de": "l-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-l"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "L Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter L",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe L",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف L",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "L Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter L",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben L",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف L"
    },
    "descriptions": {
      "tr": "L harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with L. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit L. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف L. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-m-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "m-harfi-kurtce-kiz-isimleri",
      "en": "m-letter-kurdish-girl-names",
      "de": "m-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-m"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "M Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter M",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe M",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف M",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "M Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter M",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben M",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف M"
    },
    "descriptions": {
      "tr": "M harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with M. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit M. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف M. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-n-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "n-harfi-kurtce-kiz-isimleri",
      "en": "n-letter-kurdish-girl-names",
      "de": "n-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-n"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "N Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter N",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe N",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف N",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "N Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter N",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben N",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف N"
    },
    "descriptions": {
      "tr": "N harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with N. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit N. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف N. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-p-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "p-harfi-kurtce-kiz-isimleri",
      "en": "p-letter-kurdish-girl-names",
      "de": "p-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-p"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "P Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter P",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe P",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف P",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "P Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter P",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben P",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف P"
    },
    "descriptions": {
      "tr": "P harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with P. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit P. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف P. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-r-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "r-harfi-kurtce-kiz-isimleri",
      "en": "r-letter-kurdish-girl-names",
      "de": "r-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-r"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "R Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter R",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe R",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف R",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "R Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter R",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben R",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف R"
    },
    "descriptions": {
      "tr": "R harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with R. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit R. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف R. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-s-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "s-harfi-kurtce-kiz-isimleri",
      "en": "s-letter-kurdish-girl-names",
      "de": "s-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-s"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "S Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter S",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe S",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف S",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "S Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter S",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben S",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف S"
    },
    "descriptions": {
      "tr": "S harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with S. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit S. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف S. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-ş-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "ş-harfi-kurtce-kiz-isimleri",
      "en": "ş-letter-kurdish-girl-names",
      "de": "ş-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-ş"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "Ş Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter Ş",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe Ş",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف Ş",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Ş Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter Ş",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben Ş",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف Ş"
    },
    "descriptions": {
      "tr": "Ş harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with Ş. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit Ş. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف Ş. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-t-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "t-harfi-kurtce-kiz-isimleri",
      "en": "t-letter-kurdish-girl-names",
      "de": "t-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-t"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "T Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter T",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe T",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف T",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "T Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter T",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben T",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف T"
    },
    "descriptions": {
      "tr": "T harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with T. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit T. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف T. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-v-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "v-harfi-kurtce-kiz-isimleri",
      "en": "v-letter-kurdish-girl-names",
      "de": "v-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-v"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "V Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter V",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe V",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف V",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "V Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter V",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben V",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف V"
    },
    "descriptions": {
      "tr": "V harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with V. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit V. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف V. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-w-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "w-harfi-kurtce-kiz-isimleri",
      "en": "w-letter-kurdish-girl-names",
      "de": "w-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-w"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "W Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter W",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe W",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف W",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "W Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter W",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben W",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف W"
    },
    "descriptions": {
      "tr": "W harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with W. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit W. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف W. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-x-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "x-harfi-kurtce-kiz-isimleri",
      "en": "x-letter-kurdish-girl-names",
      "de": "x-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-x"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "X Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter X",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe X",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف X",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "X Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter X",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben X",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف X"
    },
    "descriptions": {
      "tr": "X harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with X. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit X. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف X. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-y-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "y-harfi-kurtce-kiz-isimleri",
      "en": "y-letter-kurdish-girl-names",
      "de": "y-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-y"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "Y Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter Y",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe Y",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف Y",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Y Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter Y",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben Y",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف Y"
    },
    "descriptions": {
      "tr": "Y harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with Y. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit Y. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف Y. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "letter-z-girl-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "z-harfi-kurtce-kiz-isimleri",
      "en": "z-letter-kurdish-girl-names",
      "de": "z-buchstabe-kurdische-maedchennamen",
      "ar": "اسماء-بنات-كردية-بحرف-z"
    },
    "tags": {
      "tr": [
        "Kız İsimleri",
        "Z Harfi",
        "Kürtçe İsimler"
      ],
      "en": [
        "Girl Names",
        "Letter Z",
        "Kurdish Names"
      ],
      "de": [
        "Mädchennamen",
        "Buchstabe Z",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء بنات",
        "حرف Z",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "Z Harfi İle Başlayan En Güzel Kürtçe Kız İsimleri",
      "en": "Most Beautiful Kurdish Girl Names Starting with Letter Z",
      "de": "Die schönsten kurdischen Mädchennamen mit dem Buchstaben Z",
      "ar": "أجمل أسماء البنات الكردية التي تبدأ بحرف Z"
    },
    "descriptions": {
      "tr": "Z harfi ile başlayan narin, modern ve anlamlı Kürtçe kız isimleri listesi. Bebeğinize özel isim önerileri.",
      "en": "List of delicate, modern, and meaningful Kurdish girl names starting with Z. Special name suggestions for your baby.",
      "de": "Liste zarter, moderner und bedeutungsvoller kurdischer Mädchennamen beginnend mit Z. Besondere Namensvorschläge für Ihr Baby.",
      "ar": "قائمة بأسماء بنات كردية رقيقة وحديثة وذات معنى تبدأ بحرف Z. اقتراحات أسماء خاصة لطفلتك."
    }
  },
  {
    "id": "length-3-male-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "3-harfli-kurtce-male-isimleri",
      "en": "3-letter-kurdish-male-names",
      "de": "3-buchstaben-kurdische-male-namen",
      "ar": "اسماء-male-كردية-من-3-حروف"
    },
    "tags": {
      "tr": [
        "3 Harfli İsimler",
        "Kısa İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "3-Letter Names",
        "Short Names",
        "Kurdish Names"
      ],
      "de": [
        "3-Buchstaben Namen",
        "Kurze Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء من 3 حروف",
        "أسماء قصيرة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "3 Harfli Kısa ve Öz Kürtçe Erkek İsimleri",
      "en": "3-Letter Short and Sweet Kurdish Boy Names",
      "de": "3-Buchstaben Kurze und Süße Kurdische Jungennamen",
      "ar": "أسماء أولاد كردية قصيرة وجميلة من 3 حروف"
    },
    "descriptions": {
      "tr": "3 harften oluşan, modern, kolay telaffuz edilen ve estetik duran Kürtçe erkek isimleri listesi.",
      "en": "A list of 3-letter Kurdish boy names that are modern, easy to pronounce, and aesthetic.",
      "de": "Eine Liste von 3-buchstabigen kurdischen jungennamen, die modern, leicht auszusprechen und ästhetisch sind.",
      "ar": "قائمة بأسماء أولاد كردية مكونة من 3 حروف، حديثة وسهلة النطق وذات جمالية."
    }
  },
  {
    "id": "length-3-female-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "3-harfli-kurtce-female-isimleri",
      "en": "3-letter-kurdish-female-names",
      "de": "3-buchstaben-kurdische-female-namen",
      "ar": "اسماء-female-كردية-من-3-حروف"
    },
    "tags": {
      "tr": [
        "3 Harfli İsimler",
        "Kısa İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "3-Letter Names",
        "Short Names",
        "Kurdish Names"
      ],
      "de": [
        "3-Buchstaben Namen",
        "Kurze Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء من 3 حروف",
        "أسماء قصيرة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "3 Harfli Kısa ve Öz Kürtçe Kız İsimleri",
      "en": "3-Letter Short and Sweet Kurdish Girl Names",
      "de": "3-Buchstaben Kurze und Süße Kurdische Mädchennamen",
      "ar": "أسماء بنات كردية قصيرة وجميلة من 3 حروف"
    },
    "descriptions": {
      "tr": "3 harften oluşan, modern, kolay telaffuz edilen ve estetik duran Kürtçe kız isimleri listesi.",
      "en": "A list of 3-letter Kurdish girl names that are modern, easy to pronounce, and aesthetic.",
      "de": "Eine Liste von 3-buchstabigen kurdischen mädchennamen, die modern, leicht auszusprechen und ästhetisch sind.",
      "ar": "قائمة بأسماء بنات كردية مكونة من 3 حروف، حديثة وسهلة النطق وذات جمالية."
    }
  },
  {
    "id": "length-4-male-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "4-harfli-kurtce-male-isimleri",
      "en": "4-letter-kurdish-male-names",
      "de": "4-buchstaben-kurdische-male-namen",
      "ar": "اسماء-male-كردية-من-4-حروف"
    },
    "tags": {
      "tr": [
        "4 Harfli İsimler",
        "Kısa İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "4-Letter Names",
        "Short Names",
        "Kurdish Names"
      ],
      "de": [
        "4-Buchstaben Namen",
        "Kurze Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء من 4 حروف",
        "أسماء قصيرة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "4 Harfli Kısa ve Öz Kürtçe Erkek İsimleri",
      "en": "4-Letter Short and Sweet Kurdish Boy Names",
      "de": "4-Buchstaben Kurze und Süße Kurdische Jungennamen",
      "ar": "أسماء أولاد كردية قصيرة وجميلة من 4 حروف"
    },
    "descriptions": {
      "tr": "4 harften oluşan, modern, kolay telaffuz edilen ve estetik duran Kürtçe erkek isimleri listesi.",
      "en": "A list of 4-letter Kurdish boy names that are modern, easy to pronounce, and aesthetic.",
      "de": "Eine Liste von 4-buchstabigen kurdischen jungennamen, die modern, leicht auszusprechen und ästhetisch sind.",
      "ar": "قائمة بأسماء أولاد كردية مكونة من 4 حروف، حديثة وسهلة النطق وذات جمالية."
    }
  },
  {
    "id": "length-4-female-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "4-harfli-kurtce-female-isimleri",
      "en": "4-letter-kurdish-female-names",
      "de": "4-buchstaben-kurdische-female-namen",
      "ar": "اسماء-female-كردية-من-4-حروف"
    },
    "tags": {
      "tr": [
        "4 Harfli İsimler",
        "Kısa İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "4-Letter Names",
        "Short Names",
        "Kurdish Names"
      ],
      "de": [
        "4-Buchstaben Namen",
        "Kurze Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء من 4 حروف",
        "أسماء قصيرة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "4 Harfli Kısa ve Öz Kürtçe Kız İsimleri",
      "en": "4-Letter Short and Sweet Kurdish Girl Names",
      "de": "4-Buchstaben Kurze und Süße Kurdische Mädchennamen",
      "ar": "أسماء بنات كردية قصيرة وجميلة من 4 حروف"
    },
    "descriptions": {
      "tr": "4 harften oluşan, modern, kolay telaffuz edilen ve estetik duran Kürtçe kız isimleri listesi.",
      "en": "A list of 4-letter Kurdish girl names that are modern, easy to pronounce, and aesthetic.",
      "de": "Eine Liste von 4-buchstabigen kurdischen mädchennamen, die modern, leicht auszusprechen und ästhetisch sind.",
      "ar": "قائمة بأسماء بنات كردية مكونة من 4 حروف، حديثة وسهلة النطق وذات جمالية."
    }
  },
  {
    "id": "length-5-male-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "5-harfli-kurtce-male-isimleri",
      "en": "5-letter-kurdish-male-names",
      "de": "5-buchstaben-kurdische-male-namen",
      "ar": "اسماء-male-كردية-من-5-حروف"
    },
    "tags": {
      "tr": [
        "5 Harfli İsimler",
        "Kısa İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "5-Letter Names",
        "Short Names",
        "Kurdish Names"
      ],
      "de": [
        "5-Buchstaben Namen",
        "Kurze Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء من 5 حروف",
        "أسماء قصيرة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "5 Harfli Kısa ve Öz Kürtçe Erkek İsimleri",
      "en": "5-Letter Short and Sweet Kurdish Boy Names",
      "de": "5-Buchstaben Kurze und Süße Kurdische Jungennamen",
      "ar": "أسماء أولاد كردية قصيرة وجميلة من 5 حروف"
    },
    "descriptions": {
      "tr": "5 harften oluşan, modern, kolay telaffuz edilen ve estetik duran Kürtçe erkek isimleri listesi.",
      "en": "A list of 5-letter Kurdish boy names that are modern, easy to pronounce, and aesthetic.",
      "de": "Eine Liste von 5-buchstabigen kurdischen jungennamen, die modern, leicht auszusprechen und ästhetisch sind.",
      "ar": "قائمة بأسماء أولاد كردية مكونة من 5 حروف، حديثة وسهلة النطق وذات جمالية."
    }
  },
  {
    "id": "length-5-female-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "5-harfli-kurtce-female-isimleri",
      "en": "5-letter-kurdish-female-names",
      "de": "5-buchstaben-kurdische-female-namen",
      "ar": "اسماء-female-كردية-من-5-حروف"
    },
    "tags": {
      "tr": [
        "5 Harfli İsimler",
        "Kısa İsimler",
        "Kürtçe İsimler"
      ],
      "en": [
        "5-Letter Names",
        "Short Names",
        "Kurdish Names"
      ],
      "de": [
        "5-Buchstaben Namen",
        "Kurze Namen",
        "Kurdische Namen"
      ],
      "ar": [
        "أسماء من 5 حروف",
        "أسماء قصيرة",
        "أسماء كردية"
      ]
    },
    "titles": {
      "tr": "5 Harfli Kısa ve Öz Kürtçe Kız İsimleri",
      "en": "5-Letter Short and Sweet Kurdish Girl Names",
      "de": "5-Buchstaben Kurze und Süße Kurdische Mädchennamen",
      "ar": "أسماء بنات كردية قصيرة وجميلة من 5 حروف"
    },
    "descriptions": {
      "tr": "5 harften oluşan, modern, kolay telaffuz edilen ve estetik duran Kürtçe kız isimleri listesi.",
      "en": "A list of 5-letter Kurdish girl names that are modern, easy to pronounce, and aesthetic.",
      "de": "Eine Liste von 5-buchstabigen kurdischen mädchennamen, die modern, leicht auszusprechen und ästhetisch sind.",
      "ar": "قائمة بأسماء بنات كردية مكونة من 5 حروف، حديثة وسهلة النطق وذات جمالية."
    }
  },
  {
    "id": "theme-nature-male-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "nature-temali-kurtce-male-isimleri",
      "en": "nature-themed-kurdish-male-names",
      "de": "nature-thema-kurdische-male-namen",
      "ar": "اسماء-male-كردية-nature"
    },
    "tags": {
      "tr": [
        "Doğa Temalı",
        "Kürtçe İsimler",
        "Erkek"
      ],
      "en": [
        "Nature Themed",
        "Kurdish Names",
        "Boy"
      ],
      "de": [
        "Naturbezogene",
        "Kurdische Namen",
        "Jungen"
      ],
      "ar": [
        "مستوحاة من الطبيعة",
        "أسماء كردية",
        "أولاد"
      ]
    },
    "titles": {
      "tr": "Doğa Temalı Kürtçe Erkek İsimleri",
      "en": "Nature Themed Kurdish Boy Names",
      "de": "Naturbezogene Kurdische Jungennamen",
      "ar": "أسماء أولاد كردية مستوحاة من الطبيعة"
    },
    "descriptions": {
      "tr": "Doğa Temalı en anlamlı ve özel Kürtçe erkek isimlerini keşfedin.",
      "en": "Discover the most meaningful and special nature themed Kurdish boy names.",
      "de": "Entdecken Sie die bedeutungsvollsten und besonderen naturbezogene kurdischen jungennamen.",
      "ar": "اكتشف أكثر أسماء الـ أولاد الكردية مستوحاة من الطبيعة معنى وخصوصية."
    }
  },
  {
    "id": "theme-nature-female-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "nature-temali-kurtce-female-isimleri",
      "en": "nature-themed-kurdish-female-names",
      "de": "nature-thema-kurdische-female-namen",
      "ar": "اسماء-female-كردية-nature"
    },
    "tags": {
      "tr": [
        "Doğa Temalı",
        "Kürtçe İsimler",
        "Kız"
      ],
      "en": [
        "Nature Themed",
        "Kurdish Names",
        "Girl"
      ],
      "de": [
        "Naturbezogene",
        "Kurdische Namen",
        "Mädchen"
      ],
      "ar": [
        "مستوحاة من الطبيعة",
        "أسماء كردية",
        "بنات"
      ]
    },
    "titles": {
      "tr": "Doğa Temalı Kürtçe Kız İsimleri",
      "en": "Nature Themed Kurdish Girl Names",
      "de": "Naturbezogene Kurdische Mädchennamen",
      "ar": "أسماء بنات كردية مستوحاة من الطبيعة"
    },
    "descriptions": {
      "tr": "Doğa Temalı en anlamlı ve özel Kürtçe kız isimlerini keşfedin.",
      "en": "Discover the most meaningful and special nature themed Kurdish girl names.",
      "de": "Entdecken Sie die bedeutungsvollsten und besonderen naturbezogene kurdischen mädchennamen.",
      "ar": "اكتشف أكثر أسماء الـ بنات الكردية مستوحاة من الطبيعة معنى وخصوصية."
    }
  },
  {
    "id": "theme-power-male-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "power-temali-kurtce-male-isimleri",
      "en": "power-themed-kurdish-male-names",
      "de": "power-thema-kurdische-male-namen",
      "ar": "اسماء-male-كردية-power"
    },
    "tags": {
      "tr": [
        "Güç ve Cesaret Temalı",
        "Kürtçe İsimler",
        "Erkek"
      ],
      "en": [
        "Power and Courage Themed",
        "Kurdish Names",
        "Boy"
      ],
      "de": [
        "Macht- und Mutbezogene",
        "Kurdische Namen",
        "Jungen"
      ],
      "ar": [
        "مستوحاة من القوة والشجاعة",
        "أسماء كردية",
        "أولاد"
      ]
    },
    "titles": {
      "tr": "Güç ve Cesaret Temalı Kürtçe Erkek İsimleri",
      "en": "Power and Courage Themed Kurdish Boy Names",
      "de": "Macht- und Mutbezogene Kurdische Jungennamen",
      "ar": "أسماء أولاد كردية مستوحاة من القوة والشجاعة"
    },
    "descriptions": {
      "tr": "Güç ve Cesaret Temalı en anlamlı ve özel Kürtçe erkek isimlerini keşfedin.",
      "en": "Discover the most meaningful and special power and courage themed Kurdish boy names.",
      "de": "Entdecken Sie die bedeutungsvollsten und besonderen macht- und mutbezogene kurdischen jungennamen.",
      "ar": "اكتشف أكثر أسماء الـ أولاد الكردية مستوحاة من القوة والشجاعة معنى وخصوصية."
    }
  },
  {
    "id": "theme-power-female-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "power-temali-kurtce-female-isimleri",
      "en": "power-themed-kurdish-female-names",
      "de": "power-thema-kurdische-female-namen",
      "ar": "اسماء-female-كردية-power"
    },
    "tags": {
      "tr": [
        "Güç ve Cesaret Temalı",
        "Kürtçe İsimler",
        "Kız"
      ],
      "en": [
        "Power and Courage Themed",
        "Kurdish Names",
        "Girl"
      ],
      "de": [
        "Macht- und Mutbezogene",
        "Kurdische Namen",
        "Mädchen"
      ],
      "ar": [
        "مستوحاة من القوة والشجاعة",
        "أسماء كردية",
        "بنات"
      ]
    },
    "titles": {
      "tr": "Güç ve Cesaret Temalı Kürtçe Kız İsimleri",
      "en": "Power and Courage Themed Kurdish Girl Names",
      "de": "Macht- und Mutbezogene Kurdische Mädchennamen",
      "ar": "أسماء بنات كردية مستوحاة من القوة والشجاعة"
    },
    "descriptions": {
      "tr": "Güç ve Cesaret Temalı en anlamlı ve özel Kürtçe kız isimlerini keşfedin.",
      "en": "Discover the most meaningful and special power and courage themed Kurdish girl names.",
      "de": "Entdecken Sie die bedeutungsvollsten und besonderen macht- und mutbezogene kurdischen mädchennamen.",
      "ar": "اكتشف أكثر أسماء الـ بنات الكردية مستوحاة من القوة والشجاعة معنى وخصوصية."
    }
  },
  {
    "id": "theme-beauty-male-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "beauty-temali-kurtce-male-isimleri",
      "en": "beauty-themed-kurdish-male-names",
      "de": "beauty-thema-kurdische-male-namen",
      "ar": "اسماء-male-كردية-beauty"
    },
    "tags": {
      "tr": [
        "Güzellik Temalı",
        "Kürtçe İsimler",
        "Erkek"
      ],
      "en": [
        "Beauty Themed",
        "Kurdish Names",
        "Boy"
      ],
      "de": [
        "Schönheitsbezogene",
        "Kurdische Namen",
        "Jungen"
      ],
      "ar": [
        "مستوحاة من الجمال",
        "أسماء كردية",
        "أولاد"
      ]
    },
    "titles": {
      "tr": "Güzellik Temalı Kürtçe Erkek İsimleri",
      "en": "Beauty Themed Kurdish Boy Names",
      "de": "Schönheitsbezogene Kurdische Jungennamen",
      "ar": "أسماء أولاد كردية مستوحاة من الجمال"
    },
    "descriptions": {
      "tr": "Güzellik Temalı en anlamlı ve özel Kürtçe erkek isimlerini keşfedin.",
      "en": "Discover the most meaningful and special beauty themed Kurdish boy names.",
      "de": "Entdecken Sie die bedeutungsvollsten und besonderen schönheitsbezogene kurdischen jungennamen.",
      "ar": "اكتشف أكثر أسماء الـ أولاد الكردية مستوحاة من الجمال معنى وخصوصية."
    }
  },
  {
    "id": "theme-beauty-female-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "beauty-temali-kurtce-female-isimleri",
      "en": "beauty-themed-kurdish-female-names",
      "de": "beauty-thema-kurdische-female-namen",
      "ar": "اسماء-female-كردية-beauty"
    },
    "tags": {
      "tr": [
        "Güzellik Temalı",
        "Kürtçe İsimler",
        "Kız"
      ],
      "en": [
        "Beauty Themed",
        "Kurdish Names",
        "Girl"
      ],
      "de": [
        "Schönheitsbezogene",
        "Kurdische Namen",
        "Mädchen"
      ],
      "ar": [
        "مستوحاة من الجمال",
        "أسماء كردية",
        "بنات"
      ]
    },
    "titles": {
      "tr": "Güzellik Temalı Kürtçe Kız İsimleri",
      "en": "Beauty Themed Kurdish Girl Names",
      "de": "Schönheitsbezogene Kurdische Mädchennamen",
      "ar": "أسماء بنات كردية مستوحاة من الجمال"
    },
    "descriptions": {
      "tr": "Güzellik Temalı en anlamlı ve özel Kürtçe kız isimlerini keşfedin.",
      "en": "Discover the most meaningful and special beauty themed Kurdish girl names.",
      "de": "Entdecken Sie die bedeutungsvollsten und besonderen schönheitsbezogene kurdischen mädchennamen.",
      "ar": "اكتشف أكثر أسماء الـ بنات الكردية مستوحاة من الجمال معنى وخصوصية."
    }
  },
  {
    "id": "theme-light-male-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "light-temali-kurtce-male-isimleri",
      "en": "light-themed-kurdish-male-names",
      "de": "light-thema-kurdische-male-namen",
      "ar": "اسماء-male-كردية-light"
    },
    "tags": {
      "tr": [
        "Işık ve Umut Temalı",
        "Kürtçe İsimler",
        "Erkek"
      ],
      "en": [
        "Light and Hope Themed",
        "Kurdish Names",
        "Boy"
      ],
      "de": [
        "Licht- und Hoffnungsbezogene",
        "Kurdische Namen",
        "Jungen"
      ],
      "ar": [
        "مستوحاة من النور والأمل",
        "أسماء كردية",
        "أولاد"
      ]
    },
    "titles": {
      "tr": "Işık ve Umut Temalı Kürtçe Erkek İsimleri",
      "en": "Light and Hope Themed Kurdish Boy Names",
      "de": "Licht- und Hoffnungsbezogene Kurdische Jungennamen",
      "ar": "أسماء أولاد كردية مستوحاة من النور والأمل"
    },
    "descriptions": {
      "tr": "Işık ve Umut Temalı en anlamlı ve özel Kürtçe erkek isimlerini keşfedin.",
      "en": "Discover the most meaningful and special light and hope themed Kurdish boy names.",
      "de": "Entdecken Sie die bedeutungsvollsten und besonderen licht- und hoffnungsbezogene kurdischen jungennamen.",
      "ar": "اكتشف أكثر أسماء الـ أولاد الكردية مستوحاة من النور والأمل معنى وخصوصية."
    }
  },
  {
    "id": "theme-light-female-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "light-temali-kurtce-female-isimleri",
      "en": "light-themed-kurdish-female-names",
      "de": "light-thema-kurdische-female-namen",
      "ar": "اسماء-female-كردية-light"
    },
    "tags": {
      "tr": [
        "Işık ve Umut Temalı",
        "Kürtçe İsimler",
        "Kız"
      ],
      "en": [
        "Light and Hope Themed",
        "Kurdish Names",
        "Girl"
      ],
      "de": [
        "Licht- und Hoffnungsbezogene",
        "Kurdische Namen",
        "Mädchen"
      ],
      "ar": [
        "مستوحاة من النور والأمل",
        "أسماء كردية",
        "بنات"
      ]
    },
    "titles": {
      "tr": "Işık ve Umut Temalı Kürtçe Kız İsimleri",
      "en": "Light and Hope Themed Kurdish Girl Names",
      "de": "Licht- und Hoffnungsbezogene Kurdische Mädchennamen",
      "ar": "أسماء بنات كردية مستوحاة من النور والأمل"
    },
    "descriptions": {
      "tr": "Işık ve Umut Temalı en anlamlı ve özel Kürtçe kız isimlerini keşfedin.",
      "en": "Discover the most meaningful and special light and hope themed Kurdish girl names.",
      "de": "Entdecken Sie die bedeutungsvollsten und besonderen licht- und hoffnungsbezogene kurdischen mädchennamen.",
      "ar": "اكتشف أكثر أسماء الـ بنات الكردية مستوحاة من النور والأمل معنى وخصوصية."
    }
  },
  {
    "id": "theme-wisdom-male-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "wisdom-temali-kurtce-male-isimleri",
      "en": "wisdom-themed-kurdish-male-names",
      "de": "wisdom-thema-kurdische-male-namen",
      "ar": "اسماء-male-كردية-wisdom"
    },
    "tags": {
      "tr": [
        "Bilgelik Temalı",
        "Kürtçe İsimler",
        "Erkek"
      ],
      "en": [
        "Wisdom Themed",
        "Kurdish Names",
        "Boy"
      ],
      "de": [
        "Weisheitsbezogene",
        "Kurdische Namen",
        "Jungen"
      ],
      "ar": [
        "مستوحاة من الحكمة",
        "أسماء كردية",
        "أولاد"
      ]
    },
    "titles": {
      "tr": "Bilgelik Temalı Kürtçe Erkek İsimleri",
      "en": "Wisdom Themed Kurdish Boy Names",
      "de": "Weisheitsbezogene Kurdische Jungennamen",
      "ar": "أسماء أولاد كردية مستوحاة من الحكمة"
    },
    "descriptions": {
      "tr": "Bilgelik Temalı en anlamlı ve özel Kürtçe erkek isimlerini keşfedin.",
      "en": "Discover the most meaningful and special wisdom themed Kurdish boy names.",
      "de": "Entdecken Sie die bedeutungsvollsten und besonderen weisheitsbezogene kurdischen jungennamen.",
      "ar": "اكتشف أكثر أسماء الـ أولاد الكردية مستوحاة من الحكمة معنى وخصوصية."
    }
  },
  {
    "id": "theme-wisdom-female-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "wisdom-temali-kurtce-female-isimleri",
      "en": "wisdom-themed-kurdish-female-names",
      "de": "wisdom-thema-kurdische-female-namen",
      "ar": "اسماء-female-كردية-wisdom"
    },
    "tags": {
      "tr": [
        "Bilgelik Temalı",
        "Kürtçe İsimler",
        "Kız"
      ],
      "en": [
        "Wisdom Themed",
        "Kurdish Names",
        "Girl"
      ],
      "de": [
        "Weisheitsbezogene",
        "Kurdische Namen",
        "Mädchen"
      ],
      "ar": [
        "مستوحاة من الحكمة",
        "أسماء كردية",
        "بنات"
      ]
    },
    "titles": {
      "tr": "Bilgelik Temalı Kürtçe Kız İsimleri",
      "en": "Wisdom Themed Kurdish Girl Names",
      "de": "Weisheitsbezogene Kurdische Mädchennamen",
      "ar": "أسماء بنات كردية مستوحاة من الحكمة"
    },
    "descriptions": {
      "tr": "Bilgelik Temalı en anlamlı ve özel Kürtçe kız isimlerini keşfedin.",
      "en": "Discover the most meaningful and special wisdom themed Kurdish girl names.",
      "de": "Entdecken Sie die bedeutungsvollsten und besonderen weisheitsbezogene kurdischen mädchennamen.",
      "ar": "اكتشف أكثر أسماء الـ بنات الكردية مستوحاة من الحكمة معنى وخصوصية."
    }
  },
  {
    "id": "letter-a-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "a-harfi-kurtce-isimler-rehberi",
      "en": "a-letter-kurdish-names-guide",
      "de": "a-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-a"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "A Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter A"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe A"
      ],
      "ar": [
        "أسماء كردية",
        "حرف A"
      ]
    },
    "titles": {
      "tr": "A Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter A",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben A",
      "ar": "أسماء كردية فريدة تبدأ بحرف A"
    },
    "descriptions": {
      "tr": "A harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with A. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit A. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف A. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-b-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "b-harfi-kurtce-isimler-rehberi",
      "en": "b-letter-kurdish-names-guide",
      "de": "b-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-b"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "B Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter B"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe B"
      ],
      "ar": [
        "أسماء كردية",
        "حرف B"
      ]
    },
    "titles": {
      "tr": "B Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter B",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben B",
      "ar": "أسماء كردية فريدة تبدأ بحرف B"
    },
    "descriptions": {
      "tr": "B harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with B. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit B. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف B. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-c-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "c-harfi-kurtce-isimler-rehberi",
      "en": "c-letter-kurdish-names-guide",
      "de": "c-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-c"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "C Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter C"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe C"
      ],
      "ar": [
        "أسماء كردية",
        "حرف C"
      ]
    },
    "titles": {
      "tr": "C Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter C",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben C",
      "ar": "أسماء كردية فريدة تبدأ بحرف C"
    },
    "descriptions": {
      "tr": "C harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with C. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit C. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف C. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-d-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "d-harfi-kurtce-isimler-rehberi",
      "en": "d-letter-kurdish-names-guide",
      "de": "d-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-d"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "D Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter D"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe D"
      ],
      "ar": [
        "أسماء كردية",
        "حرف D"
      ]
    },
    "titles": {
      "tr": "D Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter D",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben D",
      "ar": "أسماء كردية فريدة تبدأ بحرف D"
    },
    "descriptions": {
      "tr": "D harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with D. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit D. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف D. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-e-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "e-harfi-kurtce-isimler-rehberi",
      "en": "e-letter-kurdish-names-guide",
      "de": "e-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-e"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "E Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter E"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe E"
      ],
      "ar": [
        "أسماء كردية",
        "حرف E"
      ]
    },
    "titles": {
      "tr": "E Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter E",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben E",
      "ar": "أسماء كردية فريدة تبدأ بحرف E"
    },
    "descriptions": {
      "tr": "E harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with E. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit E. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف E. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-f-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "f-harfi-kurtce-isimler-rehberi",
      "en": "f-letter-kurdish-names-guide",
      "de": "f-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-f"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "F Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter F"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe F"
      ],
      "ar": [
        "أسماء كردية",
        "حرف F"
      ]
    },
    "titles": {
      "tr": "F Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter F",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben F",
      "ar": "أسماء كردية فريدة تبدأ بحرف F"
    },
    "descriptions": {
      "tr": "F harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with F. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit F. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف F. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-g-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "g-harfi-kurtce-isimler-rehberi",
      "en": "g-letter-kurdish-names-guide",
      "de": "g-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-g"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "G Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter G"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe G"
      ],
      "ar": [
        "أسماء كردية",
        "حرف G"
      ]
    },
    "titles": {
      "tr": "G Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter G",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben G",
      "ar": "أسماء كردية فريدة تبدأ بحرف G"
    },
    "descriptions": {
      "tr": "G harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with G. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit G. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف G. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-h-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "h-harfi-kurtce-isimler-rehberi",
      "en": "h-letter-kurdish-names-guide",
      "de": "h-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-h"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "H Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter H"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe H"
      ],
      "ar": [
        "أسماء كردية",
        "حرف H"
      ]
    },
    "titles": {
      "tr": "H Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter H",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben H",
      "ar": "أسماء كردية فريدة تبدأ بحرف H"
    },
    "descriptions": {
      "tr": "H harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with H. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit H. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف H. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-j-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "j-harfi-kurtce-isimler-rehberi",
      "en": "j-letter-kurdish-names-guide",
      "de": "j-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-j"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "J Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter J"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe J"
      ],
      "ar": [
        "أسماء كردية",
        "حرف J"
      ]
    },
    "titles": {
      "tr": "J Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter J",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben J",
      "ar": "أسماء كردية فريدة تبدأ بحرف J"
    },
    "descriptions": {
      "tr": "J harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with J. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit J. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف J. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-k-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "k-harfi-kurtce-isimler-rehberi",
      "en": "k-letter-kurdish-names-guide",
      "de": "k-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-k"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "K Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter K"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe K"
      ],
      "ar": [
        "أسماء كردية",
        "حرف K"
      ]
    },
    "titles": {
      "tr": "K Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter K",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben K",
      "ar": "أسماء كردية فريدة تبدأ بحرف K"
    },
    "descriptions": {
      "tr": "K harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with K. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit K. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف K. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-l-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "l-harfi-kurtce-isimler-rehberi",
      "en": "l-letter-kurdish-names-guide",
      "de": "l-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-l"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "L Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter L"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe L"
      ],
      "ar": [
        "أسماء كردية",
        "حرف L"
      ]
    },
    "titles": {
      "tr": "L Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter L",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben L",
      "ar": "أسماء كردية فريدة تبدأ بحرف L"
    },
    "descriptions": {
      "tr": "L harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with L. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit L. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف L. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-m-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "m-harfi-kurtce-isimler-rehberi",
      "en": "m-letter-kurdish-names-guide",
      "de": "m-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-m"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "M Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter M"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe M"
      ],
      "ar": [
        "أسماء كردية",
        "حرف M"
      ]
    },
    "titles": {
      "tr": "M Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter M",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben M",
      "ar": "أسماء كردية فريدة تبدأ بحرف M"
    },
    "descriptions": {
      "tr": "M harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with M. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit M. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف M. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-n-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "n-harfi-kurtce-isimler-rehberi",
      "en": "n-letter-kurdish-names-guide",
      "de": "n-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-n"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "N Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter N"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe N"
      ],
      "ar": [
        "أسماء كردية",
        "حرف N"
      ]
    },
    "titles": {
      "tr": "N Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter N",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben N",
      "ar": "أسماء كردية فريدة تبدأ بحرف N"
    },
    "descriptions": {
      "tr": "N harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with N. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit N. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف N. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-o-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "o-harfi-kurtce-isimler-rehberi",
      "en": "o-letter-kurdish-names-guide",
      "de": "o-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-o"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "O Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter O"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe O"
      ],
      "ar": [
        "أسماء كردية",
        "حرف O"
      ]
    },
    "titles": {
      "tr": "O Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter O",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben O",
      "ar": "أسماء كردية فريدة تبدأ بحرف O"
    },
    "descriptions": {
      "tr": "O harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with O. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit O. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف O. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-p-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "p-harfi-kurtce-isimler-rehberi",
      "en": "p-letter-kurdish-names-guide",
      "de": "p-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-p"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "P Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter P"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe P"
      ],
      "ar": [
        "أسماء كردية",
        "حرف P"
      ]
    },
    "titles": {
      "tr": "P Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter P",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben P",
      "ar": "أسماء كردية فريدة تبدأ بحرف P"
    },
    "descriptions": {
      "tr": "P harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with P. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit P. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف P. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-q-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "q-harfi-kurtce-isimler-rehberi",
      "en": "q-letter-kurdish-names-guide",
      "de": "q-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-q"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "Q Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter Q"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe Q"
      ],
      "ar": [
        "أسماء كردية",
        "حرف Q"
      ]
    },
    "titles": {
      "tr": "Q Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter Q",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben Q",
      "ar": "أسماء كردية فريدة تبدأ بحرف Q"
    },
    "descriptions": {
      "tr": "Q harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with Q. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit Q. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف Q. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-r-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "r-harfi-kurtce-isimler-rehberi",
      "en": "r-letter-kurdish-names-guide",
      "de": "r-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-r"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "R Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter R"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe R"
      ],
      "ar": [
        "أسماء كردية",
        "حرف R"
      ]
    },
    "titles": {
      "tr": "R Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter R",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben R",
      "ar": "أسماء كردية فريدة تبدأ بحرف R"
    },
    "descriptions": {
      "tr": "R harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with R. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit R. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف R. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-s-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "s-harfi-kurtce-isimler-rehberi",
      "en": "s-letter-kurdish-names-guide",
      "de": "s-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-s"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "S Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter S"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe S"
      ],
      "ar": [
        "أسماء كردية",
        "حرف S"
      ]
    },
    "titles": {
      "tr": "S Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter S",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben S",
      "ar": "أسماء كردية فريدة تبدأ بحرف S"
    },
    "descriptions": {
      "tr": "S harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with S. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit S. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف S. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-t-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "t-harfi-kurtce-isimler-rehberi",
      "en": "t-letter-kurdish-names-guide",
      "de": "t-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-t"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "T Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter T"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe T"
      ],
      "ar": [
        "أسماء كردية",
        "حرف T"
      ]
    },
    "titles": {
      "tr": "T Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter T",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben T",
      "ar": "أسماء كردية فريدة تبدأ بحرف T"
    },
    "descriptions": {
      "tr": "T harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with T. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit T. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف T. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-u-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "u-harfi-kurtce-isimler-rehberi",
      "en": "u-letter-kurdish-names-guide",
      "de": "u-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-u"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "U Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter U"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe U"
      ],
      "ar": [
        "أسماء كردية",
        "حرف U"
      ]
    },
    "titles": {
      "tr": "U Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter U",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben U",
      "ar": "أسماء كردية فريدة تبدأ بحرف U"
    },
    "descriptions": {
      "tr": "U harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with U. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit U. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف U. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-v-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "v-harfi-kurtce-isimler-rehberi",
      "en": "v-letter-kurdish-names-guide",
      "de": "v-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-v"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "V Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter V"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe V"
      ],
      "ar": [
        "أسماء كردية",
        "حرف V"
      ]
    },
    "titles": {
      "tr": "V Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter V",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben V",
      "ar": "أسماء كردية فريدة تبدأ بحرف V"
    },
    "descriptions": {
      "tr": "V harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with V. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit V. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف V. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-w-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "w-harfi-kurtce-isimler-rehberi",
      "en": "w-letter-kurdish-names-guide",
      "de": "w-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-w"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "W Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter W"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe W"
      ],
      "ar": [
        "أسماء كردية",
        "حرف W"
      ]
    },
    "titles": {
      "tr": "W Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter W",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben W",
      "ar": "أسماء كردية فريدة تبدأ بحرف W"
    },
    "descriptions": {
      "tr": "W harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with W. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit W. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف W. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-x-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "x-harfi-kurtce-isimler-rehberi",
      "en": "x-letter-kurdish-names-guide",
      "de": "x-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-x"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "X Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter X"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe X"
      ],
      "ar": [
        "أسماء كردية",
        "حرف X"
      ]
    },
    "titles": {
      "tr": "X Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter X",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben X",
      "ar": "أسماء كردية فريدة تبدأ بحرف X"
    },
    "descriptions": {
      "tr": "X harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with X. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit X. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف X. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-y-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "y-harfi-kurtce-isimler-rehberi",
      "en": "y-letter-kurdish-names-guide",
      "de": "y-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-y"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "Y Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter Y"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe Y"
      ],
      "ar": [
        "أسماء كردية",
        "حرف Y"
      ]
    },
    "titles": {
      "tr": "Y Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter Y",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben Y",
      "ar": "أسماء كردية فريدة تبدأ بحرف Y"
    },
    "descriptions": {
      "tr": "Y harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with Y. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit Y. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف Y. المعاني الثقافية والأصول."
    }
  },
  {
    "id": "letter-z-generic-names",
    "date": "2026-07-05",
    "author": "KurdishName Editorial",
    "slugs": {
      "tr": "z-harfi-kurtce-isimler-rehberi",
      "en": "z-letter-kurdish-names-guide",
      "de": "z-buchstabe-kurdische-namen-ratgeber",
      "ar": "دليل-الاسماء-الكردية-بحرف-z"
    },
    "tags": {
      "tr": [
        "Kürtçe İsimler",
        "Z Harfi"
      ],
      "en": [
        "Kurdish Names",
        "Letter Z"
      ],
      "de": [
        "Kurdische Namen",
        "Buchstabe Z"
      ],
      "ar": [
        "أسماء كردية",
        "حرف Z"
      ]
    },
    "titles": {
      "tr": "Z Harfi İle Başlayan Duyulmamış Kürtçe İsimler",
      "en": "Unique Kurdish Names Starting with Letter Z",
      "de": "Einzigartige kurdische Namen mit dem Buchstaben Z",
      "ar": "أسماء كردية فريدة تبدأ بحرف Z"
    },
    "descriptions": {
      "tr": "Z harfi ile başlayan en farklı Kürtçe isimler arşivi. Kültürel anlamları ve kökenleri.",
      "en": "Archive of the most unique Kurdish names starting with Z. Cultural meanings and origins.",
      "de": "Archiv der einzigartigsten kurdischen Namen beginnend mit Z. Kulturelle Bedeutungen und Ursprünge.",
      "ar": "أرشيف لأكثر الأسماء الكردية تميزًا التي تبدأ بحرف Z. المعاني الثقافية والأصول."
    }
  }
];

export function getBlogPostsByLang(lang: string) {
  const cleanLang = (lang || "tr").toLowerCase();
  const activeLang = ["tr", "en", "de", "ar"].includes(cleanLang) ? cleanLang : "tr";
  
  return blogPostsRegistry.map(post => ({
    id: post.id,
    slug: post.slugs[activeLang] || post.slugs["tr"],
    tags: post.tags[activeLang] || post.tags["tr"],
    title: post.titles[activeLang] || post.titles["tr"],
    desc: post.descriptions[activeLang] || post.descriptions["tr"],
    date: post.date,
    author: post.author,
  }));
}

// Deprecated: maintaining the old array to prevent legacy compilation breaks
export const blogPosts = blogPostsRegistry.map(post => ({
  id: post.id,
  slug: post.slugs["tr"],
  tags: post.tags["tr"],
  title: post.titles["tr"],
  desc: post.descriptions["tr"],
  date: post.date,
  author: post.author
}));
