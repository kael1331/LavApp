import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { UsersModule } from './server/users/users.module.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing (NestJS equivalent)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount Modules (NestJS equivalent module registration)
  const usersModule = new UsersModule();
  app.use('/api/users', usersModule.getRouter());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve Frontend / Vite files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Dev-Server] Vite middleware mounted');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Prod-Server] Serving static assets from', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Corriendo en http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error] Falló al iniciar el servidor:', err);
});
