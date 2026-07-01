import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Markdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import { loadAllNames } from '../utils/nameLoader';
import { injectInternalLinks } from '../utils/internalLinking';
import { getBlogPostsByLang, blogPostsRegistry } from '../data/blogPosts';
import { loadBlogPostContent, BlogContentPayload } from '../utils/blogLoader';
import { generatePath } from '../utils/routes';
import React, { lazy, Suspense } from 'react';


interface FAQItem {
  question: string;
  answer: string;
}

function getFAQForPost(postId: string, lng: string): FAQItem[] {
  const faqs: Record<string, Record<string, FAQItem[]>> = {
    "en-cok-tercih-edilen-100-kurtce-erkek-ismi-2026": {
      tr: [
        {
          question: "2026 yılında Türkiye'de en çok tercih edilen Kürtçe erkek isimleri hangileridir?",
          answer: "2026 yılı güncel verilerine göre en çok tercih edilen Kürtçe erkek isimleri Azad (Özgür), Baran (Yağmur), Aram (Huzurlu) ve Bawer (İnanan) isimleridir. Bu isimler hem telaffuz kolaylığı hem de derin anlamlarıyla öne çıkmaktadır."
        },
        {
          question: "Kürtçe erkek isimlerinde hangi temalar daha yaygındır?",
          answer: "Erkek isimlerinde genellikle doğa güçleri (fırtına, yağmur, dağ zirveleri), özgürlük/bağımsızlık kavramları, rehberlik/bilgelik vasıfları ve kahramanlık temaları en çok kullanılan ve sevilen temalardır."
        },
        {
          question: "Popüler Kürtçe erkek isimlerinin soyadıyla uyumu nasıl test edilir?",
          answer: "Seçtiğiniz ismin soyadınızla melodik bir denge kurması için sitemizdeki gelişmiş İsim Karşılaştırma modülünü kullanabilirsiniz. Bu modül sayesinde harf ve hece uyumunu yan yana inceleyebilirsiniz."
        }
      ],
      en: [
        {
          question: "Which are the most used Kurdish boy names in Turkey in 2026?",
          answer: "According to 2026 current data, the most preferred Kurdish boy names are Azad (Free), Baran (Rain), Aram (Peaceful), and Bawer (Believing). These names stand out with both their ease of pronunciation and deep meanings."
        },
        {
          question: "What themes are more common in Kurdish boy names?",
          answer: "In boy names, natural forces (storms, rain, mountain summits), freedom/independence concepts, guidance/wisdom qualities, and heroism themes are usually the most used and loved themes."
        },
        {
          question: "How to test the harmony of popular Kurdish boy names with the last name?",
          answer: "To ensure your chosen name forms a melodic balance with your last name, you can use our advanced Name Comparison module on our site. With this module, you can analyze letter and syllable harmony side-by-side."
        }
      ],
      de: [
        {
          question: "Welches sind die am häufigsten verwendeten kurdischen Jungennamen in der Türkei im Jahr 2026?",
          answer: "Nach den aktuellen Daten für 2026 sind die meistbevorzugten kurdischen Jungennamen Azad (Frei), Baran (Regen), Aram (Friedlich) und Bawer (Gläubig). Diese Namen zeichnen sich sowohl durch ihre leichte Aussprache als auch durch ihre tiefe Bedeutung aus."
        },
        {
          question: "Welche Themen sind bei kurdischen Jungennamen häufiger?",
          answer: "Bei Jungennamen sind Naturkräfte (Stürme, Regen, Berggipfel), Freiheit/Unabhängigkeit-Konzepte, Wegweisung/Weisheit-Qualitäten und Heldentum-Themen meist die am häufigsten verwendeten und beliebtesten Themen."
        },
        {
          question: "Wie testet man die Harmonie beliebter kurdischen Jungennamen mit dem Nachnamen?",
          answer: "Um sicherzustellen, dass der gewählte Name eine melodische Balance mit Ihrem Nachnamen bildet, können Sie unser fortschrittliches Namensvergleichsmodul auf unserer Website nutzen. Mit diesem Modul können Sie Buchstaben- und Silbenharmonie nebeneinander analysieren."
        }
      ],
      ar: [
        {
          question: "ما هي الأسماء الكردية للذكور الأكثر تفضيلاً في تركيا لعام 2026؟",
          answer: "بناءً على أحدث الإحصاءات لهذا العام، تتصدر أسماء آزاد (الحر)، باران (المطر)، آرام (الساكن الهادئ)، وباور (المؤمن الصادق) قائمة الأسماء الأكثر اختياراً بفضل سهولة نطقها وفخامة معانيها."
        },
        {
          question: "ما هي الطوابع الأكثر انتشاراً في أسماء الذكور باللغة الكردية؟",
          answer: "تعتبر قوى الطبيعة المهيبة (العواصف، غيث المطر، قمم الجبال الشامخة)، قيم الاستقلال والحرية السيادية، والصفات القيادية كالريادة والحكمة والشجاعة الباسلة هي الطوابع الأكثر انتشاراً وتفضيلاً لدى العائلات."
        },
        {
          question: "كيف يمكن اختبار مدى توافق أسماء الذكور الكردية مع اللقب العائلي؟",
          answer: "لضمان توازن الاسم المختار مع الكنية العائلية بشكل موسيقي وسلس، يمكنكم استخدام أداة مقارنة الأسماء المتطورة على موقعنا، والتي تتيح لكم تحليل تناغم الحروف واللفظ جنباً إلى جنب."
        }
      ]
    },
    "kurt-kahramanlarindan-esinlenen-50-guclu-erkek-ismi": {
      tr: [
        {
          question: "Kürtçe kahraman isimleri seçerken nelere dikkat edilmelidir?",
          answer: "İsmin taşıdığı tarihi hikayeye, Mezopotamya mitolojisindeki rolüne ve uyandırdığı güç/cesaret duygusuna dikkat etmelisiniz. Kawa gibi efsanevi isimler her zaman popülerliğini korumaktadır."
        },
        {
          question: "En çok tercih edilen güçlü Kürtçe erkek isimleri hangileridir?",
          answer: "Berxwedan (Direniş), Azad (Özgür), Kawa (Efsanevi demirci) ve Serhad (Sınır boyu) en popüler ve en güçlü anlamlara sahip Kürtçe erkek isimleri arasındadır."
        },
        {
          question: "Efsanevi Kürt kahraman isimleri günümüzde de yaygın olarak kullanılıyor mu?",
          answer: "Evet, Kawa, Berxwedan, Şêrko ve Serhad gibi tarihi ve mitolojik derinliğe sahip isimler, hem taşıdığı güçlü karakter özellikleri hem de asil tınıları nedeniyle 2026 yılında da ebeveynler tarafından gururla ve sıklıkla tercih edilmektedir."
        }
      ],
      en: [
        {
          question: "What should be considered when choosing Kurdish hero names?",
          answer: "You should pay attention to the historical story the name carries, its role in Mesopotamian mythology, and the feeling of power/courage it evokes. Legendary names like Kawa always maintain their popularity."
        },
        {
          question: "Which are the most popular strong Kurdish boy names?",
          answer: "Berxwedan (Resistance), Azad (Free), Kawa (Legendary blacksmith), and Serhad (Borderland) are among the most popular Kurdish boy names with the strongest meanings."
        },
        {
          question: "Are legendary Kurdish hero names still widely used today?",
          answer: "Yes, names with historical and mythological depth like Kawa, Berxwedan, Sherko, and Serhad are proudly and frequently preferred by parents in 2026 due to both the strong character traits they carry and their noble tones."
        }
      ],
      de: [
        {
          question: "Was sollte bei der Wahl kurdischer Heldennamen beachtet werden?",
          answer: "Sie sollten auf die historische Geschichte des Namens, seine Rolle in der mesopotamischen Mythologie und das Gefühl von Stärke/Mut achten, das er hervorruft. Legendäre Namen wie Kawa behalten immer ihre Beliebtheit."
        },
        {
          question: "Welches sind die beliebtesten starken kurdischen Jungennamen?",
          answer: "Berxwedan (Widerstand), Azad (Frei), Kawa (Legendärer Schmied) und Serhad (Grenzland) gehören zu den beliebtesten kurdischen Jungennamen mit den stärksten Bedeutungen."
        },
        {
          question: "Werden legendäre kurdische Heldennamen heute noch häufig verwendet?",
          answer: "Ja, Namen mit historischer und mythologischer Tiefe wie Kawa, Berxwedan, Sherko und Serhad werden von Eltern im Jahr 2026 aufgrund ihrer starken Charaktereigenschaften und edlen Töne stolz und häufig bevorzugt."
        }
      ],
      ar: [
        {
          question: "ما الذي يجب التركيز عليه عند اختيار أسماء أبطال كردية للذكور؟",
          answer: "يجب التركيز على القصة التاريخية العريقة التي يحملها الاسم، ودوره الملهم في ميثولوجيا ميزوبوتاميا، والوقع اللفظي الرجولي الشامخ. الأسماء الأسطورية مثل كاوا تظل دائماً في طليعة التفضيلات الإيجابية."
        },
        {
          question: "ما هي أكثر أسماء الذكور الكردية القوية شيوعاً؟",
          answer: "تعد أسماء بيرخودان (المقاومة والصمود)، آزاد (الحر)، كاوا (الحداد الأسطوري للحرية)، وسرحد (حامي الحدود الشجاع) من أشهر وأقوى الأسماء المفضلة للذكور."
        },
        {
          question: "هل ما زالت أسماء الأبطال الكرد الأسطورية تُستخدم على نطاق واسع اليوم؟",
          answer: "نعم، إن الأسماء ذات العمق التاريخي والميثولوجي مثل كاوا (Kawa)، بيرخودان (Berxwedan)، شيركو (Sherko)، وسرحد (Serhad) تحظى بإقبال كبير وتفضيل فخور من العائلات في عام 2026 لقوتها وفخامتها."
        }
      ]
    },
    "en-populer-100-kurtce-kiz-isimleri-ve-anlamlari-2026": {
      tr: [
        {
          question: "2026 yılında en popüler Kürtçe kız isimleri hangileridir?",
          answer: "2026 yılı trend istatistiklerine göre en popüler isimler Arîn (Kutsal ateş), Lorin (Ninni), Berfîn (Kardelen) ve Evîn (Aşk) isimleridir. Bu isimler kulağa hoş gelen melodik tınılarıyla öne çıkmaktadır."
        },
        {
          question: "Kürtçe kız isimlerinde hangi temalar daha popüler?",
          answer: "Kürtçe kız isimlerinde doğa (çiçekler, akarsular), gökyüzü (ay ışığı, yıldızlar) ve asalet/özgürlük temaları en çok tercih edilen ve popülerliği her yıl artan temalardır."
        },
        {
          question: "Popüler Kürtçe kız isimleri arasından seçim yaparken nelere dikkat edilmeli?",
          answer: "Öncelikle ismin taşıdığı anlama ve melodik yapısına dikkat edilmelidir. Hem modern tınılara sahip hem de geleneksel kültürel bağları koruyan isimler her dönem değerini korur. Sitemizdeki İsim Defterim aracılığıyla favorilerinizi saklayabilirsiniz."
        }
      ],
      en: [
        {
          question: "Which are the most popular Kurdish girl names in 2026?",
          answer: "According to 2026 trend statistics, the most popular names are Arîn (Sacred fire), Lorin (Lullaby), Berfîn (Snowdrop), and Evîn (Love). These names stand out with their ears-pleasing melodic tones."
        },
        {
          question: "What themes are more popular in Kurdish girl names?",
          answer: "In Kurdish girl names, nature (flowers, streams), sky (moonlight, stars), and nobility/freedom themes are the most preferred themes whose popularity increases every year."
        },
        {
          question: "What should be considered when choosing among popular Kurdish girl names?",
          answer: "First of all, attention should be paid to the meaning and melodic structure of the name. Names that have both modern tones and preserve traditional cultural ties maintain their value in every period. You can save your favorites via our Favorite Notebook on our site."
        }
      ],
      de: [
        {
          question: "Welches sind die beliebtesten kurdischen Mädchennamen im Jahr 2026?",
          answer: "Nach den Trendstatistiken für 2026 sind die beliebtesten Namen Arîn (Heiliges Feuer), Lorin (Schlaflied), Berfîn (Schneeglöckchen) und Evîn (Liebe). Diese Namen zeichnen sich durch ihre ohrenschmeichelnden melodischen Töne aus."
        },
        {
          question: "Welche Themen sind bei kurdischen Mädchennamen beliebter?",
          answer: "Bei kurdischen Mädchennamen sind Natur (Blumen, Bäche), Himmel (Mondlicht, Sterne) und Adel/Freiheit die beliebtesten Themen, deren Beliebtheit von Jahr zu Jahr zunimmt."
        },
        {
          question: "Was sollte bei der Auswahl beliebter kurdischer Mädchennamen beachtet werden?",
          answer: "In erster Linie sollte auf die Bedeutung und die melodische Struktur des Namens geachtet werden. Namen, die sowohl moderne Töne aufweisen als auch traditionelle kulturelle Bindungen bewahren, behalten in jeder Epoche ihren Wert. Sie können Ihre Favoriten über unser Favoriten-Notizbuch speichern."
        }
      ],
      ar: [
        {
          question: "ما هي الأسماء الكردية للبنات الأكثر شهرة في عام 2026؟",
          answer: "وفقاً للإحصاءات الديناميكية لهذا العام، تتصدر أسماء آرين (النار المقدسة)، لورين (الترتيلة العذبة)، بيرفين (شقائق الثلج)، وإيفين (الحب الصادق) قائمة الأسماء الأكثر تفضيلاً وطلباً."
        },
        {
          question: "ما هي الطوابع والرموز الأكثر انتشاراً في الأسماء الكردية للإناث؟",
          answer: "تعتبر الرموز المرتبطة بالطبيعة الغناء (الأزهار، الينابيع والجداول المائية)، وعناصر السماء (النجوم، الضياء والمهتاب)، وقيم الحرية والسيادة هي الطوابع الأكثر انتشاراً وطلباً لدى العائلات."
        },
        {
          question: "ما الذي يجب مراعاته عند الاختيار من بين أشهر أسماء البنات الكردية؟",
          answer: "يجب التركيز أولاً على المعنى النبيل الذي يحمله الاسم وبنيته اللفظية العذبة. الأسماء التي تجمع بين الحداثة الموسيقية والجذور الثقافية العريقة تظل الأجمل دائماً. يمكنكم حفظ اختياراتكم في دفتر المفضلة لدينا."
        }
      ]
    },
    "anlamli-dogadan-esintili-kurtce-kiz-isimleri": {
      tr: [
        {
          question: "Doğa ile ilgili Kürtçe kız isimleri seçerken nelere dikkat edilmelidir?",
          answer: "Özellikle ismin tınısına, telaffuz kolaylığına ve içerdiği anlamın çocuğunuza katacağı enerjiye dikkat etmelisiniz. Doğanın zarafetini (çiçek, gökyüzü, nehir) temsil eden isimler her zaman popülerliğini korur."
        },
        {
          question: "En çok tercih edilen doğa temalı Kürtçe kız isimleri hangileridir?",
          answer: "Beybûn (Papatya), Berfîn (Kardelen), Rojda (Güneşin doğuşu) ve Xunav (Çiy damlası) en popüler ve anlamı en güzel doğa temalı Kürtçe kız isimleri arasında yer almaktadır."
        },
        {
          question: "Doğa temalı Kürtçe kız isimleri arasında en eski ve köklü olanlar hangileridir?",
          answer: "Asmîn (Dağ çiçeği), Beybûn (Papatya) ve Berfîn (Kardelen) Mezopotamya edebiyatında ve folklorunda yüzyıllardır kullanılan, doğanın saflığını ve direncini en güzel yansıtan en köklü Kürtçe kız isimlerindendir."
        }
      ],
      en: [
        {
          question: "What should be considered when choosing Kurdish girl names about nature?",
          answer: "You should especially pay attention to the tone of the name, ease of pronunciation, and the energy the meaning will add to your child. Names representing the elegance of nature (flower, sky, river) always maintain their popularity."
        },
        {
          question: "Which are the most popular nature-themed Kurdish girl names?",
          answer: "Beybûn (Daisy), Berfîn (Snowdrop), Rojda (Sunrise), and Xunav (Dewdrop) are among the most popular and beautiful nature-themed Kurdish girl names."
        },
        {
          question: "Which are the oldest and most established nature-themed Kurdish girl names?",
          answer: "Asmîn (Mountain flower), Beybûn (Daisy), and Berfîn (Snowdrop) are among the most established Kurdish girl names that have been used in Mesopotamian literature and folklore for centuries, beautifully reflecting the purity and resilience of nature."
        }
      ],
      de: [
        {
          question: "Was sollte bei der Wahl kurdischer Mädchennamen über die Natur beachtet werden?",
          answer: "Sie sollten besonders auf den Klang des Namens, die Leichtigkeit der Aussprache und die Energie achten, die die Bedeutung Ihrem Kind verleiht. Namen, die die Eleganz der Natur repräsentieren (Blume, Himmel, Fluss), behalten immer ihre Beliebtheit."
        },
        {
          question: "Welche sind die beliebtesten kurdischen Mädchennamen mit Naturbezug?",
          answer: "Beybûn (Gänseblümchen), Berfîn (Schneeglöckchen), Rojda (Sonnenaufgang) und Xunav (Tautropfen) gehören zu den beliebtesten kurdischen Mädchennamen."
        },
        {
          question: "Welches sind die ältesten und etabliertesten kurdischen Mädchennamen mit Naturbezug?",
          answer: "Asmîn (Bergblume), Beybûn (Gänseblümchen) und Berfîn (Schneeglöckchen) gehören zu den etabliertesten kurdischen Mädchennamen, die seit Jahrhunderten in der mesopotamischen Literatur und Folklore verwendet werden."
        }
      ],
      ar: [
        {
          question: "ما الذي يجب مراعاته عند اختيار أسماء بنات كردية من الطبيعة؟",
          answer: "يجب الانتباه بشكل خاص إلى جرس الاسم الموسيقي وسهولة لفظه، والطاقة الإيجابية التي يحملها معناه. الأسماء التي تمثل رقة وعذوبة الطبيعة (كالزهور، الينابيع، السماء) تحافظ على جاذبيتها دائماً."
        },
        {
          question: "ما هي أكثر أسماء البنات الكردية المستوحاة من الطبيعة شيوعاً؟",
          answer: "تعد أسماء بيبون (Beybûn - الأقحوان)، بيرفين (Berfîn - زهرة الثلج)، روجدا (Rojda - شروق الشمس)، وخوناف (Xunav - قطرة الندى) من أجمل وأكثر أسماء الطبيعة تفضيلاً."
        },
        {
          question: "ما هي أقدم أسماء البنات الكردية المستوحاة من الطبيعة وأكثرها عراقة؟",
          answer: "تعد أسماء اسمين (Asmîn - زهرة الجبل)، بيبون (Beybûn - الأقحوان)، وبيرفين (Berfîn - زهرة الثلج) من أكثر الأسماء عراقة والمستخدمة في الأدب والفلكلور الكردي منذ قرون لتجسيد النقاء والصمود الطبيعي."
        }
      ]
    },
    "twin-names-guide": {
      tr: [
        {
          question: "Kürtçe ikiz isimleri seçerken nelere dikkat edilmelidir?",
          answer: "Hem fonetik ses uyumuna hem de anlamsal bütünlüğe dikkat edilmesi önerilir. İsimlerin aynı harfle başlaması veya benzer tınılara sahip olması akustiği artırır."
        },
        {
          question: "Kız/Erkek ikizleri için en uyumlu Kürtçe isimler hangileridir?",
          answer: "Aynı kökten gelen Ronî (Erkek) ve Ronahî (Kız) veya doğa temalı Baran (Erkek) ve Havin (Kız) en çok tercih edilen popüler çiftlerdendir."
        },
        {
          question: "İkiz bebek isimlerinin bireysel karakter gelişimine etkisi var mıdır?",
          answer: "Evet, ikizlerin kendilerine has iki ayrı birey olduğunu unutmamak gerekir. Birbiriyle fonetik olarak uyumlu ancak tamamen aynı seslerden oluşmayan bağımsız isimler seçmek, çocukların kendi kimliklerini sağlıklı geliştirmelerine katkı sağlar."
        }
      ],
      en: [
        {
          question: "What should be considered when choosing Kurdish twin names?",
          answer: "It is recommended to pay attention to both phonetic sound harmony and semantic unity. Names starting with the same letter or sharing similar tones enhance acoustics."
        },
        {
          question: "Which are the most harmonious Kurdish girl/boy twin names?",
          answer: "Ronî (Boy) and Ronahî (Girl) from the same root, or nature-themed Baran (Boy) and Havin (Girl) are among the most preferred and popular pairs."
        },
        {
          question: "Do twin baby names have an effect on individual character development?",
          answer: "Yes, it is important to remember that twins are two separate individuals of their own. Choosing independent names that are phonetically compatible with each other but do not consist of the exact same sounds helps children develop their own identities in a healthy way."
        }
      ],
      de: [
        {
          question: "Was sollte bei der Wahl kurdischer Zwillingsnamen beachtet werden?",
          answer: "Es wird empfohlen, sowohl auf die phonetische Klangharmonie als auch auf die semantische Einheit zu achten. Gleiche Anfangsbuchstaben oder ähnliche Töne verbessern die Akustik."
        },
        {
          question: "Welche sind die harmonischsten kurdischen Mädchen/Jungen-Zwillingsnamen?",
          answer: "Ronî (Junge) und Ronahî (Mädchen) aus derselben Wurzel oder Baran (Junge) und Havin (Mädchen) mit Naturbezug gehören zu den beliebtesten Paaren."
        },
        {
          question: "Haben Zwillingsnamen einen Einfluss auf die individuelle Charakterentwicklung?",
          answer: "Ja, es ist wichtig zu bedenken, dass Zwillinge zwei eigenständige Persönlichkeiten sind. Die Wahl unabhängiger Namen, die phonetisch miteinander kompatibel sind, aber nicht aus exakt denselben Lauten bestehen, hilft Kindern, ihre eigene Identität gesund zu entwickeln."
        }
      ],
      ar: [
        {
          question: "ما الذي يجب مراعاته عند اختيار أسماء توائم كردية؟",
          answer: "يُنصح بمراعاة التناسق الصوتي واللفظي جنباً إلى جنب مع التكامل والترابط الدلالي في المعنى. البدء بنفس الحرف يزيد من جمال الجرس الموسيقي."
        },
        {
          question: "ما هي أكثر أسماء التوائم (بنت وولد) الكردية تناسقاً؟",
          answer: "يعد روني (Ronî) للولد وروناهي (Ronahî) للبنت المشتقان من نفس الجذر، أو باران (Baran) للولد وهافين (Havin) للبنت من أكثر الثنائيات المفضلة والشائعة."
        },
        {
          question: "هل لاختيار أسماء التوائم تأثير على تطور شخصياتهم الفردية المستقلة؟",
          answer: "نعم، من الضروري تذكر أن التوائم شخصيتان مستقلتان بذاتهما. اختيار أسماء متناسقة لفظياً وموسيقياً وليست متطابقة تماماً في الحروف يساعد الأطفال على بناء وتطوير هويتهم الخاصة بكامل الثقة والتميز."
        }
      ]
    },
    "girls-names-list": {
      tr: [
        {
          question: "En popüler Kürtçe kız isimleri hangileridir?",
          answer: "Arîn, Ava, Dîlan, Solîn ve Sarya en popüler Kürtçe kız isimleri arasındadır. Bu isimler genellikle doğa, asalet ve ışık gibi anlamlar taşırlar."
        },
        {
          question: "Kürtçe kız isimleri genellikle ne anlama gelir?",
          answer: "Kürtçe kız isimleri sıklıkla çiçekler, su, güneş ışığı, özgürlük ve yaşam gibi doğadan ve derin kültürel temalardan ilham alır."
        }
      ],
      en: [
        {
          question: "What are the most popular Kurdish girl names?",
          answer: "Arîn, Ava, Dîlan, Solîn, and Sarya are among the most popular Kurdish girl names. These names usually signify nature, nobility, and light."
        },
        {
          question: "What do Kurdish girl names usually mean?",
          answer: "Kurdish girl names are frequently inspired by flowers, water, sunlight, freedom, and life, reflecting nature and deep cultural themes."
        }
      ],
      de: [
        {
          question: "Welche sind die beliebtesten kurdischen Mädchennamen?",
          answer: "Arîn, Ava, Dîlan, Solîn und Sarya gehören zu den beliebtesten kurdischen Mädchennamen. Diese Namen stehen oft für Natur, Adel und Helligkeit."
        },
        {
          question: "Was bedeuten kurdische Mädchennamen meistens?",
          answer: "Kurdische Mädchennamen sind häufig von Blumen, Wasser, Sonnenlicht, Freiheit und dem Leben inspiriert und spiegeln Natur und Kultur wider."
        }
      ],
      ar: [
        {
          question: "ما هي أشهر أسماء البنات الكردية؟",
          answer: "آرين (Arîn)، وآفا (Ava)، وديلان (Dîlan)، وسولين (Solîn)، وساريا (Sarya) هي من أشهر أسماء البنات الكردية. تحمل هذه الأسماء معاني الطبيعة والنبل والضياء."
        },
        {
          question: "ما هي المعاني العامة لأسماء البنات الكردية؟",
          answer: "تستوحي أسماء البنات الكردية معانيها غالباً من الزهور، والماء، وأشعة الشمس، والحرية، والحياة، مما يعكس الطبيعة والعمق الثقافي."
        }
      ]
    },
    "boys-names-list": {
      tr: [
        {
          question: "En popüler Kürtçe erkek isimleri hangileridir?",
          answer: "Baran, Rênas, Serhat, Sherko ve Azad en popüler Kürtçe erkek isimleri arasındadır. Bu isimler genellikle güç, cesaret ve rehberlik ifade eder."
        },
        {
          question: "Kürtçe erkek isimleri ne anlama gelir?",
          answer: "Kürtçe erkek isimleri genellikle dağlar, yağmur, rüzgar gibi doğa olaylarının yanı sıra dürüstlük, cesaret ve kahramanlık gibi erdemleri temsil eder."
        }
      ],
      en: [
        {
          question: "What are the most popular Kurdish boy names?",
          answer: "Baran, Rênas, Serhat, Sherko, and Azad are among the most popular Kurdish boy names. These names often represent strength, courage, and guidance."
        },
        {
          question: "What do Kurdish boy names signify?",
          answer: "Kurdish boy names usually signify natural events like mountains, rain, wind, as well as noble virtues such as honesty, courage, and heroism."
        }
      ],
      de: [
        {
          question: "Welche sind die beliebtesten kurdischen Jungennamen?",
          answer: "Baran, Rênas, Serhat, Sherko und Azad gehören zu den beliebtesten kurdischen Jungennamen. Diese Namen stehen oft für Stärke, Mut und Führung."
        },
        {
          question: "Was bedeuten kurdische Jungennamen?",
          answer: "Kurdische Jungennamen symbolisieren meist Naturphänomene wie Berge, Regen und Wind sowie edle Tugenden wie Ehrlichkeit, Tapferkeit und Heldentum."
        }
      ],
      ar: [
        {
          question: "ما هي أشهر أسماء الأولاد الكردية؟",
          answer: "باران (Baran)، وريناس (Rênas)، وسرحات (Serhat)، وشيركو (Sherko)، وآزاد (Azad) هي من بين أشهر أسماء الأولاد الكردية، وتعبر عادة عن القوة والشجاعة والإرشاد."
        },
        {
          question: "ماذا تعني أسماء الأولاد الكردية عموماً؟",
          answer: "تمثل أسماء الأولاد الكردية في الغالب ظواهر طبيعية مثل الجبال والمطر والرياح، بالإضافة إلى قيم نبيلة مثل الصدق والشهامة والبطولة."
        }
      ]
    },
    "popular-names-list": {
      tr: [
        {
          question: "Kürtçe isimlerin genel özellikleri nelerdir?",
          answer: "Kürtçe isimler melodik tınıları ve derin etimolojik kökenleriyle bilinir. Çoğu isim doğa, asalet, özgürlük ve sevgi temalıdır."
        }
      ],
      en: [
        {
          question: "What are the general characteristics of Kurdish names?",
          answer: "Kurdish names are known for their melodic tones and deep etymological roots. Most names are based on themes of nature, nobility, freedom, and love."
        }
      ],
      de: [
        {
          question: "Was sind die allgemeinen Merkmale kurdischer Namen?",
          answer: "Kurdische Namen zeichnen sich durch melodische Klänge und tiefe etymologische Wurzeln aus. Die meisten basieren auf Themen wie Natur, Freiheit und Liebe."
        }
      ],
      ar: [
        {
          question: "ما هي الخصائص العامة للأسماء الكردية؟",
          answer: "تتميز الأسماء الكردية برنينها الموسيقي وأصولها اللغوية العميقة. ترتبط معظم الأسماء بالطبيعة، والحرية، والنبل، والحب."
        }
      ]
    },
    "modern-names-guide": {
      tr: [
        {
          question: "Modern Kürtçe bebek isimleri nasıl seçilir?",
          answer: "Geleneksel kökleri korurken modern dünya dillerinde de kolay telaffuz edilebilen, melodik tınılı ve çağdaş anlamlara sahip isimler tercih edilebilir."
        }
      ],
      en: [
        {
          question: "How to choose modern Kurdish baby names?",
          answer: "You can choose names that preserve traditional roots while having melodic tones, contemporary meanings, and easy pronunciation in modern world languages."
        }
      ],
      de: [
        {
          question: "Wie wählt man moderne kurdische Babynamen aus?",
          answer: "Sie können Namen wählen, die traditionelle Wurzeln bewahren und gleichzeitig einen melodischen Klang, moderne Bedeutungen und eine einfache Aussprache haben."
        }
      ],
      ar: [
        {
          question: "كيف يتم اختيار أسماء الأطفال الكردية الحديثة؟",
          answer: "يمكن اختيار أسماء تحافظ على الجذور التاريخية وفي الوقت نفسه تتميز برنين موسيقي وسهولة في اللفظ بلغات العالم المعاصر مع معانٍ مواكبة للعصر."
        }
      ]
    },
    "2026-populer-isimler": {
      tr: [
        {
          question: "2026'da en çok tercih edilen Kürtçe bebek isimleri hangileridir?",
          answer: "2026 yılında doğa temalı Arîn, Ronî, Baran ve Solîn gibi isimler Kürtçe bebek isimleri tercihlerinde en popüler trendler arasındadır."
        }
      ],
      en: [
        {
          question: "What are the most preferred Kurdish baby names in 2026?",
          answer: "In 2026, nature-themed names like Arîn, Ronî, Baran, and Solîn are among the most popular trends in Kurdish baby name choices."
        }
      ],
      de: [
        {
          question: "Welche kurdischen Babynamen werden 2026 am meisten bevorzugt?",
          answer: "Im Jahr 2026 gehören naturbezogene Namen wie Arîn, Ronî, Baran und Solîn zu den beliebtesten Trends bei kurdischen Babynamen."
        }
      ],
      ar: [
        {
          question: "ما هي أسماء الأطفال الكردية الأكثر تفضيلاً في عام 2026؟",
          answer: "في عام 2026، تبرز الأسماء المرتبطة بالطبيعة مثل آرين (Arîn)، وروني (Ronî)، وباران (Baran)، وسولين (Solîn) كأكثر الاتجاهات شعبية لتسمية المواليد."
        }
      ]
    },
    "mitolojik-isimler-rehberi": {
      tr: [
        {
          question: "Efsanevi ve mitolojik Kürtçe isimler hangileridir?",
          answer: "Kawa, Şahmaran, Medya ve Aras en popüler mitolojik ve efsanevi Kürtçe isimler arasındadır."
        }
      ],
      en: [
        {
          question: "What are legendary and mythological Kurdish names?",
          answer: "Kawa, Shahmaran, Medya, and Aras are among the most popular mythological and legendary Kurdish names."
        }
      ],
      de: [
        {
          question: "Welche sind sagenhafte und mythologische kurdische Namen?",
          answer: "Kawa, Shahmaran, Medya und Aras gehören zu den beliebtesten mythologischen und legendären kurdischen Namen."
        }
      ],
      ar: [
        {
          question: "ما هي الأسماء الكردية الأسطورية والتاريخية؟",
          answer: "كاوا (Kawa)، وشاهماران (Shahmaran)، وميديا (Medya)، وأراس (Aras) هي من أشهر الأسماء الكردية المرتبطة بالأساطير والتاريخ العريق."
        }
      ]
    },
    "modern-ve-nadir-isimler": {
      tr: [
        {
          question: "Nadir ve duyulmamış Kürtçe bebek isimleri hangileridir?",
          answer: "Zerya (deniz), Çiya (dağ) ve Şîlan (yaban gülü) gibi isimler kimsede olmayan, nadir ve zarif Kürtçe isimlerin harika örnekleridir."
        }
      ],
      en: [
        {
          question: "What are some rare and unique Kurdish baby names?",
          answer: "Names like Zerya (ocean), Çiya (mountain), and Şîlan (wild rose) are wonderful examples of rare, elegant, and distinctive Kurdish names."
        }
      ],
      de: [
        {
          question: "Welche sind seltene und einzigartige kurdische Babynamen?",
          answer: "Namen wie Zerya (Ozean), Çiya (Berg) und Şîlan (Heckenrose) sind hervorragende Beispiele für seltene, elegante und unverwechselbare kurdische Namen."
        }
      ],
      ar: [
        {
          question: "ما هي بعض الأسماء الكردية النادرة والمميزة؟",
          answer: "تعد أسماء مثل زريا (Zerya - المحيط)، وجيا (Çiya - الجبل)، وشيلان (Şîlan - الوردة البرية) أمثلة رائعة على الأسماء الكردية النادرة والأنيقة والفريدة."
        }
      ]
    },
    "famous-100-boys-names": {
      tr: [
        {
          question: "En ünlü Kürtçe erkek ismi hangisidir?",
          answer: "Azad (özgür), Baran (yağmur), Agît (yiğit), Berzan (rehber) ve Zana (bilge) tarihten günümüze en çok tercih edilen ve en ünlü Kürtçe erkek isimlerinin başında gelir."
        },
        {
          question: "Kürtçe erkek isimleri seçerken nelere dikkat edilmelidir?",
          answer: "İsimlerin taşıdığı derin anlama, telaffuz kolaylığına ve Kürt kültürünü yansıtan asil mitolojik veya doğal unsurlara dikkat edilmesi önerilir."
        }
      ],
      en: [
        {
          question: "Which are the most famous Kurdish boys names?",
          answer: "Azad (free), Baran (rain), Agît (brave), Berzan (guide), and Zana (wise) are among the most preferred and famous Kurdish boys names from history to the present day."
        },
        {
          question: "What should be considered when choosing a Kurdish boy name?",
          answer: "It is recommended to consider the deep meaning of the name, the ease of pronunciation, and noble mythological or natural elements reflecting Kurdish culture."
        }
      ],
      de: [
        {
          question: "Welches sind die bekanntesten kurdischen Jungennamen?",
          answer: "Azad (frei), Baran (Regen), Agît (tapfer), Berzan (Führer) und Zana (weise) gehören zu den beliebtesten und berühmtesten kurdischen Jungennamen."
        },
        {
          question: "Was sollte bei der Wahl eines kurdischen Jungennamens beachtet werden?",
          answer: "Es wird empfohlen, auf die tiefe Bedeutung des Namens, die einfache Aussprache sowie auf edle mythologische oder natürliche Elemente zu achten."
        }
      ],
      ar: [
        {
          question: "ما هو أشهر اسم ولد كردي؟",
          answer: "تعد أسماء آزاد (الحر)، وباران (المطر)، وأغيت (الشجاع)، وبرزان (الدليل)، وزانا (الحكيم) من بين أكثر أسماء الأولاد الكردية شهرة وتفضيلاً منذ التاريخ وحتى اليوم."
        },
        {
          question: "ما الذي يجب مراعاته عند اختيار اسم ولد كردي؟",
          answer: "يُنصح بمراعاة المعنى العميق للاسم، وسهولة نطقة، والعناصر الأسطورية أو الطبيعية النبيلة التي تعكس الثقافة الكردية العريقة."
        }
      ]
    },
    "famous-100-girls-names": {
      tr: [
        {
          question: "En ünlü Kürtçe kız ismi hangisidir?",
          answer: "Arîn (kutsal ateş), Berfîn (kardelen), Evîn (aşk), Havin (yaz) ve Zelal (berrak) tarihten günümüze en çok tercih edilen ve en ünlü Kürtçe kız isimlerinin başında gelir."
        },
        {
          question: "Kürtçe kız çocuk isimleri seçerken nelere dikkat edilmelidir?",
          answer: "Kız çocuk isimlerinde tını yumuşaklığı ve ses melodisinin yanı sıra doğayı, ışığı ve zarafeti temsil eden derin anlamlar seçilmesi önerilir."
        }
      ],
      en: [
        {
          question: "Which are the most famous Kurdish girls names?",
          answer: "Arîn (sacred fire), Berfîn (snowdrop), Evîn (love), Havin (summer), and Zelal (clear) are among the most preferred and famous Kurdish girls names from history to the present day."
        },
        {
          question: "What should be considered when choosing a Kurdish girl name?",
          answer: "For girls' names, it is highly recommended to consider the softness and melody of the pronunciation alongside deep meanings representing nature, light, and elegance."
        }
      ],
      de: [
        {
          question: "Welches sind die bekanntesten kurdischen Mädchennamen?",
          answer: "Arîn (heiliges Feuer), Berfîn (Schneeglöckchen), Evîn (Liebe), Havin (Sommer) und Zelal (klar) gehören zu den beliebtesten und berühmtesten kurdischen Mädchennamen."
        },
        {
          question: "Was sollte bei der Wahl eines kurdischen Mädchennamens beachtet werden?",
          answer: "Es wird empfohlen, auf eine weiche und melodische Aussprache sowie auf tiefgründige Bedeutungen zu achten, die Natur, Helligkeit und Eleganz darstellen."
        }
      ],
      ar: [
        {
          question: "ما هو أشهر اسم بنت كردي؟",
          answer: "تعد أسماء آرين (النار المقدسة)، وبارفين (زهرة الثلج)، وإيفين (الحب)، وهافين (الصيف)، وزلال (الصافية) من بين أكثر أسماء البنات الكردية شهرة وتفضيلاً منذ التاريخ وحتى اليوم."
        },
        {
          question: "ما الذي يجب مراعاته عند اختيار اسم بنت كردي؟",
          answer: "يُنصح بمراعاة رقة ولحن النطق في أسماء الإناث، بالإضافة إلى المعاني العميقة التي تعبر عن الطبيعة الخلابة، والضياء، والأنوثة الأنيقة."
        }
      ]
    },
    "modern-100-names": {
      tr: [
        {
          question: "En ünlü modern Kürtçe bebek isimleri hangileridir?",
          answer: "Arjen (köz), Lavin (güzel), Nûjen (modern), Miraz (dilek) ve Viyan (irade) son yıllarda popülerlik kazanan en seçkin modern Kürtçe isimlerdendir."
        },
        {
          question: "Modern Kürtçe isimlerin özellikleri nelerdir?",
          answer: "Modern Kürtçe bebek isimleri genellikle kısa, iki heceli, melodik ve telaffuz kolaylığı sağlayan fonetik yapılara sahiptir."
        }
      ],
      en: [
        {
          question: "What are the most popular modern Kurdish baby names?",
          answer: "Arjen (fiery), Lavin (beautiful), Nûjen (modern), Miraz (wish), and Viyan (willpower) are some of the most distinguished modern Kurdish names trending recently."
        },
        {
          question: "What are the key features of modern Kurdish names?",
          answer: "Modern Kurdish names are typically short, two-syllabled, melodic, and possess phonetic structures that make them highly easy to pronounce globally."
        }
      ],
      de: [
        {
          question: "Welches sind die beliebtesten modernen kurdischen Babynamen?",
          answer: "Arjen (feurig), Lavin (schön), Nûjen (modern), Miraz (Wunsch) und Viyan (Willenskraft) sind einige der elegantesten modernen kurdischen Namen der letzten Jahre."
        },
        {
          question: "Was zeichnet moderne kurdische Namen aus?",
          answer: "Moderne kurdische Babynamen sind in der Regel kurz, zweisilbig, melodisch und weisen phonetische Strukturen auf, die weltweit leicht auszusprechen sind."
        }
      ],
      ar: [
        {
          question: "ما هي أشهر أسماء الأطفال الكردية الحديثة؟",
          answer: "تعد أسماء آرجين (وهج النار)، لافين (الجميل)، نوجين (الحديث)، ميراز (الأمنية)، وفيان (العزيمة) من أبرز الأسماء الكردية الحديثة والمعاصرة رواجاً مؤخراً."
        },
        {
          question: "ما هي مميزات الأسماء الكردية الحديثة؟",
          answer: "تتميز الأسماء الكردية المعاصرة بقصرها، وتكونها من مقطعين صوتيين، ونغمتها الموسيقية العذبة، وسهولة نطقها في مختلف اللغات."
        }
      ]
    },
    "classic-100-names": {
      tr: [
        {
          question: "Klasik ve geleneksel Kürtçe isimlerin kaynağı nedir?",
          answer: "Bu isimler genellikle Kürt tarihindeki meşhur emirliklerden (Mervaniler, Erdelan, Behdinan), köklü aşiret yapılarından, halk destanlarından ve klasik Kürt edebiyatından (Feqîyê Teyran, Ahmedi Xani) gelir."
        },
        {
          question: "Kürtçe klasik erkek isimlerine örnekler nelerdir?",
          answer: "Baban (emirilik), Deysem (tarihi lider), Keyhusrev (hükümdar), Mîrxan (beylerin hanı) ve Pêşewa (önder) gibi isimler öne çıkan ağır ve asil klasik isimlerdendir."
        }
      ],
      en: [
        {
          question: "What is the source of classical and traditional Kurdish names?",
          answer: "These names mostly originate from prominent Kurdish historical emirates (Marwanids, Ardelan, Badinan), ancient tribal federations, epic folk tales, and classical literary masters."
        },
        {
          question: "What are some prominent traditional Kurdish boy names?",
          answer: "Names such as Baban (emirate), Deysem (historical leader), Keyhusrev (monarch), Mîrxan (khan of princes), and Pêşewa (pioneer) are distinguished examples of classical names."
        }
      ],
      de: [
        {
          question: "Was ist der Ursprung klassischer und traditioneller kurdischer Namen?",
          answer: "Diese Namen stammen meist aus bedeutenden kurdischen historischen Emiraten (Marwaniden, Ardelan, Badinan), alten Stammesbünden, Volksepen und klassischen Literaten."
        },
        {
          question: "Welche sind bekannte traditionelle kurdische Jungennamen?",
          answer: "Namen wie Baban (Emirat), Deysem (historischer Führer), Keyhusrev (Herrscher), Mîrxan (Fürst der Khane) und Pêşewa (Anführer) sind herausragende Beispiele für klassische Namen."
        }
      ],
      ar: [
        {
          question: "ما هو مصدر الأسماء الكردية الكلاسيكية والتقليدية؟",
          answer: "تستمد هذه الأسماء جذورها من الإمارات الكردية التاريخية الشهيرة (المروانية، أردلان، بهدينان)، الاتحادات القبلية العريقة، الملاحم الشعبية، وأساطين الأدب الكلاسيكي الكردي."
        },
        {
          question: "ما هي أبرز أسماء الأولاد الكردية التراثية والتقليدية؟",
          answer: "تعد أسماء مثل بابان (إمارة)، ديسم (قائد تاريخي)، كيهسرو (ملك)، ميرخان (أمير الخانات)، وبيشوا (الزعيم) من الأسماء الكلاسيكية المهيبة والنبيلة للأولاد."
        }
      ]
    },
    "nature-100-names": {
      tr: [
        {
          question: "Kürtçe doğa isimlerinin kültürel önemi nedir?",
          answer: "Kürtçe isimlerde doğa bir yaşam biçimidir. Dağlar, coşkun nehirler ve kır çiçekleri özgürlüğü, asilliği ve dirençli duruşu temsil eder."
        },
        {
          question: "En çok tercih edilen Kürtçe doğa isimleri hangileridir?",
          answer: "Baran (yağmur), Çiya (dağ), Ava (su), Havin (yaz) ve Beybûn (papatya) gibi isimler doğa temalı en popüler Kürtçe isimlerdendir."
        }
      ],
      en: [
        {
          question: "What is the cultural significance of Kurdish nature names?",
          answer: "In Kurdish names, nature is an expression of freedom, nobility, and resilience. Grand mountains, fast-flowing rivers, and wildflowers are deeply celebrated."
        },
        {
          question: "What are some highly preferred Kurdish nature names?",
          answer: "Names like Baran (rain), Çiya (mountain), Ava (water), Havin (summer), and Beybûn (daisy) are among the most beloved nature-inspired names."
        }
      ],
      de: [
        {
          question: "Welche kulturelle Bedeutung haben kurdische Naturnamen?",
          answer: "In kurdischen Namen ist die Natur Ausdruck von Freiheit, Adel und Beständigkeit. Majestätische Berge, wilde Flüsse und Wiesenblumen werden tief verehrt."
        },
        {
          question: "Welches sind beliebte kurdische Naturnamen?",
          answer: "Namen wie Baran (Regen), Çiya (Berg), Ava (Wasser), Havin (Sommer) und Beybûn (Kamille) gehören zu den beliebtesten kurdischen Naturnamen."
        }
      ],
      ar: [
        {
          question: "ما هي الأهمية الثقافية للأسماء الكردية المستوحاة من الطبيعة؟",
          answer: "تعبر الطبيعة في الأسماء الكردية عن الحرية والنبل والصمود. وتلقى جبال كردستان وأنهارها وزهورها البرية مكانة عظيمة في تسمية الأطفال."
        },
        {
          question: "ما هي أبرز الأسماء الكردية المستمدة من الطبيعة؟",
          answer: "تعد أسماء باران (المطر)، شيا (الجبل)، آوا (الماء)، هافين (الصيف)، وبيبون (الأقحوان) من أكثر الأسماء المحببة المستوحاة من الطبيعة."
        }
      ]
    },
    "mythology-100-names": {
      tr: [
        {
          question: "Kürtçe mitolojik ve destansı isimlerin kökeni nedir?",
          answer: "Bu isimler genellikle antik Mezopotamya mitolojisinden, Zerdüşt felsefesinden, Mem û Zîn destanından ve ulu tarihi Kürt beyliklerinden gelir."
        },
        {
          question: "En ünlü Kürtçe destansı kahraman isimleri hangileridir?",
          answer: "Kawa (demirci), Rustem (efsanevi kahraman), Siyamend (destan kahramanı) ve Azad (özgür) gibi isimler öne çıkan destansı isimlerdendir."
        }
      ],
      en: [
        {
          question: "What is the origin of mythological and epic Kurdish names?",
          answer: "These names originate from ancient Mesopotamian mythology, Zoroastrian philosophy, the legendary epic Mem u Zin, and grand historical Kurdish principalities."
        },
        {
          question: "Who are some prominent epic heroes in Kurdish names?",
          answer: "Kawa (the blacksmith), Rustem (the mythological champion), Siyamend (the epic hero), and Azad (the free) are outstanding examples."
        }
      ],
      de: [
        {
          question: "Was ist der Ursprung mythologischer und epischer kurdischer Namen?",
          answer: "Diese Namen entstammen der antiken mesopotamischen Mythologie, der zoroastrischen Philosophie, dem Epos Mem u Zin sowie historischen kurdischen Fürstentümern."
        },
        {
          question: "Welches sind bekannte epische Heldennamen auf Kurdisch?",
          answer: "Namen wie Kawa (der Schmied), Rustem (der mythologische Held), Siyamend (der epische Held) und Azad (der Freie) sind herausragende Beispiele."
        }
      ],
      ar: [
        {
          question: "ما هو أصل الأسماء الكردية الأسطورية والملحمية؟",
          answer: "تستمد هذه الأسماء أصولها من ميثولوجيا ميزوبوتاميا القديمة، الفلسفة الزرادشتية العريقة، ملحمة مم وزين الخالدة، والإمارات التاريخية الكردية الكبرى."
        },
        {
          question: "ما هي أشهر أسماء الأبطال الأسطوريين في الثقافة الكردية؟",
          answer: "تعد أسماء كاوه (الحداد الأسطوري)، رستم (البطل الخارق)، سيامند (بطل الملحمة العاطفية)، وآزاد (الحر) من أبرز تلك الأسماء الملحمية الشامخة."
        }
      ]
    },
    "rare-100-names": {
      tr: [
        {
          question: "Kürtçe nadir ve duyulmamış isimlerin kaynağı nedir?",
          answer: "Bu isimler genellikle eski Kürtçe yazılı metinlerden, destanlardan, uzak sınır köylerindeki pastoral ağızlardan ve klasik edebiyat arşivlerinden gelir."
        },
        {
          question: "Bebeğime nadir bir Kürtçe isim seçerken nelere dikkat etmeliyim?",
          answer: "İsmin tınısının melodik olmasına, kültürel köklerine ve modern telaffuz kolaylığına dikkat etmeniz önerilir."
        }
      ],
      en: [
        {
          question: "What is the source of rare and unheard Kurdish names?",
          answer: "These names are sourced from classical manuscripts, epics, pastoral dialects in remote villages, and historic literary archives."
        },
        {
          question: "What should I consider when choosing a rare Kurdish name?",
          answer: "It is recommended to pay attention to its melodic sound, cultural authenticity, and how easily it can be pronounced internationally."
        }
      ],
      de: [
        {
          question: "Woher stammen seltene und unbekannte kurdische Namen?",
          answer: "Diese Namen stammen meist aus klassischen Handschriften, historischen Epen, ländlichen Dialekten entlegener Täler und literarischen Archiven."
        },
        {
          question: "Was sollte ich bei der Auswahl eines seltenen kurdischen Namens beachten?",
          answer: "Achten Sie auf den melodischen Klang, die historische Tiefe sowie auf eine einfache Aussprache im Alltag."
        }
      ],
      ar: [
        {
          question: "ما هو مصدر الأسماء الكردية الغريبة والنادرة؟",
          answer: "تستمد هذه الأسماء النادرة من المخطوطات الأدبية القديمة، القصص الشعبية، اللهجات الجبلية العتيقة في القرى النائية، والأرشيف الثقافي الكلاسيكي."
        },
        {
          question: "ما الذي يجب مراعاته عند اختيار اسم كربد نادر لطفلي؟",
          answer: "يُنصح بمراعاة الجرس الموسيقي للاسم، وأصالته اللغوية العميقة، وسهولة نطفه وكتابته في البيئة المعاصرة."
        }
      ]
    },
    "artistic-100-names": {
      tr: [
        {
          question: "Kürtçe edebi ve sanatsal isimlerin anlam dünyası nasıldır?",
          answer: "Edebi ve sanatsal isimler genellikle şiiri (helbest), müziği (saz, lori, deng), renkleri, estetik duruşu ve zarafeti simgeler."
        },
        {
          question: "En popüler Kürtçe sanatsal ve edebi isimler hangileridir?",
          answer: "Helbest (şiir), Lorin (ezgi, ninni), Zerya (deniz), Baran (yağmur) ve Dilşad (mutlu gönül) en sevilen edebi isimlerdendir."
        }
      ],
      en: [
        {
          question: "What themes do Kurdish literary and artistic names represent?",
          answer: "Literary and artistic names generally signify poetry (helbest), traditional music (saz, lori, deng), natural colors, and elegant aesthetics."
        },
        {
          question: "What are some highly favored Kurdish artistic names?",
          answer: "Names like Helbest (poetry), Lorin (melody, lullaby), Zerya (ocean), Baran (rain), and Dilshad (joyful heart) are highly popular."
        }
      ],
      de: [
        {
          question: "Welche Themen repräsentieren kurdische literarische und künstlerische Namen?",
          answer: "Diese Namen symbolisieren oft Poesie (Helbest), Musik (Saz, Lori, Deng), ästhetische Zyklen der Natur und edle Zarafet."
        },
        {
          question: "Welches sind beliebte künstlerische kurdische Namen?",
          answer: "Namen wie Helbest (Poesie), Lorin (Wiegenlied), Zerya (Meer), Baran (Regen) und Dilshad (frohes Herz) erfreuen sich großer Beliebtheit."
        }
      ],
      ar: [
        {
          question: "ما هي الموضوعات التي تعبر عنها الأسماء الكردية الأدبية والفنية؟",
          answer: "تعبر هذه الأسماء عن عوالم الشعر والقصائد (هيلبست)، الأنغام والآلات الموسيقية (ساز، لوري)، الألوان الزاهية، والجمال الإنساني الراقي."
        },
        {
          question: "ما هي أشهر الأسماء الكردية ذات الطابع الفني والأدبي؟",
          answer: "تعد أسماء مثل هيلبست (الشعر)، لورين (الأنشودة)، زريا (البحر)، باران (المطر)، ودلشاد (القلب السعيد) من أجمل الأسماء الفنية."
        }
      ]
    },
    "regional-100-names": {
      tr: [
        {
          question: "Bölgesel ve coğrafi Kürtçe isimlerin anlamı nedir?",
          answer: "Bu isimler Kürt coğrafyasındaki ulu dağlar, hırçın nehirler ve kadim şehirlerin (Botan, Munzur, Dersim) adlarından esinlenmiştir."
        }
      ],
      en: [
        {
          question: "What do regional Kurdish names signify?",
          answer: "These names are inspired by majestic mountains, wild rivers, and ancient towns of the Kurdish homeland (such as Botan, Munzur, and Dersim)."
        }
      ],
      de: [
        {
          question: "Was bedeuten regionale kurdische Namen?",
          answer: "Diese Namen sind von majestätischen Bergen, wilden Flüssen und historischen Städten der Heimat (wie Botan, Munzur und Dersim) inspiriert."
        }
      ],
      ar: [
        {
          question: "ما الذي تعنيه الأسماء الكردية الإقليمية والجغرافية؟",
          answer: "تستوحي هذه الأسماء معانيها من الجبال الشامخة والأنهار الجارية والمدن التاريخية العريقة في كوردستان (مثل بوتان، ومُنْزُر، وديرسم)."
        }
      ]
    },
    "folklore-100-names": {
      tr: [
        {
          question: "Folklorik Kürtçe isimler hangi kaynaklardan gelir?",
          answer: "Bu isimler, bilge Dengbêj stranlarından, sözlü masal anlatılarından ve Mem û Zîn gibi ölümsüz halk destanlarından süzülmüştür."
        }
      ],
      en: [
        {
          question: "Where do folkloric Kurdish names originate from?",
          answer: "These names originate from traditional Dengbej songs, fairy tales, and immortal folk epics like Mem u Zin."
        }
      ],
      de: [
        {
          question: "Woher stammen folkloristische kurdische Namen?",
          answer: "Diese Namen stammen aus traditionellen Dengbêj-Liedern, mündlichen Märchen und unsterblichen Volksepen wie Mem u Zin."
        }
      ],
      ar: [
        {
          question: "ما هي مصادر الأسماء الكردية الفولكلورية والقصصية؟",
          answer: "تأتي هذه الأسماء من أغاني الدنبج التراثية والقصص الشعبية والملاحم الخالدة مثل ملحمة مم وزين."
        }
      ]
    },
    "virtue-100-names": {
      tr: [
        {
          question: "Erdem temalı Kürtçe isimler neyi temsil eder?",
          answer: "Bu isimler dürüstlük, cesaret, cömertlik, sadakat ve güzel ahlak gibi evrensel insani değerleri yüceltir."
        }
      ],
      en: [
        {
          question: "What do virtue-themed Kurdish names represent?",
          answer: "These names represent universal human ethics such as honesty, courage, generosity, loyalty, and pure moral character."
        }
      ],
      de: [
        {
          question: "Was repräsentieren tugendhafte kurdische Namen?",
          answer: "Diese Namen symbolisieren universelle menschliche Werte wie Ehrlichkeit, Tapferkeit, Großzügigkeit, Loyalität und moralische Reinheit."
        }
      ],
      ar: [
        {
          question: "ما الذي تمثله أسماء الفضائل الكردية؟",
          answer: "تجسد هذه الأسماء القيم الإنسانية والأخلاقية الرفيعة مثل الصدق، والشجاعة، والكرم، والوفاء، والسمو الروحي."
        }
      ]
    },
    "dynasty-100-names": {
      tr: [
        {
          question: "Tarihi hükümdar ve hanedan isimlerinin önemi nedir?",
          answer: "Mervaniler, Eyyubiler, Zendliler gibi ulu devletlerden ve hanedanlardan gelen asil, gururlu ve liderlik bildiren isimlerdir."
        }
      ],
      en: [
        {
          question: "What is the importance of historical Kurdish dynasty names?",
          answer: "These are noble, proud names carrying a sense of leadership, originating from historical empires and principalities like the Ayyubids, Marwanids, and Zands."
        }
      ],
      de: [
        {
          question: "Was ist die Bedeutung historischer kurdischer Herrschernamen?",
          answer: "Es sind edle, stolze Namen, die Führungsanspruch vermitteln und aus historischen Dynastien wie den Ayyubiden, Marwaniden und Zand stammen."
        }
      ],
      ar: [
        {
          question: "ما هي أهمية أسماء الحكام والسلالات الكردية التاريخية؟",
          answer: "هي أسماء نبيلة ومهيبة تعبر عن القيادة والأصالة، مستوحاة من الدول والإمارات العريقة مثل الأيوبيين، والمروانيين، والزنديين."
        }
      ]
    },
    "color-100-names": {
      tr: [
        {
          question: "Kürtçe renk ve ışık isimleri ne anlama gelir?",
          answer: "Doğanın ve gökyüzünün en parlak tonlarını, görsel estetiği, ilahi nurları ve ışık parıltılarını simgeler."
        }
      ],
      en: [
        {
          question: "What do Kurdish color and light names symbolize?",
          answer: "They symbolize the brightest shades of nature and the sky, visual aesthetics, divine illumination, and brilliant sparkles of light."
        }
      ],
      de: [
        {
          question: "Was symbolisieren kurdische Farb- und Lichtnamen?",
          answer: "Sie symbolisieren die hellsten Farbtöne der Natur, visuelle Ästhetik, göttlichen Glanz und funkelndes Licht."
        }
      ],
      ar: [
        {
          question: "على ماذا تدل أسماء الألوان والضوء الكردية؟",
          answer: "ترمز إلى ألوان الطبيعة الزاهية ووهج الشمس والنجوم، والجمال البصري، والضياء والنور الإلهي الساطع."
        }
      ]
    },
    "flower-100-names": {
      tr: [
        {
          question: "Kürtçe çiçek isimlerinin fonetik özelliği nedir?",
          answer: "Bahar uyanışını, narin kır çiçeklerini ve Mezopotamya florasını yansıtan son derece yumuşak ve melodik tınılara sahiptirler."
        }
      ],
      en: [
        {
          question: "What are the phonetic features of Kurdish flower names?",
          answer: "They have highly soft, sweet, and melodic pronunciations reflecting the spring awakening and delicate Mesopotamian wildflowers."
        }
      ],
      de: [
        {
          question: "Was sind die Besonderheiten kurdischer Blumennamen?",
          answer: "Sie besitzen sehr weiche, süße und melodische Klänge, die das Erwachen des Frühlings und die zarte mesopotamische Flora widerspiegeln."
        }
      ],
      ar: [
        {
          question: "ما هي الميزة اللفظية لأسماء الزهور والنباتات الكردية؟",
          answer: "تتميز بنغمة نطق رقيقة وجرس موسيقي عذب يعبر عن تفتح الزهور الربيعية البرية وجمال الطبيعة."
        }
      ]
    },
    "spiritual-100-names": {
      tr: [
        {
          question: "Manevi ve kutsal Kürtçe isimler hangi temaları içerir?",
          answer: "Kadim inançlardan gelen duaları, kutsal duaları, ruhani huzuru, dinginliği ve yüce manevi arınmışlığı kapsar."
        }
      ],
      en: [
        {
          question: "What themes do spiritual and sacred Kurdish names cover?",
          answer: "They cover blessings, ancient belief prayers, inner peace, cosmic harmony, and sublime spiritual purity."
        }
      ],
      de: [
        {
          question: "Welche Themen decken spirituelle kurdische Namen ab?",
          answer: "Sie umfassen göttlichen Segen, alten Glauben, inneren Frieden, kosmische Harmonie und moralische Reinheit."
        }
      ],
      ar: [
        {
          question: "ما هي السمات الروحية والمقدسة في الأسماء الكردية؟",
          answer: "تشمل الأدعية، والبركة، والسكينة، والسلام الداخلي، والسمو الروحي والأخلاقي المستمد من المعتقدات العريقة."
        }
      ]
    }
  };

  const cleanId = postId.toLowerCase();
  const cleanLng = (lng || "tr").toLowerCase();
  const activeLng = ["tr", "en", "de", "ar"].includes(cleanLng) ? cleanLng : "tr";

  return faqs[cleanId]?.[activeLng] || faqs["girls-names-list"][activeLng];
}

