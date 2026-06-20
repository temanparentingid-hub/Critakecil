interface Env {
  DB: any; // D1Database
  ASSETS: any; // Fetcher
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    const jsonResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
      });
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // 1. Verify Code Endpoint: POST /api/verify
    if (url.pathname === '/api/verify' && request.method === 'POST') {
      try {
        const { code } = await request.json() as { code?: string };
        const cleanCode = (code || '').trim().toUpperCase();

        if (!cleanCode) {
          return jsonResponse({ error: 'Kode akses tidak boleh kosong.' }, 400);
        }

        // Admin code is always valid
        if (cleanCode === '2506CK-3' || cleanCode === '250CK-3') {
          return jsonResponse({ valid: true });
        }

        // Query D1 to check if code exists
        if (env.DB && typeof env.DB.prepare === 'function') {
          const result = await env.DB.prepare(
            'SELECT 1 FROM access_codes WHERE UPPER(code) = ?'
          )
            .bind(cleanCode)
            .first();
          return jsonResponse({ valid: !!result });
        }

        return jsonResponse({ valid: false });
      } catch (err: any) {
        return jsonResponse({ error: err.message || 'Server error' }, 500);
      }
    }

    // 2. Access Codes management group
    if (url.pathname === '/api/codes') {
      // Verify Admin authorization header
      const authHeader = request.headers.get('Authorization');
      if (authHeader !== 'Bearer 2506CK-3') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      // GET /api/codes: List all codes
      if (request.method === 'GET') {
        try {
          if (env.DB && typeof env.DB.prepare === 'function') {
            const { results } = await env.DB.prepare(
              'SELECT code, label, created_at FROM access_codes ORDER BY created_at DESC'
            ).all();
            return jsonResponse(results || []);
          }
          return jsonResponse([]);
        } catch (err: any) {
          return jsonResponse({ error: err.message || 'Server error' }, 500);
        }
      }

      // POST /api/codes: Add new code
      if (request.method === 'POST') {
        try {
          const { code, label } = await request.json() as { code?: string, label?: string };
          const cleanCode = (code || '').trim().toUpperCase();
          const cleanLabel = (label || '').trim();
          const createdAt = new Date().toISOString();

          if (!cleanCode) {
            return jsonResponse({ error: 'Kode tidak boleh kosong.' }, 400);
          }

          if (env.DB && typeof env.DB.prepare === 'function') {
            // Check if exists
            const existing = await env.DB.prepare(
              'SELECT 1 FROM access_codes WHERE UPPER(code) = ?'
            )
              .bind(cleanCode)
              .first();

            if (existing) {
              return jsonResponse({ error: 'Kode akses sudah terdaftar.' }, 400);
            }

            await env.DB.prepare(
              'INSERT INTO access_codes (code, label, created_at) VALUES (?, ?, ?)'
            )
              .bind(cleanCode, cleanLabel, createdAt)
              .run();

            return jsonResponse({ success: true });
          }

          return jsonResponse({ error: 'Database binding not configured.' }, 500);
        } catch (err: any) {
          return jsonResponse({ error: err.message || 'Server error' }, 500);
        }
      }

      // DELETE /api/codes: Delete a code
      if (request.method === 'DELETE') {
        try {
          const codeToDelete = url.searchParams.get('code');
          if (!codeToDelete) {
            return jsonResponse({ error: 'Kode tidak boleh kosong.' }, 400);
          }

          const cleanCode = codeToDelete.trim().toUpperCase();

          if (cleanCode === '2506CK-3' || cleanCode === '250CK-3') {
            return jsonResponse({ error: 'Kode admin utama tidak dapat dihapus.' }, 400);
          }

          if (env.DB && typeof env.DB.prepare === 'function') {
            await env.DB.prepare(
              'DELETE FROM access_codes WHERE UPPER(code) = ?'
            )
              .bind(cleanCode)
              .run();

            return jsonResponse({ success: true });
          }

          return jsonResponse({ error: 'Database binding not configured.' }, 500);
        } catch (err: any) {
          return jsonResponse({ error: err.message || 'Server error' }, 500);
        }
      }

      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    // 3. Fallback: serve static frontend assets
    return env.ASSETS.fetch(request);
  },
};
