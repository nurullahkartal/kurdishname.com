import { execSync } from 'child_process';

// Check if we are running in CI or Cloudflare Pages environment
if (process.env.CF_PAGES === '1' || process.env.CI === 'true') {
  console.log('Skipping auto-deploy: running inside CI/Cloudflare environment.');
  process.exit(0);
}

try {
  console.log('🚀 Auto-deploying changes to GitHub...');
  
  // Stage all modifications
  execSync('git add -A', { stdio: 'inherit' });
  
  // Check if there are any changes to commit
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  if (status.trim() !== '') {
    // Commit and push
    execSync('git commit -m "deploy: auto-generated build updates"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Successfully pushed to GitHub.');
  } else {
    console.log('No git changes to commit. GitHub repository is up to date.');
  }

  console.log('☁️ Deploying to Cloudflare Pages...');
  execSync('npx wrangler pages deploy dist --project-name=kurdishname --branch=kurdishname --commit-dirty=true', { stdio: 'inherit' });
  console.log('✅ Successfully deployed to Cloudflare Pages!');
} catch (error: any) {
  console.error('❌ Auto-deploy failed:', error.message || error);
  process.exit(1);
}
