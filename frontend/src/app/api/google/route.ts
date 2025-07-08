import { createClient } from "@/utils/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No code in query params", { status: 400 });
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "http://localhost:3000/api/google",
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();
  console.log("token Data", tokenData);
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    console.error("User not found or error", error);
    return new Response("User not found", { status: 401 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from("google_oauth")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase
      .from("google_oauth")
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        scope: tokenData.scope,
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  } else {
    await supabase.from("google_oauth").insert({
      user_id: user.id,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      scope: tokenData.scope,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
    });
  }

  return Response.redirect("http://localhost:3000/dashboard", 302);
}
