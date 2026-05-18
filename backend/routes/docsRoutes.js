import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Router } from 'express';

import { asyncHandler } from '../middleware/asyncHandler.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const openApiPath = join(currentDir, '..', 'docs', 'openapi.json');

export const docsRoutes = Router();

docsRoutes.get(
  '/',
  asyncHandler(async (req, res) => {
    const openApi = JSON.parse(await readFile(openApiPath, 'utf8'));
    res.json(openApi);
  }),
);
