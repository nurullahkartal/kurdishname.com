const fs = require('fs');
let content = fs.readFileSync('scripts/generateSSG.ts', 'utf8');

// 1. Fix categorySegment
content = content.replaceAll('categorySegment', 'routes.category');

// 2. Fix replaceHeadMetadata to parse and combine schemas
const oldFunc = `// Injects correct head tags, hreflang alternates, dir flags, and JSON-LD schemas into Vite dist/index.html
function replaceHeadMetadata(template: string, options: {
  title: string;
  description: string;
  canonical: string;
  lang: string;
  alternates: { lang: string; url: string }[];
  schemas: string[];
}) {
  const isRtl = options.lang === 'ar';
  let html = template;

  // Replace <html> tag
  html = html.replace(/<html[^>]*>/i, \`<html lang="\${options.lang}"\${isRtl ? ' dir="rtl"' : ''}>\`);

  // Parse provided schemas for @graph
  let parsedSchemas: any[] = [];
  if (options.schemas && options.schemas.length > 0) {
    parsedSchemas = options.schemas.map(s => {
      const obj = JSON.parse(s);
      delete obj['@context'];
      return obj;
    });
  }

  // Inject Global Schemas (WebSite and Organization)
  parsedSchemas.push(
    {
      "@type": "WebSite",
      "name": "KurdishName",
      "url": "https://kurdishname.com",
      "description": "Dünyanın en kapsamlı 4 dilli Kürtçe isim rehberi.",
      "inLanguage": ["tr", "en", "de", "ar"]
    },
    {
      "@type": "Organization",
      "name": "KurdishName Database",
      "url": "https://kurdishname.com",
      "logo": "https://kurdishname.com/logo.png"
    }
  );

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': parsedSchemas
  };

  // Helmet Context Adapter: Mocks the exact API expected from react-helmet-async's context
  // This bypasses the React 19 Dual-Package Hazard while ensuring 100% hydration compatibility.
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
  
  html = html.replace(/<!-- HEAD_TAGS -->/i, headInject);

  return html;
}`;

const newFunc = `// Injects correct head tags, hreflang alternates, dir flags, and JSON-LD schemas into Vite dist/index.html
function replaceHeadMetadata(template: string, options: {
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

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('scripts/generateSSG.ts', content, 'utf8');
console.log('Successfully patched generateSSG.ts!');
