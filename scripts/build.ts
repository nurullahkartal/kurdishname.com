import { BUILD_MODE } from '../src/core/config/buildMode.js';
import { spawn } from 'child_process';
import path from 'path';

async function main() {
  console.log('\n🔄 Build Router initialized in [' + BUILD_MODE.toUpperCase() + '] mode.');
  
  if (BUILD_MODE === 'graph') {
    console.log('👉 Routing to Knowledge Graph Engine (buildAll.ts)...\n');
    const child = spawn('npx', ['tsx', path.join(process.cwd(), 'scripts', 'buildAll.ts')], { stdio: 'inherit', shell: true });
    child.on('exit', (code) => {
      if (code !== 0) process.exit(code || 1);
      console.log('👉 Running Validation Layer (validateBuild.ts)...\n');
      const val = spawn('npx', ['tsx', path.join(process.cwd(), 'scripts', 'validateBuild.ts')], { stdio: 'inherit', shell: true });
      val.on('exit', (c) => process.exit(c || 0));
    });
  } else {
    console.log('👉 Routing to Legacy SSG Engine (generateSSG.ts)...\n');
    const child = spawn('npx', ['tsx', path.join(process.cwd(), 'scripts', 'generateSSG.ts')], { stdio: 'inherit', shell: true });
    child.on('exit', (code) => {
      process.exit(code || 0);
    });
  }
}

main().catch(console.error);
