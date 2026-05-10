const { cpSync, existsSync, mkdirSync, rmSync } = require('node:fs');
const path = require('node:path');

const sourceDir = path.join(process.cwd(), 'src', 'generated');
const targetDir = path.join(process.cwd(), 'dist', 'src', 'generated');

if (!existsSync(sourceDir)) {
  process.exit(0);
}

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(path.dirname(targetDir), { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true });
