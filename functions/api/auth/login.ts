
type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string>;
}) => Promise<Response> | Response;

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const body: any = await context.request.json();
    
    // In a real app, you'd check DB for user & hashed password
    // For this prompt, we simulate a successful login if fields are present
    if (!body.email || !body.password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    }

    const user = {
      id: "user-" + btoa(body.email).substring(0, 8),
      name: body.email.split('@')[0],
      email: body.email,
      role: body.email.includes('admin') ? 'admin' : 'user'
    };

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
