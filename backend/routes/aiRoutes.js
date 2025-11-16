import express from 'express';
import { diagnoseSymptomsController } from '../controllers/aiController.js';

const aiRouter = express.Router();

// POST /api/ai/diagnose
aiRouter.post('/diagnose', diagnoseSymptomsController);

export default aiRouter;

