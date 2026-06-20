export const onRequestPost = async (context: any) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });

  try {
    const { code } = await context.request.json();
    if (!code) {
      return new Response(JSON.stringify({ error: 'Code is required' }), { status: 400, headers });
    }

    const trimmed = code.trim().toUpperCase();

    // Admin codes are always valid
    if (trimmed === '2506CK-3' || trimmed === '250CK-3') {
      return new Response(JSON.stringify({ valid: true }), { status: 200, headers });
    }

    // Try Cloudflare D1 database (SQL)
    if (context.env.DB && typeof context.env.DB.prepare === 'function') {
      const db = context.env.DB;
      const result = await db
        .prepare('SELECT 1 FROM access_codes WHERE UPPER(code) = ? LIMIT 1')
        .bind(trimmed)
        .first();
      return new Response(JSON.stringify({ valid: !!result }), { status: 200, headers });
    }

    // Try Cloudflare KV namespace (Key-Value)
    const kv = context.env.CODES_KV || context.env.KV;
    if (kv && typeof kv.get === 'function') {
      const value = await kv.get(trimmed);
      return new Response(JSON.stringify({ valid: value !== null }), { status: 200, headers });
    }

    // Fallback: If no database is bound, return false but add a diagnostic warning
    return new Response(
      JSON.stringify({
        valid: false,
        warning: 'No Cloudflare database binding (D1 or KV) was found. Please bind DB in your Pages settings.'
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers
    });
  }
};

// Handle OPTIONS preflight requests for CORS
export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
