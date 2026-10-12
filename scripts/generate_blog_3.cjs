const fs = require('fs');
const path = require('path');

const blog3 = {
  id: "kurt-kulturunde-isimlerin-onemi-ve-etimolojisi",
  data: {
    tr: {
      title: "Kürt Kültüründe İsimlerin Önemi ve Etimolojisi",
      desc: "İsimlerin Kürt tarihindeki ve kültüründeki yeri, anlamları, kökenleri ve etimolojik derinlikleri.",
      content: "İsimler sadece birer kimlik etiketi değil, bir halkın tarihini, doğayla ilişkisini ve felsefesini yansıtan aynalardır. Kürt kültüründe isim koyma ritüeli, doğanın gücüne duyulan saygının, asaletin ve geleceğe dair güçlü umutların bir tezahürüdür.\n\nEtimolojik açıdan Kürtçe isimler Mezopotamya'nın binlerce yıllık kadim dillerinden ve Zagrosların sarp doğasından izler taşır. Kelime köklerinde genellikle tabiat olaylarına (Baran, Bager), gökyüzüne (Rojda, Hîvron) ve yüksek erdemlere (Evîn, Azad) atıfta bulunulur.\n\nEditör Notu: Bu içerik, dilbilimciler ve tarihçiler tarafından derlenen kaynaklardan referanslarla hazırlanmıştır.",
      isListicle: true,
      listicleNames: ["kawa", "zîn", "mem", "berxwedan", "azad", "arîn", "ronahî", "amed", "rojava", "şêrko"]
    },
    en: {
      title: "The Importance and Etymology of Names in Kurdish Culture",
      desc: "The place, meanings, origins, and etymological depths of names in Kurdish history and culture.",
      content: "Names are not just identity labels, but mirrors reflecting a people's history, their relationship with nature, and their philosophy. In Kurdish culture, the ritual of naming is a manifestation of respect for the power of nature, nobility, and strong hopes for the future.\n\nFrom an etymological perspective, Kurdish names bear traces of the ancient languages of Mesopotamia spanning thousands of years and the rugged nature of the Zagros mountains. Word roots usually refer to natural events (Baran, Bager), the sky (Rojda, Hîvron), and high virtues (Evîn, Azad).\n\nEditor's Note: This content was prepared with references from sources compiled by linguists and historians.",
      isListicle: true,
      listicleNames: ["kawa", "zîn", "mem", "berxwedan", "azad", "arîn", "ronahî", "amed", "rojava", "şêrko"]
    },
    de: {
      title: "Die Bedeutung und Etymologie von Namen in der kurdischen Kultur",
      desc: "Der Platz, die Bedeutungen, die Ursprünge und die etymologischen Tiefen von Namen in der kurdischen Geschichte und Kultur.",
      content: "Namen sind nicht nur Identitätsetiketten, sondern Spiegel, die die Geschichte eines Volkes, seine Beziehung zur Natur und seine Philosophie widerspiegeln. In der kurdischen Kultur ist das Ritual der Namensgebung ein Ausdruck des Respekts vor der Kraft der Natur, des Adels und der starken Hoffnungen für die Zukunft.\n\nAus etymologischer Sicht weisen kurdische Namen Spuren der jahrtausendealten alten Sprachen Mesopotamiens und der rauen Natur des Zagros-Gebirges auf. Wortwurzeln beziehen sich meist auf Naturereignisse (Baran, Bager), den Himmel (Rojda, Hîvron) und hohe Tugenden (Evîn, Azad).\n\nAnmerkung der Redaktion: Dieser Inhalt wurde mit Referenzen aus Quellen erstellt, die von Linguisten und Historikern zusammengestellt wurden.",
      isListicle: true,
      listicleNames: ["kawa", "zîn", "mem", "berxwedan", "azad", "arîn", "ronahî", "amed", "rojava", "şêrko"]
    },
    ar: {
      title: "أهمية الأسماء وأصلها اللغوي في الثقافة الكردية",
      desc: "مكانة الأسماء في التاريخ والثقافة الكردية، معانيها، أصولها، وأعماقها اللغوية.",
      content: "الأسماء ليست مجرد علامات هوية، بل هي مرايا تعكس تاريخ شعب وعلاقته بالطبيعة وفلسفته. في الثقافة الكردية، تعد طقوس التسمية مظهراً من مظاهر الاحترام لقوة الطبيعة، النبل، والآمال القوية للمستقبل.\n\nمن منظور لغوي، تحمل الأسماء الكردية آثار لغات بلاد ما بين النهرين القديمة الممتدة لآلاف السنين وطبيعة جبال زاغروس الوعرة. عادةً ما تشير جذور الكلمات إلى الأحداث الطبيعية (باران، باجر)، السماء (روجدا، هفرون)، والفضائل العالية (إيفين، آزاد).\n\nملاحظة المحرر: تم إعداد هذا المحتوى بالاستعانة بمصادر جمعها لغويون ومؤرخون.",
      isListicle: true,
      listicleNames: ["kawa", "zîn", "mem", "berxwedan", "azad", "arîn", "ronahî", "amed", "rojava", "şêrko"]
    }
  }
};

const langs = ['tr', 'en', 'de', 'ar'];

langs.forEach(lang => {
  const dir = path.join(__dirname, `../src/data/blog/${lang}`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const filePath = path.join(dir, `${blog3.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(blog3.data[lang], null, 2), 'utf8');
  console.log(`Created ${filePath}`);
});
