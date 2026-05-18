import { Router } from 'express';

import { docsRoutes } from './docsRoutes.js';
import { v1Routes } from './v1/index.js';

export const apiRoutes = Router();

apiRoutes.use('/docs', docsRoutes);
apiRoutes.use('/v1', v1Routes);
