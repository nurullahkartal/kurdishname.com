import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { getBlogPostsByLang } from '../data/blogPosts';
import { generatePath } from '../utils/routes';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language || 'tr';
  const posts = getBlogPostsByLang(lng);

  return (
    <>
      <Helmet>
        <title>{t('blog_title')} | KurdishName</title>
        <meta name="description" content={t('seo_blog_desc')} />
        <link rel="canonical" href={`https://kurdishname.com${generatePath(lng, 'blog')}`} />
        {["tr", "en", "de", "ar"].map((lang) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`https://kurdishname.com${generatePath(lang, 'blog')}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`https://kurdishname.com${generatePath('en', 'blog')}`}
        />
        <meta property="og:title" content={`${t('blog_title')} | KurdishName`} />
        <meta property="og:description" content={t('seo_blog_desc')} />
        <meta property="og:url" content={`https://kurdishname.com${generatePath(lng, 'blog')}`} />
      </Helmet>
      
      <main className="max-w-7xl mx-auto pt-8 pb-20 md:pb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent blur-[100px] -z-10 rounded-3xl pointer-events-none"></div>

        <h1 className="text-4xl md:text-5xl font-serif font-black mb-12 text-center tracking-tight select-none">{t('blog_title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            return (
              <article key={post.slug} className="content-card flex flex-col h-full !p-8 hover:-translate-y-1 transition-transform duration-300">
                <h2 className="text-2xl font-serif font-bold mb-3 leading-snug">
                  <Link to={generatePath(lng, 'blog', post.slug)} className="hover:text-[var(--accent)] transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-4">{post.date} &bull; {post.author}</p>
                <p className="flex-1 opacity-90 leading-relaxed mb-6 text-sm">
                  {post.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-[var(--surface-alt)] px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link 
                  to={generatePath(lng, 'blog', post.slug)}
                  className="mt-auto inline-flex justify-center items-center py-3 px-6 bg-[var(--surface-alt)] hover:bg-[var(--accent)] hover:text-white text-[var(--text)] rounded-xl font-bold transition-colors text-sm"
                >
                  {t('blog_read_more')}
                </Link>
              </article>
            );
          })}
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
              Mezopotamya'nın kadim dillerinden biri olan Kürtçe, bünyesinde barındırdığı zengin fonetik yapı ve edebi derinlikle anne ve baba adaylarına eşsiz bir isim hazinesi sunmaktadır. Bebeğiniz için en anlamlı adımı atarken araştırılan <Link to={generatePath(lng, 'category', 'kiz')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">kürtçe kız isimleri</Link>, <Link to={generatePath(lng, 'category', 'kiz')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">kürtçe kız adları</Link> ve <Link to={generatePath(lng, 'category', 'kiz')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">kürtçe isimler kız</Link> kategorileri, doğadan, asil destanlardan ve köklü Mezopotamya kültüründen süzülen naif kelimelerle şekillenmektedir. Aynı şekilde güç, cesaret ve bilgeliği simgeleyen <Link to={generatePath(lng, 'category', 'erkek')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">kürtçe erkek isimleri</Link> ve <Link to={generatePath(lng, 'category', 'kiz')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">kürtçe bebek isimleri</Link> de melodik tınılarıyla çocuklarınızın karakterine bir ömür boyu asalet katacak niteliktedir. Günümüzde geleneksel bağları koparmadan modern dünya dillerine de uyum sağlayan <Link to={generatePath(lng, 'category', 'kiz')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">kürtçe modern isimler</Link>, hem telaffuz kolaylığı hem de estetik derinliğiyle son yılların en çok tercih edilen trendleri arasında yer almaktadır.
            </p>
            <p>
              Doğru adı seçme sürecinde ailelere rehberlik eden platformumuz, binlerce yıllık etimolojik kökleri inceleyerek en güncel isim veritabanını bir araya getirmektedir. Aradığınız ismin anlamını, kökenini ve kültürel bağlarını saniyeler içinde keşfetmenizi sağlayan gelişmiş <Link to={generatePath(lng, 'finder')} className="font-bold hover:text-[var(--accent)] transition-colors text-[var(--accent)]">kürtçe isim bulucu</Link> aracımız sayesinde, harf, cinsiyet ve tema filtrelemeleriyle aradığınız mükemmel seçeneğe kolayca ulaşabilirsiniz. Kürt edebiyatının en seçkin divan motiflerinden, bilge Dengbêj stranlarından ve Mezopotamya’nın yüce dağlarından ilham alan bu **kürtçe kelimeler ve anlamları**, sadece birer isim olmanın ötesinde çocuklarınıza geleceğe gururla taşıyacakları kültürel birer miras sunmaktadır.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
