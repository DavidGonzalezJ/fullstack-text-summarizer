import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { createSummarizer } from '../summarizers/SummarizerFactory';

const router = Router();
const summarizer = createSummarizer();

router.post('/', authenticate, async (req, res) => {
  try {
    const { text } = req.body as { text?: string };

    if (!text?.trim()) {
      res.status(400).json({ error: 'text is required' });
      return;
    }

    const summary = await summarizer.summarize(text);
    res.json({ summary });
  } catch (err) {
    console.error('[summarize]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
