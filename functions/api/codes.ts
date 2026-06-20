export const onRequest = async (context: any) => {
  const { request, env } = context;
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Verify Admin authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== 'Bearer 2506CK-3') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
  }

  const db = env.DB; // Cloudflare D1
  const kv = env.CODES_KV || env.KV; // Cloudflare KV

  try {
    const url = new URL(request.url);

    // ==========================================
    // GET: List all codes
    // ==========================================
    if (request.method === 'GET') {
      if (db && typeof db.prepare === 'function') {
        const { results } = await db.prepare('SELECT code, label, created_at FROM access_codes ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(results || []), { status: 200, headers });
      }

      if (kv && typeof kv.get === 'function') {
        const listStr = await kv.get('access_codes_index') || '[]';
        return new Response(listStr, { status: 200, headers });
      }

      return new Response(JSON.stringify([]), { status: 200, headers });
    }

    // ==========================================
    // POST: Create a code
    // ==========================================
    if (request.method === 'POST') {
      const { code, label } = await request.json();
      if (!code) {
        return new Response(JSON.stringify({ error: 'Code is required' }), { status: 400, headers });
      }

      const trimmed = code.trim().toUpperCase();
      const userLabel = (label || 'Tanpa Nama').trim();
      const createdAt = new Date().toISOString();

      if (db && typeof db.prepare === 'function') {
        // Check if exists
        const existing = await db.prepare('SELECT 1 FROM access_codes WHERE UPPER(code) = ?').bind(trimmed).first();
        if (existing) {
          return new Response(JSON.stringify({ error: 'Kode akses sudah terdaftar' }), { status: 400, headers });
        }
        await db.prepare('INSERT INTO access_codes (code, label, created_at) VALUES (?, ?, ?)')
          .bind(trimmed, userLabel, createdAt)
          .run();
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }

      if (kv && typeof kv.get === 'function') {
        const listStr = await kv.get('access_codes_index') || '[]';
        const list = JSON.parse(listStr);
        if (list.some((item: any) => item.code.toUpperCase() === trimmed)) {
          return new Response(JSON.stringify({ error: 'Kode akses sudah terdaftar' }), { status: 400, headers });
        }
        list.push({ code: trimmed, label: userLabel, created_at: createdAt });
        await kv.put('access_codes_index', JSON.stringify(list));
        await kv.put(trimmed, 'true');
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }

      return new Response(JSON.stringify({ error: 'No database or KV namespace bound to Cloudflare environment' }), { status: 500, headers });
    }

    // ==========================================
    // DELETE: Remove a code
    // ==========================================
    if (request.method === 'DELETE') {
      const codeToDelete = url.searchParams.get('code');
      if (!codeToDelete) {
        return new Response(JSON.stringify({ error: 'Code parameter is required' }), { status: 400, headers });
      }

      const trimmed = codeToDelete.trim().toUpperCase();

      if (db && typeof db.prepare === 'function') {
        await db.prepare('DELETE FROM access_codes WHERE UPPER(code) = ?').bind(trimmed).run();
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }

      if (kv && typeof kv.get === 'function') {
        const listStr = await kv.get('access_codes_index') || '[]';
        const list = JSON.parse(listStr);
        const filtered = list.filter((item: any) => item.code.toUpperCase() !== trimmed);
        await kv.put('access_codes_index', JSON.stringify(filtered));
        await kv.delete(trimmed);
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }

      return new Response(JSON.stringify({ error: 'No database or KV namespace bound to Cloudflare environment' }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), { status: 500, headers });
  }
};