export default function BlogPost() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lng = i18n.language || 'tr';
  
  const posts = getBlogPostsByLang(lng);
  const post = posts.find(p => p.slug === slug);
  const masterPost = blogPostsRegistry.find(p => p.id === post?.id);

  const [loadedPost, setLoadedPost] = useState<BlogContentPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" ? window.innerWidth >= 1024 : true);
  const [allNames, setAllNames] = useState<any[]>([]);

  useEffect(() => {
    loadAllNames().then(names => {
      setAllNames(names);
    }).catch(err => {
      console.warn("Failed to load names for blog internal linking:", err);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (!post) return;
    
    setLoading(true);
    loadBlogPostContent(lng, post.id).then(data => {
      if (data) {
        setLoadedPost(data);
      } else {
        setLoadedPost({
          title: post.title,
          desc: post.desc,
          content: ""
        });
      }
      setLoading(false);
    });
  }, [lng, post?.id]);

  const rawContent = loadedPost?.content || "";

  const content = useMemo(() => {
    if (!rawContent || allNames.length === 0) return rawContent;
    return injectInternalLinks(rawContent, allNames, lng);
  }, [rawContent, allNames, lng]);

  if (!post) {
    return <Navigate to={generatePath(lng, 'blog')} replace />;
  }

  if (loading) {
    return (
      <main className="main-container container-custom max-w-3xl mx-auto pt-8 pb-20">
        <div className="content-card animate-pulse !p-8 bg-[#FAFAFA]">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-6"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          </div>
        </div>
      </main>
    );
  }

  const title = loadedPost?.title || post.title;
  const desc = loadedPost?.desc || post.desc;

  const contentLength = content.length;
  const isShort = contentLength < 1500;
  const isMedium = contentLength >= 1500 && contentLength < 3500;
  const isLong = contentLength >= 3500;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kurdishname.com${generatePath(lng, 'blog', post.slug)}`
    },
    "headline": title,
    "description": desc,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author || "KurdishName Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "KurdishName",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kurdishname.com/logo.webp"
      }
    }
  };

  const faqItems = getFAQForPost(post.id, lng);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{title} | KurdishName</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={`${title} | KurdishName`} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`https://kurdishname.com${generatePath(lng, 'blog', post.slug)}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content={`${title} | KurdishName`} />
        <meta name="twitter:description" content={desc} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              (function() {
                const s = { ...articleSchema };
                delete s['@context'];
                return s;
              })(),
              (function() {
                const s = { ...faqSchema };
                delete s['@context'];
                return s;
              })()
            ]
          })}
        </script>
      </Helmet>

      <main className="main-container container-custom max-w-3xl mx-auto">
        <article className="content-card !p-5 sm:!p-8 md:!p-12 bg-[var(--surface)] border-0 shadow-xl">
          <Link to={generatePath(lng, 'blog')} className="inline-block mb-6 text-base font-medium text-[var(--accent)] hover:underline opacity-80">
            &larr; {t('finder_back')}
          </Link>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-6 leading-tight text-[var(--text)]">
            {title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm opacity-70 mb-8 pb-8 border-b border-[var(--border)]">
            <span>{post.author}</span>
            <span>{post.date}</span>
          </div>



          {/* Adaptive Content Area */}
          <div style={{
            display: "flex",
            flexDirection: isLong && isDesktop ? "row" : "column",
            alignItems: "flex-start",
            gap: "2rem",
            width: "100%",
            marginTop: "2rem"
          }}>
            {/* Main Content Column */}
            <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
              <div className="prose-premium selectable-text">
                <Markdown>{content.replaceAll('\\n', '\n')}</Markdown>
              </div>


            </div>


          </div>

          {/* Premium SEO Block */}
          <section className="mt-16 content-card bg-gradient-to-br from-[var(--surface-alt)] to-[var(--surface)] border border-[var(--border)] p-8 sm:p-12 rounded-3xl shadow-lg relative overflow-hidden select-text">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-2xl font-serif font-black mb-6 tracking-tight flex items-center gap-3 select-none">
              <span className="w-8 h-[2px] bg-[var(--accent)]"></span>
              Kürtçe İsim Kültürü ve Edebiyatı Rehberi
            </h2>
            <div className="prose-premium text-sm opacity-95 leading-relaxed space-y-6 text-[var(--text)]">
              <p>
                Mezopotamya’nın kadim dillerinden biri olan Kürtçe, bünyesinde barındırdığı zengin fonetik yapı ve edebi derinlikle anne ve baba adaylarına eşsiz bir isim hazinesi sunmaktadır. Bebeğiniz için en anlamlı adımı atarken araştırılan <Link to={generatePath(lng, 'category', 'kiz')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">{t("seo_link_girls_names")}</Link> portföyü, doğadan, asil destanlardan ve köklü Mezopotamya kültüründen süzülen naif kelimelerle şekillenmektedir. Aynı şekilde güç, cesaret ve bilgeliği simgeleyen <Link to={generatePath(lng, 'category', 'erkek')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">{t("seo_link_boys_names")}</Link> ve <Link to={generatePath(lng, 'category', 'kiz')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">{t("seo_link_baby_names")}</Link> de melodik tınılarıyla çocuklarınızın karakterine bir ömür boyu asalet katacak niteliktedir. Günümüzde geleneksel bağları koparmadan modern dünya dillerine de uyum sağlayan bu özgün isimler, hem telaffuz kolaylığı hem de estetik derinliğiyle son yılların en çok tercih edilen trendleri arasında yer almaktadır.
              </p>
              <p>
                Doğru adı seçme sürecinde ailelere rehberlik eden platformumuz, binlerce yıllık etimolojik kökleri inceleyerek en güncel isim veritabanını bir araya getirmektedir. Aradığınız ismin anlamını, kökenini ve kültürel bağlarını saniyeler içinde keşfetmenizi sağlayan gelişmiş <Link to={generatePath(lng, 'finder')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">{t("seo_link_name_finder")}</Link> aracımız sayesinde, harf, cinsiyet ve tema filtrelemeleriyle aradığınız mükemmel seçeneğe kolayca ulaşabilirsiniz. Kürt edebiyatının en seçkin divan motiflerinden, bilge Dengbêj stranlarından ve Mezopotamya’nın yüce dağlarından ilham alan bu **kürtçe kelimeler ve anlamları**, sadece birer isim olmanın ötesinde çocuklarınıza geleceğe gururla taşıyacakları kültürel birer miras sunmaktadır.
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-sm bg-[var(--border)] px-3 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
