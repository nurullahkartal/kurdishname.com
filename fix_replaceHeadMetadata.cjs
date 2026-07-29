const fs = require('fs');

let content = fs.readFileSync('scripts/generateSSG.ts', 'utf8');

// Find the replaceHeadMetadata function
const startPattern = 'function replaceHeadMetadata(template: string, options: {';
const endPattern = '  html = html.replace(/<\\/head>/i, headInject + \'\\n</head>\');\n\n  return html;\n}';

const startIndex = content.indexOf(startPattern);
if (startIndex === -1) {
  console.log('Function not found!');
  process.exit(1);
}
// Find the end index
const endIndexStr = 'html = html.replace(/<\\/head>/i, headInject + \'\\n</head>\');\n\n  return html;\n}';
const endIndex = content.indexOf(endIndexStr, startIndex) + endIndexStr.length;

const newFunc = `function replaceHeadMetadata(template: string, options: {
  title: string;
  description: string;
  canonical: string;
  lang: string;
  alternates: { lang: string; url: string }[];
  schemas: string[];
}) {
  const isRtl = options.lang === 'ar';
  let html = template;

  // Strip existing static OG tags from the template to prevent duplicates
  html = html.replace(/<meta property="og:[^>]+>/gi, '');

  // Replace <html> tag
  html = html.replace(/<html[^>]*>/i, \`<html lang="\${options.lang}"\${isRtl ? ' dir="rtl"' : ''}>\`);

  // Parse existing JSON-LD from template
  let baseGraph: any[] = [];
  const existingScriptMatch = html.match(/<script[^>]*type="application\\/ld\\+json"[^>]*>([\\s\\S]*?)<\\/script>/i);
  if (existingScriptMatch) {
    try {
      const parsedBase = JSON.parse(existingScriptMatch[1].trim());
      if (parsedBase['@graph']) {
        baseGraph = parsedBase['@graph'];
      } else {
        baseGraph = [parsedBase];
      }
    } catch (e) {
      console.error('Error parsing base JSON-LD:', e.message);
    }
    // Remove existing script
    html = html.replace(existingScriptMatch[0], '');
  }

  // Parse provided schemas for @graph
  if (options.schemas && options.schemas.length > 0) {
    options.schemas.forEach(s => {
      try {
        const obj = JSON.parse(s);
        delete obj['@context'];
        baseGraph.push(obj);
      } catch(e) {}
    });
  }

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': baseGraph
  };

  // Helmet Context Adapter
  const helmet = {
    title: { toString: () => \`<title data-rh="true">\${options.title}</title>\` },
    meta: { toString: () => \`<meta data-rh="true" name="description" content="\${options.description}"/>\` },
    link: { toString: () => {
      const alternatesStr = options.alternates.map(alt => 
        \`<link data-rh="true" rel="alternate" hrefLang="\${alt.lang}" href="\${alt.url}"/>\`
      ).join('\\n    ');
      return \`<link data-rh="true" rel="canonical" href="\${options.canonical}"/>\\n    \${alternatesStr}\\n    <link data-rh="true" rel="alternate" hrefLang="x-default" href="https://kurdishname.com/"/>\`;
    }},
    script: { toString: () => \`<script data-rh="true" type="application/ld+json">\${JSON.stringify(graphSchema)}</script>\` }
  };
  
  const headInject = \`
    \${helmet.title.toString()}
    \${helmet.meta.toString()}
    \${helmet.link.toString()}
    \${helmet.script.toString()}
  \`;
  
  html = html.replace(/<\\/head>/i, headInject + '\\n</head>');

  return html;
}`;

content = content.substring(0, startIndex) + newFunc + content.substring(endIndex);

fs.writeFileSync('scripts/generateSSG.ts', content, 'utf8');
console.log('Fixed replaceHeadMetadata in generateSSG.ts!');
