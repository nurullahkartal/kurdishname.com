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
  const tIndex = hash % 5;
  const e = extra || seed;

  const templates: Record<string, Record<string, string[]>> = {
    tr: {
      female: [
        `Kürtçede kız çocuklarına verilen isimlerin zarafeti ve tarihsel kökeni, "${e}" temasında hayat bulur.`,
        `Kürt kültüründe kadınların bilgeliğini ve doğayla olan bağını yansıtan kız isimleri, derin bir miras taşır.`,
        `Mezopotamya'nın kadim topraklarında, kız isimleri genellikle incelik, sevgi ve fedakarlıkla yoğrulmuştur.`,
        `Annelerin kız çocuklarına bıraktığı en değerli miras olan bu isimler, asırlardır süregelen edebi bir zenginliktir.`,
        `Kız isimlerindeki fonetik estetik, Kürt dilinin o eşsiz lirik yapısının ve kültürel naifliğinin en güzel örneğidir.`
      ],
      male: [
        `Kürt kültüründe kahramanlık ve doğayı temsil eden erkek isimlerinin sembolizmi, cesaretin kadim tarihine dayanır.`,
        `Kürtçe erkek isimleri, dağların asaletini, dirayeti ve Mezopotamya'nın güçlü ruhunu taşır.`,
        `Tarih boyunca erkek isimleri, taşıyıcısına her daim dürüstlük, koruyuculuk ve sarsılmaz bir irade aşılamak üzere seçilmiştir.`,
        `Bir kimlik ve duruş ifadesi olan erkek isimleri, yiğitlik destanlarından günümüze ulaşan canlı birer anıttır.`,
        `Kürt dilinde erkeklere verilen isimlerin kökenleri, yüzyıllar boyu adaleti ve mertliği onurlandırmıştır.`
      ],
      search: [
        `"${e}" temalı Kürtçe isimlerin Mezopotamya mitolojisindeki yeri, dilin anlamsal zenginliğini ortaya koymaktadır.`,
        `Kürtçe isimler sözlüğünde "${e}" araması, kültürel belleğimizin ne kadar çeşitli ve köklü olduğunu gösterir.`,
        `Bölge halkının kelimelere yüklediği mana ekseninde "${e}" ile ilişkili isimler, derin bir sembolizm barındırır.`,
        `Doğa, duygu veya tarihsel bağlamda "${e}" motifini içeren isimler, taşıyıcılarına her zaman mistik bir değer katmıştır.`,
        `Kürt dilinin ifade gücü sayesinde "${e}" anlamı taşıyan isimler, edebi birer şaheser gibi kuşaktan kuşağa aktarılır.`
      ]
    },
    en: {
      female: [
        `The elegance and historical roots of Kurdish names given to baby girls come to life in this category.`,
        `Reflecting the wisdom of women and their bond with nature, Kurdish girl names carry a profound heritage.`,
        `In the ancient lands of Mesopotamia, girl names are often woven with grace, love, and devotion.`,
        `As the most precious legacy passed from mothers to daughters, these names are an enduring literary wealth.`,
        `The phonetic aesthetics in girl names beautifully exemplify the unique lyrical structure of the Kurdish language.`
      ],
      male: [
        `The symbolism of male names representing heroism and nature in Kurdish culture traces back to ancient times.`,
        `Kurdish boy names carry the nobility of the mountains, resilience, and the strong spirit of Mesopotamia.`,
        `Throughout history, boy names have been chosen to instill honesty, guardianship, and an unshakable will.`,
        `As an expression of identity, male names stand as living monuments reaching from epic tales of valor to the present.`,
        `The origins of names given to boys in the Kurdish language have honored justice and bravery for centuries.`
      ],
      search: [
        `The place of "${e}" themed Kurdish names in Mesopotamian mythology reveals the semantic richness of the language.`,
        `Searching for "${e}" in the Kurdish names dictionary shows how diverse and deep-rooted our cultural memory is.`,
        `Names related to "${e}" harbor deep symbolism, shaped by the meaning the local people attach to words.`,
        `Whether in the context of nature, emotion, or history, names containing the "${e}" motif add mystical value.`,
        `Thanks to the expressive power of Kurdish, names meaning "${e}" are passed down like literary masterpieces.`
      ]
    },
    de: {
      female: [
        `Die Eleganz und die historischen Wurzeln kurdischer Mädchennamen erwachen in dieser Kategorie zum Leben.`,
        `Kurdische Mädchennamen spiegeln die Weisheit der Frauen und ihre Verbundenheit mit der Natur wider.`,
        `In den alten Ländern Mesopotamiens sind Mädchennamen oft mit Anmut, Liebe und Hingabe verwoben.`,
        `Als wertvollstes Erbe von Müttern an Töchter stellen diese Namen einen beständigen literarischen Reichtum dar.`,
        `Die phonetische Ästhetik von Mädchennamen veranschaulicht die einzigartige lyrische Struktur der kurdischen Sprache.`
      ],
      male: [
        `Die Symbolik von Männernamen, die Heldentum und Natur repräsentieren, reicht bis in die Antike zurück.`,
        `Kurdische Jungennamen tragen den Adel der Berge, Widerstandsfähigkeit und den starken Geist Mesopotamiens.`,
        `Im Laufe der Geschichte wurden Jungennamen gewählt, um Ehrlichkeit und einen unerschütterlichen Willen zu vermitteln.`,
        `Als Ausdruck von Identität stehen männliche Namen wie lebendige Denkmäler aus epischen Erzählungen über Tapferkeit.`,
        `Die Ursprünge kurdischer Jungennamen ehren seit Jahrhunderten Gerechtigkeit und Mut.`
      ],
      search: [
        `Die Bedeutung von "${e}" inspirierten kurdischen Namen in der mesopotamischen Mythologie offenbart den Reichtum der Sprache.`,
        `Die Suche nach "${e}" im kurdischen Namenswörterbuch zeigt, wie vielfältig unser kulturelles Gedächtnis ist.`,
        `Namen, die mit "${e}" in Verbindung stehen, bergen eine tiefe Symbolik in sich.`,
        `Namen mit dem Motiv "${e}" verleihen ihrem Träger stets einen mystischen Wert.`,
        `Namen mit der Bedeutung "${e}" werden wie literarische Meisterwerke von Generation zu Generation weitergegeben.`
      ]
    },
    ar: {
      female: [
        `تتجلى أناقة وجذور الأسماء الكردية الممنوحة للفتيات في هذا التصنيف.`,
        `تعكس أسماء الفتيات الكردية حكمة النساء وارتباطهن بالطبيعة، وتحمل إرثاً عميقاً.`,
        `في أراضي بلاد ما بين النهرين القديمة، غالباً ما تنسج أسماء الفتيات بالنعمة والحب والتفاني.`,
        `باعتبارها أثمن ميراث من الأمهات للبنات، تشكل هذه الأسماء ثروة أدبية خالدة.`,
        `تجسد الجماليات الصوتية لأسماء الفتيات البنية الغنائية الفريدة للغة الكردية بشكل رائع.`
      ],
      male: [
        `تعود رمزية أسماء الذكور التي تمثل البطولة والطبيعة في الثقافة الكردية إلى العصور القديمة.`,
        `تحمل أسماء الأولاد الكردية نبل الجبال، والمرونة، والروح القوية لبلاد ما بين النهرين.`,
        `على مر التاريخ، تم اختيار أسماء الأولاد لغرس الصدق، والوصاية، والإرادة التي لا تتزعزع.`,
        `كتعبير عن الهوية، تقف أسماء الذكور كآثار حية تمتد من الملاحم البطولية إلى يومنا هذا.`,
        `لقد كرمت أصول الأسماء المعطاة للأولاد باللغة الكردية العدالة والشجاعة لعدة قرون.`
      ],
      search: [
        `مكانة الأسماء الكردية المرتبطة بـ "${e}" في أساطير بلاد ما بين النهرين تكشف عن الثراء الدلالي للغة.`,
        `البحث عن "${e}" في قاموس الأسماء الكردية يظهر مدى تنوع وعمق ذاكرتنا الثقافية.`,
        `الأسماء المرتبطة بـ "${e}" تحمل رمزية عميقة، تشكلت من المعاني التي يوليها أهل المنطقة للكلمات.`,
        `سواء في سياق الطبيعة، أو العاطفة، أو التاريخ، تضفي الأسماء التي تحتوي على دافع "${e}" قيمة غامضة.`,
        `بفضل القوة التعبيرية للغة الكردية، تتوارث الأجيال الأسماء التي تعني "${e}" كتحف أدبية.`
      ]
    }
  };

  const selectedLang = templates[lng] || templates.tr;
  const categoryTemplates = selectedLang[category] || selectedLang.search;
  
  return categoryTemplates[tIndex];
}

export function useCanonicalAndHreflang() {
  const location = useLocation();
  const canonicalUrl = `https://kurdishname.com${location.pathname}`;
  const baseUrl = "https://kurdishname.com";

  const hreflangs = Object.keys(routeTranslations).map((langKey) => ({
    lang: langKey,
    href: `${baseUrl}${switchLanguagePath(location.pathname, langKey)}`
  }));

  const xDefault = `${baseUrl}${switchLanguagePath(location.pathname, "en")}`;

  return { canonicalUrl, hreflangs, xDefault };
}
