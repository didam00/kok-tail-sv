import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  cookies.set('kok-tail-logins', 'none', {
    path: '/', // 쿠키가 전송될 경로
    expires: new Date(0),
  });
}