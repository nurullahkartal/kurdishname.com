import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NameData } from '../data/names';
import { generatePath } from '../utils/routes';
import { loadNamesForLetter, availableLetters } from '../utils/nameLoader';

export default function Sidebar() {
  const [popularNames, setPopularNames] = useState<NameData[]>([]);
  const { t, i18n } = useTranslation();
  const lng = i18n.language || 'tr';

  useEffect(() => {
    let active = true;
    async function load() {
      // Pick a random letter to select random popular names without loading the whole 14MB database!
      const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
      const names = await loadNamesForLetter(randomLetter);
      if (active && names.length > 0) {
        const shuffled = [...names].sort(() => 0.5 - Math.random());
        setPopularNames(shuffled.slice(0, 10));
      }
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <aside className="bg-[var(--surface)] p-6 md:p-8 rounded-2xl border border-[var(--border)] shadow-[0_4px_20px_rgb(0,0,0,0.02)] hidden lg:block">
      <h2 className="text-lg font-bold mb-6 text-[var(--text)]">{t('finder_result_title')}</h2>
      <div className="space-y-2">
        {popularNames.map(item => (
          <div key={`pop-${item.id}`} className="group">
            <Link to={generatePath(lng, 'name', item.id)} className="block p-3 rounded-xl hover:bg-[var(--surface-alt)] transition-colors border border-transparent hover:border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2">
                 <h3 className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors text-lg">{item.name}</h3>
                 <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-md ${
                   item.gender === 'female' ? 'bg-[var(--color-female)]/15 text-[var(--color-female)]' : 'bg-[var(--color-male)]/15 text-[var(--color-male)]'
                 }`}>
                   {item.gender === 'male' ? t('home_male') : t('home_female')}
                 </span>
              </div>
              <div className="border-l-[3px] border-[var(--accent)]/50 pl-3">
                 <p className="text-sm text-[var(--muted)] line-clamp-1 break-words font-medium">
                   {t(`name_meaning_${item.id}`, { defaultValue: item.meaning || t('no_meaning') })}
                 </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
}
