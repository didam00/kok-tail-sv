import pool, { ControlDB } from "$lib/db.js";
import { json, type RequestHandler } from "@sveltejs/kit";
import type { ResultSetHeader } from "mysql2";

export const POST = async ({ request, locals }) => {
  const { data } = await request.json();
  const username = (locals as any).user.username;

  console.log(data);

  const insertResult = await ControlDB.insert(pool, 'CustomRecipes', {
    username: username,
    name: data.name,
    colors: (data.color as string[]).join(","),
    description: data.description,
    glass: data.glass,
  }) as ResultSetHeader;

  const insertId = insertResult.insertId;

  for (const material of data.materials) {
    await ControlDB.insert(pool, 'CustomRecipeIngrdnts', {
      recipeId: insertId,
      keyname: material.key,
      volume: material.ml
    })
  }

  return json({ success: true })
}