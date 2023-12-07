import pool, { ControlDB } from "$lib/db.js";
import { json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
  const username = url.searchParams.get('username') ?? "";
  const rows = await ControlDB.select(pool, 'users', `username = "${username}"`);

  if (rows.length <= 0) {
    console.error("Can't find username:", username);
    return json({ 
      success: false,
    });
  } else {
    const nickname = rows[0].nickname;

    return json({ 
      nickname: nickname,
      success: true,
    });
  }
}