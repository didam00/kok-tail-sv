import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  cookies.set('kok-tail-logins', 'none', {
    httpOnly: true, // 클라이언트 스크립트에서 이 쿠키를 읽을 수 없음
    sameSite: 'strict',
    // ! https 가 아닌 곳에서는 secure 속성을 사용할 수 없다!
    secure: false,
    path: '/', // 쿠키가 전송될 경로
    expires: new Date(0),
  });
}