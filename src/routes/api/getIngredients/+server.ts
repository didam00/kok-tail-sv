import pool, { ControlDB } from "$lib/db.js";
import { json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
  const recipeId = url.searchParams.get('recipeId') ?? "";
  const rows = await ControlDB.select(pool, 'CustomRecipeIngrdnts', `recipeId = ${recipeId}`);

  if (rows.length <= 0) {
    console.error("Can't find recipeId:", recipeId);
    return json({
      success: false,
    });
  }

  return json({ 
    ingredients: rows,
    success: true,
  });
}