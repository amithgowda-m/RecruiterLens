import express from 'express';
import { getGitHubData } from '../services/githubService.js';

const router = express.Router();

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const data = await getGitHubData(username);
    res.json(data);
  } catch (error) {
    if (error.message === "Profile not found") {
      res.status(404).json({ error: "Profile not found" });
    } else if (error.message.includes("rate limit")) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
});

export default router;
