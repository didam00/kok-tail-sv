import pool, { ControlDB } from "$lib/db.js";
import { json, type RequestHandler } from "@sveltejs/kit";
import type { ResultSetHeader } from "mysql2";

export const POST = async ({ request, locals }) => {
  const { data } = await request.json();

  if (!('user' in (locals as any))) {
    return json({ success: true });
  }

  const username = (locals as any).user.username;

  for (const ingrdnt of data) {
    try {
      const ingrdntRows = await ControlDB.insert(pool, 'userIngrdnts', {
        keyname: ingrdnt.keyname,
        username: username,
        volume: 100,
      }) as ResultSetHeader;
      console.log(ingrdntRows);
    } catch (error) {
      console.log(error);
      return json({ success: false });
    }
  }

  return json({ success: true });
}

export const PATCH = async ({ request, locals }) => {
  const { data } = await request.json();
  const username = (locals as any).user.username;
  const keyname = data.keyname;
  
  try {
    const rows = await ControlDB.update(pool, "userIngrdnts", `username="${username}" and keyname="${keyname}"`, {
      volume: data.volume,
    })
  } catch (error) {
    console.log(error);
  }

  return json({ success: true }); 
}

export const DELETE = async ({ request, locals }) => {
  const { data } = await request.json();
  const username = (locals as any).user.username;
  const keyname = data.keyname;

  try {
    const rows = await ControlDB.delete(pool, "userIngrdnts", `username = '${username}' and keyname = '${keyname}'`);
  } catch (error) {
    console.log(error);
  }

  return json({ success: true });
}