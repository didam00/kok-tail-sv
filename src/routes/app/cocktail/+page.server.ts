// export const prerender = true;

import pool, { ControlDB } from "$lib/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async function ({ locals }) {
  const CustomRecipes = await ControlDB.select(pool, 'CustomRecipes');

  if (!('user' in locals)) {
    return {
      CustomRecipes: CustomRecipes,
      Ingredients: []
    }
  }
  
  const ingrdntData: any = await ControlDB.getAllUserIngrdnts(pool, (locals as any).user.username);
  let ingredients: any[] = ingrdntData;

  return {
    CustomRecipes: CustomRecipes,
    Ingredients: ingredients,
  }
}