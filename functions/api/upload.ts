
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
  try {
    const formData = await context.request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    const fileExtension = file.name.split('.').pop();
    const filename = `${crypto.randomUUID()}.${fileExtension}`;
    
    await context.env.BUCKET.put(filename, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    // Replace with your public R2 custom domain
    const url = `https://media.barakasonko.com/${filename}`;

    return new Response(JSON.stringify({ url, filename }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
