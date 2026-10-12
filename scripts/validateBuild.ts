import fs from 'fs';
import path from 'path';

const DIST_PATH = path.join(process.cwd(), 'dist', 'names');
const SEO_SCORES_PATH = path.join(process.cwd(), 'public', 'data', 'seo_scores.json');

function validateBuild() {
  console.log('🔍 Running Build Validation & Health Check...');

  if (!fs.existsSync(DIST_PATH)) {
    console.error('❌ ERROR: Output directory does not exist.');
    process.exit(1);
  }

  if (!fs.existsSync(SEO_SCORES_PATH)) {
    console.error('❌ ERROR: SEO Scores not found. Graph engine might have failed.');
    process.exit(1);
  }

  const seoScores = JSON.parse(fs.readFileSync(SEO_SCORES_PATH, 'utf-8'));
  let failCount = 0;
  let successCount = 0;
  let emptyPageCount = 0;

  for (const [id, score] of Object.entries(seoScores)) {
    const pagePath = path.join(DIST_PATH, id + '.html');
    
    if (!fs.existsSync(pagePath)) {
      console.error('❌ ERROR: Page missing for ' + id);
      failCount++;
      continue;
    }

    const stat = fs.statSync(pagePath);
    if (stat.size < 500) {
      console.error('⚠️ WARNING: Empty or very thin page detected for ' + id + ' (' + stat.size + ' bytes)');
      emptyPageCount++;
    }

    if ((score as number) < 30) {
      console.warn('⚠️ WARNING: Low SEO Score for ' + id + ': ' + score + '/100');
    }

    successCount++;
  }

  console.log('📊 Validation Summary:');
  console.log('  - Pages Validated: ' + successCount);
  console.log('  - Missing Pages: ' + failCount);
  console.log('  - Suspiciously Thin Pages: ' + emptyPageCount);

  if (failCount > 0) {
    console.error('❌ BUILD FAILED: Validation did not pass.');
    process.exit(1);
  }

  console.log('✅ BUILD VALIDATION PASSED. Ready for Production.');
}

validateBuild();
