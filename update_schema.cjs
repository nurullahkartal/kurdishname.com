const fs = require('fs');

let content = fs.readFileSync('scripts/generateSSG.ts', 'utf8').replace(/\r\n/g, '\n');

// Blog Author and Image Replacement
content = content.replace(
  /'headline': pTitle,[\s\n]*'description': pDesc,[\s\n]*'datePublished': post.date,[\s\n]*'author': \{[\s\n]*'@type': 'Organization',[\s\n]*'name': 'KurdishName'[\s\n]*\},/g,
  `'headline': pTitle,
          'description': pDesc,
          'image': 'https://kurdishname.com/og-image.jpg',
          'datePublished': post.date,
          'author': {
            '@type': 'Organization',
            'name': post.author || 'KurdishName Editorial'
          },`
);

// Blog Schema Breadcrumb and FAQPage
content = content.replace(
  /const blogSchema = JSON\.stringify\(\{([\s\S]*?)\}\);\s*const finalHtml = replaceHeadMetadata\(templateHtml, \{\s*title: `\$\{pTitle\} \| KurdishName`,\s*description: pDesc,\s*canonical: canonical,\s*lang: lang,\s*alternates: alternates,\s*schemas: \[blogSchema\]\s*\}\)/g,
  `const blogSchema = JSON.stringify({$1});

        const breadcrumbSchema = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'KurdishName', 'item': \`\${DOMAIN}/\${lang}\` },
            { '@type': 'ListItem', 'position': 2, 'name': t('blog_title', 'Blog'), 'item': \`\${DOMAIN}/\${lang}/\${blogSegment}\` },
            { '@type': 'ListItem', 'position': 3, 'name': pTitle, 'item': canonical }
          ]
        });

        let currentSchemas = [blogSchema, breadcrumbSchema];
        try {
          if (fs.existsSync(contentFilePath)) {
            const payload = JSON.parse(fs.readFileSync(contentFilePath, 'utf-8'));
            if (payload.faqs && Array.isArray(payload.faqs) && payload.faqs.length > 0) {
               const faqSchema = JSON.stringify({
                 '@context': 'https://schema.org',
                 '@type': 'FAQPage',
                 'mainEntity': payload.faqs.map((f: any) => ({
                   '@type': 'Question',
                   'name': f.question,
                   'acceptedAnswer': {
                     '@type': 'Answer',
                     'text': f.answer
                   }
                 }))
               });
               currentSchemas.push(faqSchema);
            }
          }
        } catch (e) {}

        const finalHtml = replaceHeadMetadata(templateHtml, {
          title: \`\${pTitle} | KurdishName\`,
          description: pDesc,
          canonical: canonical,
          lang: lang,
          alternates: alternates,
          schemas: currentSchemas
        })`
);

// Name Detail Schema Breadcrumb and FAQPage
content = content.replace(
  /const definedTermSchema = JSON\.stringify\(\{([\s\S]*?)\}\);\s*const finalHtml = replaceHeadMetadata\(templateHtml, \{\s*title: `\$\{t\('seo_name_title', \{ name: nameItem\.name \}\)\?\.replaceAll\('\{\{name\}\}', nameItem\.name\)\} \| KurdishName`,\s*description: description,\s*canonical: canonical,\s*lang: lang,\s*alternates: alternates,\s*schemas: \[definedTermSchema\]\s*\}\)/g,
  `const definedTermSchema = JSON.stringify({$1});

        const breadcrumbSchema = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'KurdishName', 'item': \`\${DOMAIN}/\${lang}\` },
            { '@type': 'ListItem', 'position': 2, 'name': isFemale ? t('nav_girls') : t('nav_boys'), 'item': \`\${DOMAIN}/\${lang}/\${categorySegment}/\${targetGenderSegment}\` },
            { '@type': 'ListItem', 'position': 3, 'name': nameItem.name, 'item': canonical }
          ]
        });

        const faqSchema = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faqs.map(f => ({
            '@type': 'Question',
            'name': f.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.answer
            }
          }))
        });

        const finalHtml = replaceHeadMetadata(templateHtml, {
          title: \`\${t('seo_name_title', { name: nameItem.name })?.replaceAll('{{name}}', nameItem.name)} | KurdishName\`,
          description: description,
          canonical: canonical,
          lang: lang,
          alternates: alternates,
          schemas: [definedTermSchema, breadcrumbSchema, faqSchema]
        })`
);

fs.writeFileSync('scripts/generateSSG.ts', content, 'utf8');
console.log('Update completed');
