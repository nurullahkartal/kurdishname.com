const fs = require('fs');

let content = fs.readFileSync('scripts/generateSSG.ts', 'utf8');

// 1. Unisex replacements
content = content.replace(/t\('gender_unisex', 'Unisex'\)/g, "t('gender_both', 'Kız / Erkek')");
content = content.replace(/'Unisex'/g, "'Kız / Erkek'");
content = content.replace(/\? 'badge-unisex' :/g, "? 'badge-both' :");

// 2. HeadMetadata signature
content = content.replace(
  `function replaceHeadMetadata(template: string, options: {
    title: string;
    description: string;
    canonical: string;
    lang: string;
    alternates: { lang: string; url: string }[];
    schemas: string[];
  }) {`,
  `function replaceHeadMetadata(template: string, options: {
    title: string;
    description: string;
    canonical: string;
    lang: string;
    alternates: { lang: string; url: string }[];
    schemas: string[];
    ogImage?: string;
  }) {`
);

// 3. Strip existing OG tags
content = content.replace(
  `  let html = template;`,
  `  let html = template;\n\n  // Strip existing static OG tags from the template to prevent duplicates\n  html = html.replace(/<meta property="og:[^>]+>/gi, '');`
);

// 4. Inject OG tags
content = content.replace(
  `    script: { toString: () => \`<script data-rh="true" type="application/ld+json">\${JSON.stringify(graphSchema)}</script>\` }
  };
  
  const headInject = \`
    \${helmet.title.toString()}
    \${helmet.meta.toString()}
    \${helmet.link.toString()}
    \${helmet.script.toString()}
  \`;`,
  `    script: { toString: () => \`<script data-rh="true" type="application/ld+json">\${JSON.stringify(graphSchema)}</script>\` }
  };
  
  const ogUrl = options.canonical;
  const ogTitle = options.title.replace(/"/g, '&quot;');
  const ogDesc = options.description.replace(/"/g, '&quot;');
  const ogImg = options.ogImage || 'https://kurdishname.com/og-image.jpg';

  const ogTags = \`
    <meta property="og:type" content="website" />
    <meta property="og:title" content="\${ogTitle}" />
    <meta property="og:description" content="\${ogDesc}" />
    <meta property="og:url" content="\${ogUrl}" />
    <meta property="og:image" content="\${ogImg}" />
    <meta property="og:site_name" content="KurdishName" />
  \`;

  const headInject = \`
    \${helmet.title.toString()}
    \${helmet.meta.toString()}
    \${helmet.link.toString()}
    \${helmet.script.toString()}
    \${ogTags}
  \`;`
);

// 5. Dynamic size parameter
content = content.replace(
  `      'isAccessibleForFree': true,
      'size': '10,239 names'
    });`,
  `      'isAccessibleForFree': true,
      'size': lang === 'tr' ? '10.239 Kürtçe İsim' :
              lang === 'de' ? '10.239 Kurdische Namen' :
              lang === 'ar' ? '10,239 اسم كردي' :
              '10,239 Kurdish Names'
    });`
);

// 6. CollectionPage Schema for categories
content = content.replace(
  /const finalHtml = replaceHeadMetadata\(templateHtml, \{\n\s*title: `\$\{title\} \| KurdishName`,\n\s*description: desc,\n\s*canonical: canonical,\n\s*lang: lang,\n\s*alternates: alternates,\n\s*schemas: \[\]\n\s*\}\)/g,
  `const collectionSchema = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': title,
          'description': desc,
          'url': canonical
        });

        const finalHtml = replaceHeadMetadata(templateHtml, {
          title: \`\${title} | KurdishName\`,
          description: desc,
          canonical: canonical,
          lang: lang,
          alternates: alternates,
          schemas: [collectionSchema]
        })`
);

fs.writeFileSync('scripts/generateSSG.ts', content, 'utf8');
console.log('Update completed');
