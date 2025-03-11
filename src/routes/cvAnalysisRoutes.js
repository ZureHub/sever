import express from 'express';
import { analyzeCVWithLLM } from '../utils/analysis.js';
const router = express.Router();
router.get('/test', (req, res) => {
    res.json({ message: 'CV Analysis API is working!' });
});
router.post('/analyze-cv', async (req, res) => {
    try {
        const { cvText } = req.body;
        if (!cvText) {
            return res.status(400).json({ error: 'CV text is required' });
        }
        const insights = await analyzeCVWithLLM(cvText);
        res.status(200).json(insights);
    }
    catch (error) {
        console.error('Error in CV analysis:', error);
        res.status(500).json({
            error: 'Failed to analyze CV',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;
