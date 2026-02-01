
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
  const id = context.params.id;

  const product = await DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
  
  if (!product) {
    return new Response("Not Found", { status: 404 });
  }

  const parsed = {
    ...product,
    images: product.images ? JSON.parse(product.images as string) : [],
    descriptionImages: product.description_images ? JSON.parse(product.description_images as string) : []
  };

  return new Response(JSON.stringify(parsed), {
    headers: { "Content-Type": "application/json" }
  });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const id = context.params.id;

  await DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();

  return new Response(null, { status: 204 });
};
