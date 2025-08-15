import { Router } from 'express';
import {handleGetData} from '../controllers/main/data.controller';

const router = Router();

// A GET request to the root of this router will fetch the structured data
router.get('/data', handleGetData);

export default router;