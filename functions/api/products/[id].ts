
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
  const id = context.params.id;

  try {
    const product: any = await DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    
    if (!product) {
      return new Response("Product Not Found", { status: 404 });
    }

    const parsed = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      descriptionImages: product.description_images ? JSON.parse(product.description_images) : []
    };

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const id = context.params.id;

  try {
    await DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
    return new Response(null, { status: 204 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
