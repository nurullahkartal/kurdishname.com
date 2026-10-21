"use client";

import React, { useState } from 'react';
import { Download, Check, Copy } from 'lucide-react';

export interface NameCardShareActionsProps {
  name: string;
  meaning: string;
  gender: 'female' | 'male' | 'unisex';
  genderText: string;
  origin: string;
  locale: string;
  pageUrl: string;
  labels: {
    whatsappBtn: string;
    whatsappMsg: string;
    downloadCardBtn: string;
    copyLinkBtn: string;
    copiedNotice: string;
  };
}

export default function NameCardShareActions({
  name,
  meaning,
  gender,
  genderText,
  origin,
  locale,
  pageUrl,
  labels,
}: NameCardShareActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${labels.whatsappMsg} ${pageUrl}`
  )}`;

  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(pageUrl || window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleDownloadCard = () => {
    if (typeof window === 'undefined' || isGenerating) return;
    setIsGenerating(true);

    const runDrawing = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsGenerating(false);
          return;
        }

        const isFemale = gender === 'female';

        // 1. Background Gradient based on Gender
        const grad = ctx.createLinearGradient(0, 0, 0, 1080);
        if (isFemale) {
          grad.addColorStop(0, '#FFF3F5');
          grad.addColorStop(1, '#FFFFFF');
        } else {
          grad.addColorStop(0, '#F0F5FF');
          grad.addColorStop(1, '#FFFFFF');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // 2. Decorative soft background circles for texture
        ctx.fillStyle = isFemale ? 'rgba(225, 29, 72, 0.028)' : 'rgba(37, 99, 235, 0.028)';
        ctx.beginPath();
        ctx.arc(1080, 0, 420, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 1080, 320, 0, Math.PI * 2);
        ctx.fill();

        // 3. Elegant inner border with rounded corners
        ctx.strokeStyle = isFemale ? 'rgba(225, 29, 72, 0.12)' : 'rgba(37, 99, 235, 0.12)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const pad = 50;
        const r = 24;
        ctx.roundRect(pad, pad, 1080 - pad * 2, 1080 - pad * 2, r);
        ctx.stroke();

        // 4. Top Brand Tagline
        const tagline =
          locale === 'ar'
            ? 'معجم الأسماء الكردية'
            : locale === 'de'
            ? 'KURDISCHES NAMENSWÖRTERBUCH'
            : locale === 'en'
            ? 'KURDISH NAMES DICTIONARY'
            : 'KÜRTÇE İSİMLER SÖZLÜĞÜ';

        ctx.font = 'italic 300 24px Georgia, serif';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.textAlign = 'center';
        ctx.fillText(tagline, 1080 / 2, 135);

        // 5. Main Large Name (Serif & Bold)
        ctx.font = '700 110px Georgia, serif';
        ctx.fillStyle = isFemale ? '#BE123C' : '#1D4ED8';
        ctx.fillText(name, 1080 / 2, 295);

        // 6. Proud Descriptive Subtitle
        ctx.font = '500 28px sans-serif';
        ctx.fillStyle = '#4B5563';

        let compositeLabel = '';
        if (locale === 'tr') {
          compositeLabel = `${genderText} ${origin} İsmi`;
        } else if (locale === 'en') {
          compositeLabel = `${origin} ${genderText} Name`;
        } else if (locale === 'de') {
          compositeLabel = `${origin} ${genderText}name`;
        } else {
          compositeLabel = `${genderText} · ${origin}`;
        }
        ctx.fillText(compositeLabel, 1080 / 2, 375);

        // 7. Elegant line separator
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(1080 / 2 - 160, 425);
        ctx.lineTo(1080 / 2 + 160, 425);
        ctx.stroke();

        // 8. The Name Meaning (Wrapped gracefully into multiple lines)
        ctx.font = 'italic 400 38px Georgia, serif';
        ctx.fillStyle = '#1F2937';

        const meaningQuotes = `“ ${meaning} ”`;
        const wrapWidth = 840;
        const wrapLineHeight = 62;
        const wrapStartY = 510;

        const words = meaningQuotes.split(' ');
        let line = '';
        let currentY = wrapStartY;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > wrapWidth && n > 0) {
            ctx.fillText(line.trim(), 1080 / 2, currentY);
            line = words[n] + ' ';
            currentY += wrapLineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), 1080 / 2, currentY);

        // 9. Brand Footer & Download Trigger
        const finishDownload = (drawFallback = false) => {
          const logoX = 1080 / 2 - 180;
          const logoY = 880;
          const logoW = 60;
          const logoH = 60;
          const logoR = 12;

          if (drawFallback) {
            const brandGrad = ctx.createLinearGradient(logoX, logoY, logoX, logoY + logoH);
            brandGrad.addColorStop(0, '#4F46E5');
            brandGrad.addColorStop(1, '#3730A3');
            ctx.fillStyle = brandGrad;
            ctx.beginPath();
            ctx.roundRect(logoX, logoY, logoW, logoH, logoR);
            ctx.fill();

            ctx.font = 'bold 26px sans-serif';
            ctx.fillStyle = '#FBBF24';
            ctx.textAlign = 'center';
            ctx.fillText('KN', logoX + logoW / 2, logoY + logoH / 2 + 9);
          }

          ctx.font = '600 36px sans-serif';
          ctx.fillStyle = '#1F2937';
          ctx.textAlign = 'left';
          ctx.fillText('KurdishName', logoX + logoW + 20, logoY + 34);

          ctx.font = '400 22px sans-serif';
          ctx.fillStyle = '#9CA3AF';
          ctx.fillText('kurdishname.com', logoX + logoW + 20, logoY + 58);

          const downloadLink = document.createElement('a');
          downloadLink.download = `kurdishname-${name.toLowerCase()}.png`;
          downloadLink.href = canvas.toDataURL('image/png');
          downloadLink.click();
          setIsGenerating(false);
        };

        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = () => {
          const logoX = 1080 / 2 - 180;
          const logoY = 880;
          const logoW = 60;
          const logoH = 60;
          const logoR = 12;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(logoX, logoY, logoW, logoH, logoR);
          ctx.clip();
          ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
          ctx.restore();

          finishDownload(false);
        };

        logoImg.onerror = () => {
          finishDownload(true);
        };

        logoImg.src = '/logo.webp';
      } catch (err) {
        console.error('Error generating name card image:', err);
        setIsGenerating(false);
      }
    };

    if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.ready !== 'undefined') {
      document.fonts.ready
        .then(runDrawing)
        .catch(() => runDrawing());
    } else {
      runDrawing();
    }
  };

  return (
    <div
      style={{
        marginTop: '1.75rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.75rem',
          width: '100%',
        }}
      >
        {/* 1. WhatsApp Button */}
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.whatsappBtn}
          style={{
            minHeight: '48px',
            padding: '0.75rem 1.25rem',
            background: '#25D366',
            color: '#FFFFFF',
            borderRadius: 'var(--r-lg)',
            fontSize: '0.925rem',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.22)',
            transition: 'transform 150ms ease, box-shadow 150ms ease',
            boxSizing: 'border-box',
          }}
          className="hover:scale-[1.01] active:scale-[0.99]"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.005L2 22l5.135-1.346a9.94 9.94 0 004.87 1.27h.005c5.507 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.18-2.92-7.061A9.925 9.925 0 0012.012 2zm5.72 14.1c-.244.688-1.201 1.25-1.654 1.336-.421.08-.949.124-2.855-.672-2.434-1.014-4-3.48-4.122-3.641-.121-.162-1.008-1.343-1.008-2.56 0-1.218.636-1.815.862-2.057.227-.243.498-.303.664-.303h.473c.152 0 .356-.057.556.425.2.486.688 1.678.749 1.8.06.121.101.263.02.425-.08.162-.121.263-.243.405-.121.141-.256.315-.365.425-.121.121-.248.253-.106.496.142.242.631 1.042 1.353 1.685.93.827 1.71 1.082 1.954 1.204.243.122.384.101.526-.06.141-.162.607-.708.769-.95.162-.243.324-.202.546-.121.222.08 1.413.667 1.655.789.243.121.404.182.464.283.06.101.06.587-.184 1.275z" />
          </svg>
          <span>{labels.whatsappBtn}</span>
        </a>

        {/* 2. Download Image Button */}
        <button
          type="button"
          onClick={handleDownloadCard}
          disabled={isGenerating}
          aria-label={labels.downloadCardBtn}
          style={{
            minHeight: '48px',
            padding: '0.75rem 1.25rem',
            background: 'var(--surface-2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            fontSize: '0.925rem',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            textAlign: 'center',
            cursor: isGenerating ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
            boxSizing: 'border-box',
            transition: 'background 150ms ease, border-color 150ms ease',
          }}
          className="hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.99]"
        >
          <Download size={20} aria-hidden="true" />
          <span>
            {isGenerating
              ? { tr: 'Hazırlanıyor...', en: 'Preparing...', de: 'Wird vorbereitet...', ar: 'جارٍ التحضير...' }[locale] ||
                'Hazırlanıyor...'
              : labels.downloadCardBtn}
          </span>
        </button>
      </div>

      {/* 3. Copy Link Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleCopyLink}
          style={{
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.825rem',
            fontWeight: 600,
            color: 'var(--accent)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            textDecoration: 'underline',
          }}
        >
          {isCopied ? (
            <>
              <Check size={16} color="var(--success, #16a34a)" aria-hidden="true" />
              <span style={{ color: 'var(--success, #16a34a)' }}>{labels.copiedNotice}</span>
            </>
          ) : (
            <>
              <Copy size={16} aria-hidden="true" />
              <span>{labels.copyLinkBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
