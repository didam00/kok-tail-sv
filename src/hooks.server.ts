import pool, { ControlDB } from "$lib/db";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('kok-tail-logins');
  // const session = localStorage.getItem('kok-tail-logins');

  if (!session) {
    return await resolve(event);
  }

  const users = await ControlDB.select(pool, 'users', `userAuthToken = '${session}'`);
  
  // 먼저 locals가 존재하는 지부터 확인해야함
  if (!event.locals) {
    event.locals = {};
  }

  if (event.locals && users.length > 0) {
    (event.locals as any).user = {
      username: users[0].username,
      nickname: users[0].nickname,
      userId: users[0].userId,
      ingredients: [],
    };
  }
  return await resolve(event);
}