// export const prerender = true;

import pool, { ControlDB } from "$lib/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async function () {
  const CustomRecipes = await ControlDB.select(pool, 'CustomRecipes');

  return {
    CustomRecipes: CustomRecipes
  }
}