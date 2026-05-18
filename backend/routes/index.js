import { Router } from 'express';

import { v1Routes } from './v1/index.js';

export const apiRoutes = Router();

apiRoutes.use('/v1', v1Routes);
