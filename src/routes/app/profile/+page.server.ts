// export const prerender = true;

import pool, { ControlDB } from "$lib/db";
import type { RowDataPacket } from "mysql2";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async function ({ locals }) {
  let users: any = {user: ('user' in locals)}
  let username: string = '';
  let customRecipes: RowDataPacket[] = [];
  if ('user' in locals) {
    users.nickname = (locals.user as any).nickname;
    username = (locals.user as any).username;
    customRecipes = await ControlDB.select(pool, 'CustomRecipes', `username = '${username}'`);
  } else {
    customRecipes = [];
  }

  return {
    customRecipes: customRecipes,
    users: users
  }
}