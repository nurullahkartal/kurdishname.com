const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

const targetStr = `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "KurdishName",
        "url": "https://kurdishname.com/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://kurdishname.com/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
      </script>`;

const replacementStr = `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "name": "KurdishName",
            "url": "https://kurdishname.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://kurdishname.com/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@type": "Organization",
            "name": "KurdishName",
            "url": "https://kurdishname.com",
            "logo": "https://kurdishname.com/logo.png",
            "sameAs": [
              "https://twitter.com/kurdishname",
              "https://instagram.com/kurdishname",
              "https://facebook.com/kurdishname"
            ]
          },
          {
            "@type": "Dataset",
            "name": "KurdishName Database",
            "description": "10.000'den fazla Kürtçe kız ve erkek isminin en kapsamlı etimolojik arşivi.",
            "url": "https://kurdishname.com/",
            "keywords": "Kürtçe isimler, Kurdish names, kurdische namen, أسماء كردية",
            "license": "https://kurdishname.com/tr/kullanim-kosullari",
            "isAccessibleForFree": true,
            "size": "10.239 Kürtçe İsim"
          }
        ]
      }
      </script>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Update successful');
} else {
    console.log('Target string not found in index.html, trying regex...');
    const regex = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
    if (regex.test(content)) {
        content = content.replace(regex, replacementStr);
        fs.writeFileSync('index.html', content, 'utf8');
        console.log('Update successful using regex');
    } else {
        console.log('Could not find script block at all');
    }
}
