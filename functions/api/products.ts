
// Define D1Database locally as it's not globally available in this context
interface D1Database {
  prepare(query: string): any;
}

interface Env {
  DB: D1Database;
}

type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string>;
}) => Promise<Response> | Response;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  try {
    const { results } = await DB.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
    
    // Parse JSON fields
    const products = results.map((p: any) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
      descriptionImages: p.description_images ? JSON.parse(p.description_images) : []
    }));

    return new Response(JSON.stringify(products), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  try {
    const body: any = await context.request.json();
    const id = crypto.randomUUID();

    await DB.prepare(`
      INSERT INTO products (id, title, image, images, description_images, video_url, price, discount, category_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.title,
      body.image,
      JSON.stringify(body.images || []),
      JSON.stringify(body.descriptionImages || []),
      body.videoUrl || null,
      body.price,
      body.discount || 0,
      body.category
    ).run();

    return new Response(JSON.stringify({ id, success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
