import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ignoredDirectories = new Set(['node_modules', 'coverage']);
const roots = [
  'config',
  'controllers',
  'middleware',
  'routes',
  'scripts',
  'services',
  'src',
  'tests',
  'utils',
  'validations',
  'prisma',
];

const collectJavaScriptFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
      files.push(...(await collectJavaScriptFiles(path)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(path);
    }
  }

  return files;
};

const files = (
  await Promise.all(roots.map((root) => collectJavaScriptFiles(root)))
).flat();

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Checked ${files.length} backend JavaScript files.`);
