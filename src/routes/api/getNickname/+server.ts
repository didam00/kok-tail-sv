import pool, { ControlDB } from "$lib/db.js";
import { json } from "@sveltejs/kit";
import type { ResultSetHeader } from "mysql2";

export const GET = async ({ request }) => {
  const { data } = await request.json();
  const rows = await ControlDB.select(pool, 'users', `username == ${data.username}`);

  if (rows.length <= 0) {
    console.error("Can't find username:", data.username);
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