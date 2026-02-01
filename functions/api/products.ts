
// Added interface and type definitions to satisfy Cloudflare Pages environment types
interface D1Database {
  prepare(query: string): any;
}

type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string>;
}) => Promise<Response> | Response;

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const { results } = await DB.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  
  const products = results.map(p => ({
    ...p,
    images: p.images ? JSON.parse(p.images as string) : [],
    descriptionImages: p.description_images ? JSON.parse(p.description_images as string) : []
  }));

  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json" }
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const body: any = await context.request.json();
  const id = crypto.randomUUID();

  await DB.prepare(`
    INSERT INTO products (id, title, image, images, price, discount, category_name)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    body.title,
    body.image,
    JSON.stringify(body.images || []),
    body.price,
    body.discount || 0,
    body.category
  ).run();

  return new Response(JSON.stringify({ id, success: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
};
