import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'mock-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/')) {
              const urlObj = new URL(req.url, 'http://localhost');
              const pathname = urlObj.pathname;

              // Helper for JSON response
              const sendJSON = (status: number, data: any) => {
                res.writeHead(status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
              };

              // Authorization helper
              const isAuthorized = () => {
                const auth = req.headers['authorization'];
                return auth === 'Bearer 2506CK-3';
              };

              const dbPath = path.resolve(__dirname, '.db_local.json');
              const readCodes = () => {
                try {
                  if (fs.existsSync(dbPath)) {
                    return JSON.parse(fs.readFileSync(dbPath, 'utf8')).codes || [];
                  }
                } catch (e) {
                  console.error(e);
                }
                // Pre-seed with TEST-123 if the local DB file doesn't exist yet
                const initialSeed = [
                  { code: 'TEST-123', created_at: new Date().toISOString() }
                ];
                try {
                  fs.writeFileSync(dbPath, JSON.stringify({ codes: initialSeed }, null, 2), 'utf8');
                } catch (e) {
                  console.error('Gagal menulis mock database:', e);
                }
                return initialSeed;
              };
              const writeCodes = (codes: any[]) => {
                try {
                  fs.writeFileSync(dbPath, JSON.stringify({ codes }, null, 2), 'utf8');
                } catch (e) {
                  console.error('Gagal menulis mock database:', e);
                }
              };

              if (pathname === '/api/verify' && req.method === 'POST') {
                try {
                  let body = '';
                  req.on('data', chunk => body += chunk);
                  req.on('end', () => {
                    try {
                      const { code } = JSON.parse(body);
                      if (!code) {
                        return sendJSON(400, { error: 'Code is required' });
                      }
                      const trimmed = code.trim().toUpperCase();
                      // Admin code is always valid
                      if (trimmed === '2506CK-3' || trimmed === '250CK-3') {
                        return sendJSON(200, { valid: true });
                      }
                      const codes = readCodes();
                      const isValid = codes.some((item: any) => item.code.trim().toUpperCase() === trimmed);
                      sendJSON(200, { valid: isValid });
                    } catch (e) {
                      sendJSON(400, { error: 'Invalid JSON body' });
                    }
                  });
                } catch (e) {
                  sendJSON(500, { error: 'Internal server error' });
                }
                return;
              }

              if (pathname === '/api/codes') {
                if (!isAuthorized()) {
                  return sendJSON(401, { error: 'Unauthorized' });
                }

                if (req.method === 'GET') {
                  return sendJSON(200, readCodes());
                }

                if (req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => body += chunk);
                  req.on('end', () => {
                    try {
                      const { code, label } = JSON.parse(body);
                      if (!code) {
                        return sendJSON(400, { error: 'Code is required' });
                      }
                      const trimmed = code.trim().toUpperCase();
                      const codes = readCodes();
                      if (codes.some((item: any) => item.code.toUpperCase() === trimmed)) {
                        return sendJSON(400, { error: 'Code already exists' });
                      }
                      codes.push({
                        code: trimmed,
                        label: label || 'Tanpa Nama',
                        created_at: new Date().toISOString()
                      });
                      writeCodes(codes);
                      sendJSON(200, { success: true });
                    } catch (e) {
                      sendJSON(400, { error: 'Invalid JSON body' });
                    }
                  });
                  return;
                }

                if (req.method === 'DELETE') {
                  const codeToDelete = urlObj.searchParams.get('code');
                  if (!codeToDelete) {
                    return sendJSON(400, { error: 'Code parameter is required' });
                  }
                  const trimmed = codeToDelete.trim().toUpperCase();
                  const codes = readCodes();
                  const filtered = codes.filter((item: any) => item.code.toUpperCase() !== trimmed);
                  if (codes.length === filtered.length) {
                    return sendJSON(404, { error: 'Code not found' });
                  }
                  writeCodes(filtered);
                  sendJSON(200, { success: true });
                  return;
                }
              }

              sendJSON(404, { error: 'Not Found' });
              return;
            }
            next();
          });
        }
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/.db_local.json']
      },
    },
  };
});
