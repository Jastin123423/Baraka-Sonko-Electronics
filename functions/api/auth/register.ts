
type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string>;
}) => Promise<Response> | Response;

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const body: any = await context.request.json();
    
    if (!body.email || !body.password || !body.name) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    // In real app, check if user exists and insert into DB
    const user = {
      id: "user-" + Date.now(),
      name: body.name,
      email: body.email,
      role: 'user'
    };

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
