import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import optimizationRoutes from './routes/optimizationRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API routes
app.use('/api', optimizationRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/client')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist/client/index.html'));
  });
}

// Create HTTP server
const server = createServer(app);

server.listen(port, () => {
  console.log(`🎮 Gaming Optimizer Server running on port ${port}`);
});