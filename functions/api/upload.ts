
// Added interface and type definitions to satisfy Cloudflare Pages environment types
interface R2Bucket {
  put(key: string, value: any, options?: any): Promise<any>;
}

type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string>;
}) => Promise<Response> | Response;

interface Env {
  BUCKET: R2Bucket;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const filename = `${crypto.randomUUID()}-${file.name}`;
  
  await context.env.BUCKET.put(filename, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  // Assumes a public bucket URL is configured
  const url = `https://media.barakasonko.com/${filename}`;

  return new Response(JSON.stringify({ url }), {
    headers: { "Content-Type": "application/json" }
  });
};
