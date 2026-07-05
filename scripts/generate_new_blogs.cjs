const fs = require('fs');
const path = require('path');

const blog1 = {
  id: "kurtce-sifali-bitki-isimleri-ve-anlamlari",
  data: {
    tr: {
      title: "Kürtçe Şifalı Bitki İsimleri ve Anlamları",
      desc: "Mezopotamya doğasının şifalı bitkilerinden ilham alan Kürtçe isimler ve derin anlamları.",
      content: "Mezopotamya coğrafyası, zengin florasıyla sayısız şifalı bitkiye ev sahipliği yapar. Kürt halkı tarih boyunca bu bitkileri şifa, huzur ve bereket sembolü olarak görmüş ve çocuklarına bu isimleri vermiştir.\n\nBu yazımızda, doğanın şifalı dokunuşunu yansıtan Kürtçe bitki isimlerini derledik.",
      isListicle: true,
      listicleNames: ["pelin", "beybun", "reyhan", "nermin", "sosin", "jiyan", "stran", "gule", "binefs", "helin"]
    },
    en: {
      title: "Kurdish Medicinal Plant Names and Meanings",
      desc: "Kurdish names inspired by the medicinal plants of Mesopotamian nature and their deep meanings.",
      content: "The Mesopotamian geography, with its rich flora, hosts countless medicinal plants. Throughout history, the Kurdish people have seen these plants as symbols of healing, peace, and abundance, and named their children after them.\n\nIn this article, we have compiled Kurdish plant names that reflect the healing touch of nature.",
      isListicle: true,
      listicleNames: ["pelin", "beybun", "reyhan", "nermin", "sosin", "jiyan", "stran", "gule", "binefs", "helin"]
    },
    de: {
      title: "Kurdische Heilpflanzennamen und ihre Bedeutungen",
      desc: "Kurdische Namen, die von den Heilpflanzen der mesopotamischen Natur inspiriert sind, und ihre tiefen Bedeutungen.",
      content: "Die Geographie Mesopotamiens mit ihrer reichen Flora beherbergt unzählige Heilpflanzen. Im Laufe der Geschichte hat das kurdische Volk diese Pflanzen als Symbole für Heilung, Frieden und Überfluss angesehen und seine Kinder nach ihnen benannt.\n\nIn diesem Artikel haben wir kurdische Pflanzennamen zusammengestellt, die die heilende Berührung der Natur widerspiegeln.",
      isListicle: true,
      listicleNames: ["pelin", "beybun", "reyhan", "nermin", "sosin", "jiyan", "stran", "gule", "binefs", "helin"]
    },
    ar: {
      title: "أسماء النباتات الطبية الكردية ومعانيها",
      desc: "أسماء كردية مستوحاة من النباتات الطبية في طبيعة بلاد ما بين النهرين ومعانيها العميقة.",
      content: "تستضيف جغرافيا بلاد ما بين النهرين، بنباتاتها الغنية، عددًا لا يحصى من النباتات الطبية. على مر التاريخ، اعتبر الشعب الكردي هذه النباتات رموزًا للشفاء والسلام والوفرة، وأطلقوا عليها أسماء أطفالهم.\n\nفي هذا المقال، قمنا بتجميع أسماء النباتات الكردية التي تعكس لمسة الشفاء للطبيعة.",
      isListicle: true,
      listicleNames: ["pelin", "beybun", "reyhan", "nermin", "sosin", "jiyan", "stran", "gule", "binefs", "helin"]
    }
  }
};

const blog2 = {
  id: "duyulmamis-modern-kurtce-erkek-isimleri-2026",
  data: {
    tr: {
      title: "Duyulmamış Modern Kürtçe Erkek İsimleri (2026 Koleksiyonu)",
      desc: "2026 yılının en nadir, duyulmamış ve modern Kürtçe erkek bebek isimleri.",
      content: "Geleneksel köklerin modern ezgilerle buluştuğu eşsiz isimler... Eğer çocuğunuz için kimsede olmayan, nadir duyulan ve güçlü anlamlar taşıyan modern bir isim arıyorsanız doğru yerdesiniz.\n\nİşte 2026 yılına damgasını vuracak en özel Kürtçe erkek isimleri koleksiyonu.",
      isListicle: true,
      listicleNames: ["arjen", "miraz", "ronî", "bager", "rohat", "zanyar", "hezil", "merdan", "yeman", "şerzan"]
    },
    en: {
      title: "Unique Modern Kurdish Boy Names (2026 Collection)",
      desc: "The rarest, unheard, and modern Kurdish baby boy names of 2026.",
      content: "Unique names where traditional roots meet modern melodies... If you are looking for a rare and modern name with strong meanings that no one else has for your child, you are in the right place.\n\nHere is the most special collection of Kurdish boy names that will leave their mark on 2026.",
      isListicle: true,
      listicleNames: ["arjen", "miraz", "ronî", "bager", "rohat", "zanyar", "hezil", "merdan", "yeman", "şerzan"]
    },
    de: {
      title: "Einzigartige moderne kurdische Jungennamen (Kollektion 2026)",
      desc: "Die seltensten, unerhörtesten und modernsten kurdischen Baby-Jungennamen des Jahres 2026.",
      content: "Einzigartige Namen, in denen traditionelle Wurzeln auf moderne Melodien treffen... Wenn Sie für Ihr Kind einen seltenen und modernen Namen mit starken Bedeutungen suchen, den sonst niemand hat, sind Sie hier genau richtig.\n\nHier ist die ganz besondere Sammlung kurdischer Jungennamen, die 2026 prägen werden.",
      isListicle: true,
      listicleNames: ["arjen", "miraz", "ronî", "bager", "rohat", "zanyar", "hezil", "merdan", "yeman", "şerzan"]
    },
    ar: {
      title: "أسماء ذكور كردية حديثة ونادرة (مجموعة 2026)",
      desc: "أندر وأحدث أسماء الأطفال الذكور الكردية لعام 2026.",
      content: "أسماء فريدة تلتقي فيها الجذور التقليدية بالألحان الحديثة... إذا كنت تبحث عن اسم نادر وحديث ذو معاني قوية لا يملكه أحد آخر لطفلك، فأنت في المكان الصحيح.\n\nإليك المجموعة الأكثر تميزًا من أسماء الأولاد الكردية التي ستترك بصمتها في عام 2026.",
      isListicle: true,
      listicleNames: ["arjen", "miraz", "ronî", "bager", "rohat", "zanyar", "hezil", "merdan", "yeman", "şerzan"]
    }
  }
};

const blogs = [blog1, blog2];
const langs = ['tr', 'en', 'de', 'ar'];

blogs.forEach(blog => {
  langs.forEach(lang => {
    const dir = path.join(__dirname, `../src/data/blog/${lang}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const filePath = path.join(dir, `${blog.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(blog.data[lang], null, 2), 'utf8');
    console.log(`Created ${filePath}`);
  });
});
