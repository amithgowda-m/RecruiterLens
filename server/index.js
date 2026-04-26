import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import githubRoutes from './routes/github.js';
import analyzeRoutes from './routes/analyze.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api/github', githubRoutes);
app.use('/api/analyze', analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
