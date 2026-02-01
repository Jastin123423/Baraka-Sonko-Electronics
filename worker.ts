
/**
 * Baraka Sonko Backend Worker (Reference)
 * This worker would handle D1 Database queries and R2 Media uploads.
 */

// Added interface definitions for Cloudflare Workers specific types to fix "Cannot find name" errors
interface D1Database {
  prepare(query: string): any;
}

interface R2Bucket {
  put(key: string, value: any, options?: any): Promise<any>;
}

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS,DELETE",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. GET /api/products
      if (path === "/api/products" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
        // Parse JSON strings back to arrays for the frontend
        const parsed = (results as any[]).map(p => ({
          ...p,
          images: p.images ? JSON.parse(p.images as string) : [],
          descriptionImages: p.description_images ? JSON.parse(p.description_images as string) : []
        }));
        return Response.json(parsed, { headers: corsHeaders });
      }

      // 2. POST /api/products (Admin Only)
      if (path === "/api/products" && method === "POST") {
        const body = await request.json();
        const id = crypto.randomUUID();
        await env.DB.prepare(`
          INSERT INTO products (id, title, image, images, price, category_id, discount)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, 
          body.title, 
          body.image, 
          JSON.stringify(body.images || []), 
          body.price, 
          body.category_id, 
          body.discount
        ).run();
        
        return Response.json({ success: true, id }, { headers: corsHeaders });
      }

      // 3. POST /api/upload (R2 Media Upload)
      if (path === "/api/upload" && method === "POST") {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const filename = `${Date.now()}-${file.name}`;
        
        await env.BUCKET.put(filename, file.stream(), {
          httpMetadata: { contentType: file.type }
        });

        return Response.json({ url: `https://media.barakasonko.com/${filename}` }, { headers: corsHeaders });
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (err: any) {
      return new Response(err.message, { status: 500, headers: corsHeaders });
    }
  },
};
