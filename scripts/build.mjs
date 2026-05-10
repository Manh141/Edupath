import { execSync } from 'node:child_process';

const isVercel = Boolean(process.env.VERCEL);
const command = isVercel ? 'pnpm --filter web build' : 'pnpm -r build';

console.log(
  isVercel
    ? '[build] Detected Vercel environment, building apps/web only.'
    : '[build] Building all workspace projects.',
);

execSync(command, { stdio: 'inherit' });
