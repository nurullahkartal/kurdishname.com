export type NameNode = {
  id: string;
  name: string;
  meaning: string;
  semanticTags: string[];
};

export type RenderInput = {
  name: NameNode;
  seoScore: number;
  links: string[];
};

function renderLinks(links: string[]) {
  if (!links || links.length === 0) return '';
  return '<ul class=\"internal-links\">' + links.map(l => '<li><a href=\"/names/' + l + '.html\">' + l + '</a></li>').join('') + '</ul>';
}

function renderSEOScore(score: number) {
  return '<div class=\"seo-score\">SEO Score: <strong>' + score + '/100</strong></div>';
}

export function renderNamePage(input: RenderInput): string {
  const { name, seoScore, links } = input;
  const safeTags = name.semanticTags || [];

  return '<!doctype html>' +
'<html lang=\"en\">' +
'<head>' +
'  <title>' + name.name + ' - Kurdish Name Meaning</title>' +
'  <meta name=\"description\" content=\"' + name.meaning + '\" />' +
'  <link rel=\"canonical\" href=\"/names/' + name.id + '\" />' +
'  <script type=\"application/ld+json\">' +
'  {' +
'    \"@context\": \"https://schema.org\",' +
'    \"@type\": \"DefinedTerm\",' +
'    \"name\": \"' + name.name + '\",' +
'    \"description\": \"' + name.meaning + '\"' +
'  }' +
'  </script>' +
'</head>' +
'<body>' +
'  <header>' +
'    <h1>' + name.name + '</h1>' +
     renderSEOScore(seoScore) +
'  </header>' +
'  <main>' +
'    <section>' +
'      <h2>Meaning</h2>' +
'      <p>' + name.meaning + '</p>' +
'    </section>' +
'    <section>' +
'      <h2>Semantic Tags</h2>' +
'      <ul>' +
        safeTags.map(t => '<li>' + t + '</li>').join('') +
'      </ul>' +
'    </section>' +
'    <section>' +
'      <h2>Related Names</h2>' +
       renderLinks(links) +
'    </section>' +
'  </main>' +
'</body>' +
'</html>';
}
