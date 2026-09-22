import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json().catch(() => null);
	const parsed = schema.safeParse(body);
	if (!parsed.success) return Response.json({ status: "invalid_email" }, { status: 400 });

	const url = import.meta.env.SUPABASE_URL;
	const key = import.meta.env.SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.SUPABASE_ANON_KEY;
	if (!url || !key) return Response.json({ status: "error" }, { status: 500 });

	const { error } = await createClient(url, key, {
		auth: { autoRefreshToken: false, persistSession: false },
	}).from("waitlist").insert({ email: parsed.data.email });

	if (error?.code === "23505") return Response.json({ status: "already_joined" });
	if (error) return Response.json({ status: "error" }, { status: 500 });
	return Response.json({ status: "success" });
};
