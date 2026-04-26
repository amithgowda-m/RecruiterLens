import express from 'express';
import { getGroqAnalysis } from '../services/groqService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const analysis = await getGroqAnalysis(req.body);
    res.json(analysis);
  } catch (error) {
    console.error("Analyze route error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

export default router;
