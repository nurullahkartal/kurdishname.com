import { useLocation } from 'react-router-dom';
import { routeTranslations, switchLanguagePath } from './routes';

export type SeoHookCategory = 'female' | 'male' | 'unisex' | 'search';

export function generateContextualHook(
  seed: string,
  category: SeoHookCategory,
  lng: string,
  extra?: string // İsim anlamı veya Arama sorgusu
): string {
  if (!seed) return "";
  
  // Seed değerinden matematiksel olarak benzersiz bir Hash üretir
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tIndex = hash % 8;
  const e = extra || seed;

  const templates: Record<string, Record<string, string[]>> = {
    tr: {
      female: [
        `Kürtçede kız çocuklarına verilen isimlerin zarafeti ve tarihsel kökeni, "${e}" temasında hayat bulur.`,
        `Kürt kültüründe kadınların bilgeliğini ve doğayla olan bağını yansıtan kız isimleri, derin bir miras taşır.`,
        `Mezopotamya'nın kadim topraklarında, kız isimleri genellikle incelik, sevgi ve fedakarlıkla yoğrulmuştur.`,
        `Annelerin kız çocuklarına bıraktığı en değerli miras olan bu isimler, asırlardır süregelen edebi bir zenginliktir.`,
        `Kız isimlerindeki fonetik estetik, Kürt dilinin o eşsiz lirik yapısının ve kültürel naifliğinin en güzel örneğidir.`,
        `Her biri bir şiir gibi kulağa gelen bu kız isimleri, Kürtçenin duygu dünyasını en saf haliyle yansıtır.`,
        `Anadolu'nun bereketli topraklarında doğan bu isimler, kadınların sessiz gücünü ve nesiller boyu aktarılan bilgeliğini taşır.`,
        `Kürtçe kız isimleri, sadece birer ad değil; her biri ailelerin umutlarını ve hayallerini simgeleyen canlı birer mirastır.`
      ],
      male: [
        `Kürt kültüründe kahramanlık ve doğayı temsil eden erkek isimlerinin sembolizmi, cesaretin kadim tarihine dayanır.`,
        `Kürtçe erkek isimleri, dağların asaletini, dirayeti ve Mezopotamya'nın güçlü ruhunu taşır.`,
        `Tarih boyunca erkek isimleri, taşıyıcısına her daim dürüstlük, koruyuculuk ve sarsılmaz bir irade aşılamak üzere seçilmiştir.`,
        `Bir kimlik ve duruş ifadesi olan erkek isimleri, yiğitlik destanlarından günümüze ulaşan canlı birer anıttır.`,
        `Kürt dilinde erkeklere verilen isimlerin kökenleri, yüzyıllar boyu adaleti ve mertliği onurlandırmıştır.`,
        `Zagros'un zirvelerinden Mezopotamya'nın ovalarına uzanan bu isimler, erkek evlatlara güç ve vizyon aşılar.`,
        `Kürtçe erkek isimleri, dedelerden torunlara aktarılan bir onur madalyası gibi, her nesle yeni bir sorumluluk yükler.`,
        `Bu isimler, ata topraklarının sesini taşıyan birer kılavuz olup, taşıyıcısına köklerini ve kimliğini hatırlatır.`
      ],
      search: [
        `"${e}" temalı Kürtçe isimlerin Mezopotamya mitolojisindeki yeri, dilin anlamsal zenginliğini ortaya koymaktadır.`,
        `Kürtçe isimler sözlüğünde "${e}" araması, kültürel belleğimizin ne kadar çeşitli ve köklü olduğunu gösterir.`,
        `Bölge halkının kelimelere yüklediği mana ekseninde "${e}" ile ilişkili isimler, derin bir sembolizm barındırır.`,
        `Doğa, duygu veya tarihsel bağlamda "${e}" motifini içeren isimler, taşıyıcılarına her zaman mistik bir değer katmıştır.`,
        `Kürt dilinin ifade gücü sayesinde "${e}" anlamı taşıyan isimler, edebi birer şaheser gibi kuşaktan kuşağa aktarılır.`,
        `"${e}" ile ilişkilendirilen Kürtçe isimler, dilin kültürel hafızasını ve sözlü edebiyat geleneğini gözler önüne serer.`,
        `Kürtçenin köklü kelime hazinesinde "${e}" teması etrafında şekillenen isimler, dilbilimsel bir zenginlik sunar.`,
        `"${e}" aramasında karşımıza çıkan isimler, Kürt halkının doğaya, tarihe ve insana bakış açısını yansıtan birer aynadır.`
      ]
    },
    en: {
      female: [
        `The elegance and historical roots of Kurdish names given to baby girls come to life in this category.`,
        `Reflecting the wisdom of women and their bond with nature, Kurdish girl names carry a profound heritage.`,
        `In the ancient lands of Mesopotamia, girl names are often woven with grace, love, and devotion.`,
        `As the most precious legacy passed from mothers to daughters, these names are an enduring literary wealth.`,
        `The phonetic aesthetics in girl names beautifully exemplify the unique lyrical structure of the Kurdish language.`,
        `Each of these girl names sounds like a poem, reflecting the emotional depth of Kurdish in its purest form.`,
        `Born from the fertile lands of Anatolia, these names carry the quiet strength of women and wisdom passed through generations.`,
        `Kurdish girl names are not just labels; each is a living legacy symbolizing families' hopes and dreams.`
      ],
      male: [
        `The symbolism of male names representing heroism and nature in Kurdish culture traces back to ancient times.`,
        `Kurdish boy names carry the nobility of the mountains, resilience, and the strong spirit of Mesopotamia.`,
        `Throughout history, boy names have been chosen to instill honesty, guardianship, and an unshakable will.`,
        `As an expression of identity, male names stand as living monuments reaching from epic tales of valor to the present.`,
        `The origins of names given to boys in the Kurdish language have honored justice and bravery for centuries.`,
        `Stretching from the peaks of Zagros to the plains of Mesopotamia, these names inspire strength and vision in sons.`,
        `Kurdish boy names, like a medal of honor passed from grandfathers to grandsons, carry new responsibility for each generation.`,
        `These names serve as guides carrying the voice of ancestral lands, reminding their bearers of roots and identity.`
      ],
      search: [
        `The place of "${e}" themed Kurdish names in Mesopotamian mythology reveals the semantic richness of the language.`,
        `Searching for "${e}" in the Kurdish names dictionary shows how diverse and deep-rooted our cultural memory is.`,
        `Names related to "${e}" harbor deep symbolism, shaped by the meaning the local people attach to words.`,
        `Whether in the context of nature, emotion, or history, names containing the "${e}" motif add mystical value.`,
        `Thanks to the expressive power of Kurdish, names meaning "${e}" are passed down like literary masterpieces.`,
        `Kurdish names associated with "${e}" reveal the cultural memory and oral literary tradition of the language.`,
        `Names shaped around the theme of "${e}" in Kurdish's deep vocabulary offer linguistic richness.`,
        `Names found in a "${e}" search mirror the Kurdish people's perspective on nature, history, and humanity.`
      ]
    },
    de: {
      female: [
        `Die Eleganz und die historischen Wurzeln kurdischer Mädchennamen erwachen in dieser Kategorie zum Leben.`,
        `Kurdische Mädchennamen spiegeln die Weisheit der Frauen und ihre Verbundenheit mit der Natur wider.`,
        `In den alten Ländern Mesopotamiens sind Mädchennamen oft mit Anmut, Liebe und Hingabe verwoben.`,
        `Als wertvollstes Erbe von Müttern an Töchter stellen diese Namen einen beständigen literarischen Reichtum dar.`,
        `Die phonetische Ästhetik von Mädchennamen veranschaulicht die einzigartige lyrische Struktur der kurdischen Sprache.`,
        `Jeder dieser Mädchennamen klingt wie ein Gedicht und spiegelt die emotionale Tiefe des Kurdischen in reinster Form wider.`,
        `Diese aus den fruchtbaren Ländern Anatoliens geborenen Namen tragen die stille Stärke der Frauen und die über Generationen weitergegebene Weisheit.`,
        `Kurdische Mädchennamen sind nicht nur Bezeichnungen; jeder ist ein lebendiges Vermächtnis, das die Hoffnungen und Träume der Familien symbolisiert.`
      ],
      male: [
        `Die Symbolik von Männernamen, die Heldentum und Natur repräsentieren, reicht bis in die Antike zurück.`,
        `Kurdische Jungennamen tragen den Adel der Berge, Widerstandsfähigkeit und den starken Geist Mesopotamiens.`,
        `Im Laufe der Geschichte wurden Jungennamen gewählt, um Ehrlichkeit und einen unerschütterlichen Willen zu vermitteln.`,
        `Als Ausdruck von Identität stehen männliche Namen wie lebendige Denkmäler aus epischen Erzählungen über Tapferkeit.`,
        `Die Ursprünge kurdischer Jungennamen ehren seit Jahrhunderten Gerechtigkeit und Mut.`,
        `Von den Gipfeln des Zagros bis zu den Ebenen Mesopotamiens verleihen diese Namen Söhnen Kraft und Weitblick.`,
        `Kurdische Jungennamen sind wie eine von Großvätern an Enkel weitergegebene Ehrenmedaille und bringen jeder Generation neue Verantwortung.`,
        `Diese Namen dienen als Wegweiser, die die Stimme der angestammten Länder tragen und ihre Träger an Wurzeln und Identität erinnern.`
      ],
      search: [
        `Die Bedeutung von "${e}" inspirierten kurdischen Namen in der mesopotamischen Mythologie offenbart den Reichtum der Sprache.`,
        `Die Suche nach "${e}" im kurdischen Namenswörterbuch zeigt, wie vielfältig unser kulturelles Gedächtnis ist.`,
        `Namen, die mit "${e}" in Verbindung stehen, bergen eine tiefe Symbolik in sich.`,
        `Namen mit dem Motiv "${e}" verleihen ihrem Träger stets einen mystischen Wert.`,
        `Namen mit der Bedeutung "${e}" werden wie literarische Meisterwerke von Generation zu Generation weitergegeben.`,
        `Mit "${e}" verbundene kurdische Namen offenbaren das kulturelle Gedächtnis und die mündliche Literaturtradition der Sprache.`,
        `Namen, die sich im tiefen Wortschatz des Kurdischen um das Thema "${e}" formen, bieten sprachliche Fülle.`,
        `Namen, die bei einer Suche nach "${e}" erscheinen, spiegeln die Sicht des kurdischen Volkes auf Natur, Geschichte und Menschheit wider.`
      ]
    },
    ar: {
      female: [
        `تتجلى أناقة وجذور الأسماء الكردية الممنوحة للفتيات في هذا التصنيف.`,
        `تعكس أسماء الفتيات الكردية حكمة النساء وارتباطهن بالطبيعة، وتحمل إرثاً عميقاً.`,
        `في أراضي بلاد ما بين النهرين القديمة، غالباً ما تنسج أسماء الفتيات بالنعمة والحب والتفاني.`,
        `باعتبارها أثمن ميراث من الأمهات للبنات، تشكل هذه الأسماء ثروة أدبية خالدة.`,
        `تجسد الجماليات الصوتية لأسماء الفتيات البنية الغنائية الفريدة للغة الكردية بشكل رائع.`,
        `كل من هذه الأسماء يبدو كقصيدة، ويعكس العمق العاطفي للكردية في أنقى صورها.`,
        `وُلدت هذه الأسماء من أراضي الأناضول الخصبة، وتحمل القوة الهادئة للنساء والحكمة المتوارثة عبر الأجيال.`,
        `أسماء الفتيات الكردية ليست مجرد تسميات؛ كل واحدة منها إرث حي يرمز لآمال وأحلام العائلات.`
      ],
      male: [
        `تعود رمزية أسماء الذكور التي تمثل البطولة والطبيعة في الثقافة الكردية إلى العصور القديمة.`,
        `تحمل أسماء الأولاد الكردية نبل الجبال، والمرونة، والروح القوية لبلاد ما بين النهرين.`,
        `على مر التاريخ، تم اختيار أسماء الأولاد لغرس الصدق، والوصاية، والإرادة التي لا تتزعزع.`,
        `كتعبير عن الهوية، تقف أسماء الذكور كآثار حية تمتد من الملاحم البطولية إلى يومنا هذا.`,
        `لقد كرمت أصول الأسماء المعطاة للأولاد باللغة الكردية العدالة والشجاعة لعدة قرون.`,
        `تمتد من قمم زاغروس إلى سهول بلاد ما بين النهرين، وتمنح هذه الأسماء الأبناء قوة ورؤية.`,
        `أسماء الأولاد الكردية، مثل وسام شرف ينتقل من الأجداد إلى الأحفاد، تحمل مسؤولية جديدة لكل جيل.`,
        `تعمل هذه الأسماء كأدلة تحمل صوت الأراضي الأجدادية، وتذكر حامليها بجذورهم وهوبتهم.`
      ],
      search: [
        `مكانة الأسماء الكردية المرتبطة بـ "${e}" في أساطير بلاد ما بين النهرين تكشف عن الثراء الدلالي للغة.`,
        `البحث عن "${e}" في قاموس الأسماء الكردية يظهر مدى تنوع وعمق ذاكرتنا الثقافية.`,
        `الأسماء المرتبطة بـ "${e}" تحمل رمزية عميقة، تشكلت من المعاني التي يوليها أهل المنطقة للكلمات.`,
        `سواء في سياق الطبيعة، أو العاطفة، أو التاريخ، تضفي الأسماء التي تحتوي على دافع "${e}" قيمة غامضة.`,
        `بفضل القوة التعبيرية للغة الكردية، تتوارث الأجيال الأسماء التي تعني "${e}" كتحف أدبية.`,
        `تكشف الأسماء الكردية المرتبطة بـ "${e}" عن الذاكرة الثقافية والتقاليد الأدبية الشفهية للغة.`,
        `الأسماء التي تشكلت حول موضوع "${e}" في مفردات الكردية العميقة تقدم ثراءً لغوياً.`,
        `الأسماء التي تظهر في البحث عن "${e}" تعكس نظرة الشعب الكردي للطبيعة والتاريخ والإنسانية.`
      ]
    }
  };

  const selectedLang = templates[lng] || templates.tr;
  const categoryTemplates = selectedLang[category] || selectedLang.search;
  
  return categoryTemplates[tIndex];
}

export function useCanonicalAndHreflang() {
  const location = useLocation();
  const cleanPath = location.pathname.length > 1 ? location.pathname.replace(/\/$/, '') : location.pathname;
  const canonicalUrl = `https://kurdishname.com${cleanPath}`;
  const baseUrl = "https://kurdishname.com";

  const hreflangs = Object.keys(routeTranslations).map((langKey) => ({
    lang: langKey,
    href: `${baseUrl}${switchLanguagePath(cleanPath, langKey)}`.replace(/\/$/, '')
  }));

  const xDefault = `${baseUrl}/`;

  return { canonicalUrl, hreflangs, xDefault };
}
