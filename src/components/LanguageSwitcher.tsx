import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { switchLanguagePath } from '../utils/routes';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const languages = [
    { code: 'tr', label: 'TR' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'ar', label: 'AR' },
  ];

  const changeLang = (code: string) => {
    const newPath = switchLanguagePath(location.pathname, code);
    i18n.changeLanguage(code);
    navigate(newPath, { replace: true });
  };

  return (
    <div>
      {/* Mobile-only Custom Language Dropdown */}
      <div className="inline-block sm:hidden relative">
        <select
          value={i18n.language || 'tr'}
          onChange={(e) => changeLang(e.target.value)}
          aria-label={t("aria_lang_switch_select", "Dil Seçimi")}
          className="lang-select-dropdown"
        >
          {languages.map((lng) => (
            <option key={lng.code} value={lng.code}>
              {lng.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop-only Lang Buttons List */}
      <div className="hidden sm:flex items-center">
        {languages.map((lng, idx) => (
          <span key={lng.code} style={{ display: "flex", alignItems: "center" }}>
            {idx > 0 && (
              <span style={{ width: "1px", height: "14px", backgroundColor: "var(--border)", margin: "0 0.4rem" }} />
            )}
            <button
              onClick={() => changeLang(lng.code)}
              aria-label={t("aria_lang_switch", { lang: lng.label })}
              className="lang-switch-btn"
              style={{
                color: i18n.language === lng.code ? "var(--text)" : "var(--accent)",
                fontWeight: i18n.language === lng.code ? 700 : 400,
                textDecoration: i18n.language === lng.code ? "none" : "underline",
              }}
            >
              {lng.label}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
