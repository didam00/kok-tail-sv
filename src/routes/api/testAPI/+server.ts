import { json } from "@sveltejs/kit";

export const GET = async ({ request }) => {
  return json({ 
    nickname: "hello world",
    success: true,
  });
}