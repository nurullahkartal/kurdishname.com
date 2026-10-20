import fs from 'fs';
import path from 'path';
import { blogPostsRegistry } from '../lib/blog-registry';

const faqsPath = 'content/blog-faqs.json';
const existing = fs.existsSync(faqsPath) 
  ? JSON.parse(fs.readFileSync(faqsPath, 'utf-8')) 
  : {};

const missing = blogPostsRegistry.filter(p => !existing[p.id]);
console.log('Missing FAQs:', missing.length);

for (const post of missing) {
  const trPath = path.join('content/blog/tr', post.id + '.json');
  const enPath = path.join('content/blog/en', post.id + '.json');
  
  let trContent: any = {};
  let enContent: any = {};
  try { trContent = JSON.parse(fs.readFileSync(trPath, 'utf-8')); } catch {}
  try { enContent = JSON.parse(fs.readFileSync(enPath, 'utf-8')); } catch {}
  
  const titleTr = trContent.title || post.titles?.tr || post.id;
  const titleEn = enContent.title || post.titles?.en || post.id;
  const bodyTr = trContent.content || '';
  const bodyEn = enContent.content || '';
  
  // Basit FAQ: başlık + ilk 2 cümle
  const firstSentencesTr = bodyTr.split(/[.!?]/).filter(Boolean).slice(0, 2).join('. ').trim();
  const firstSentencesEn = bodyEn.split(/[.!?]/).filter(Boolean).slice(0, 2).join('. ').trim();
  
  existing[post.id] = {
    tr: [
      { q: titleTr + ' ne hakkında?', a: firstSentencesTr || titleTr },
      { q: titleTr + ' hangi isimleri içeriyor?', a: 'Bu yazıda ' + titleTr.toLowerCase() + ' ile ilgili isimler listelenmiştir.' },
      { q: 'Bu yazıyı neden okumalıyım?', a: firstSentencesTr || titleTr }
    ],
    en: [
      { q: 'What is ' + titleEn + ' about?', a: firstSentencesEn || titleEn },
      { q: 'Which names does ' + titleEn + ' include?', a: 'This article lists names related to ' + titleEn.toLowerCase() + '.' },
      { q: 'Why should I read this?', a: firstSentencesEn || titleEn }
    ]
  };
}

fs.writeFileSync(faqsPath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
console.log('Total FAQ keys:', Object.keys(existing).length);
