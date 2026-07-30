/**
 * Cross-platform deploy script
 * Copies build output to backend static directory
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');
const staticDir = resolve(rootDir, '..', 'backend', 'public', 'static');

console.log('🚀 Deploying frontend build to backend...');

// Check if dist exists
if (!existsSync(distDir)) {
  console.error(
    "❌ Error: dist directory not found. Run 'npm run build' first.",
  );
  process.exit(1);
}

// Remove existing static directory contents (except .gitkeep)
if (existsSync(staticDir)) {
  console.log('🗑️  Removing existing static directory contents...');
  const entries = readdirSync(staticDir);
  for (const entry of entries) {
    if (entry === '.gitkeep') {
      continue;
    }
    rmSync(join(staticDir, entry), { recursive: true, force: true });
  }
} else {
  // Create static directory if it doesn't exist
  console.log('📁 Creating static directory...');
  mkdirSync(staticDir, { recursive: true });
}

// Copy dist to static
console.log('📦 Copying build files...');
cpSync(distDir, staticDir, { recursive: true });

console.log(`✅ Deploy complete! Files copied to: ${staticDir}`);
console.log('');
console.log('To start the production server:');
console.log('  cd ../backend');
console.log('  MODE=production uv run start');
