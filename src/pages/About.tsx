import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.0625rem",
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: "var(--text)",
        borderBottom: "1px solid var(--border)",
        paddingBottom: "0.5rem",
        marginBottom: "0.875rem",
      }}>
        {title}
      </h2>
      <div style={{ fontSize: "0.925rem", lineHeight: 1.8, color: "var(--text-muted)" }}>
        {children}
      </div>
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('about_title', 'Hakkımızda')} | KurdishName</title>
        <meta name="description" content={t('about_seo_desc')} />
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
        <h1 className="page-title">{t('about_title', 'Hakkımızda')}</h1>
        
        <Section title={t('about_vision_title', 'Misyon ve Vizyonumuz')}>
          <p>{t('about_vision_p', 'KurdishName, kültürel mirasın en değerli parçası olan isimlerin korunması, belgelenmesi ve gelecek nesillere doğru bir şekilde aktarılması amacıyla kurulmuştur. Dünyanın en kapsamlı 4 dilli Kürtçe isim kütüphanesi olarak, her ismin etimolojik kökenini, kültürel manasını ve fonetik yapısını bilimsel standartlarda ele alıyoruz.')}</p>
        </Section>

        <Section title={t('about_archive_title', 'Kapsamlı İsim Arşivi')}>
          <p>{t('about_archive_p', 'Veritabanımızda Kurmanci, Sorani, Zazaki ve Kelhuri gibi Kürtçe lehçelerinden derlenmiş 10.000\'den fazla özgün isim yer almaktadır. Her ismin arkasındaki doğa, bilgelik, sevgi ve asalet gibi kadim temaları modern bir arayüzle kullanıcılarımıza sunuyoruz.')}</p>
        </Section>

        <Section title={t('about_trans_title', 'Çok Dilli ve Güvenilir Rehber')}>
          <p>{t('about_trans_p', 'KurdishName; Türkçe, İngilizce, Almanca ve Arapça dillerinde tam senkronize destek sunmaktadır. Amacımız, dünyanın neresinde olursa olsun bebeklerine anlamlı ve kültürel bir bağ taşıyan bir isim vermek isteyen ebeveynlere küresel standartlarda, tarafsız ve bilimsel bir rehberlik yapmaktır.')}</p>
        </Section>

        <Section title={t('about_feedback_title', 'Katkı ve Geri Bildirim')}>
          <p>{t('about_feedback_p', 'Etimoloji ve dil çalışmaları sürekli gelişen bir alandır. Arşivimize yeni isimler önermek veya mevcut isimlerin anlamlarına katkı sağlamak isterseniz, İletişim sayfamız üzerinden ya da doğrudan mail ile bizimle her zaman irtibat kurabilirsiniz.')}</p>
        </Section>
      </motion.div>
    </>
  );
}
