// export const prerender = true;

import { json, type RequestHandler } from "@sveltejs/kit";
import pool, { ControlDB } from "$lib/db";
import type { PageServerLoad } from "../$types";

interface Ingredient {
  keyname: string;
  volume: number;
  id: number,
}

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (!('user' in locals)) {
    return {
      ingredients: []
    }
  }

  const ingrdntData: any = await ControlDB.getAllUserIngrdnts(pool, (locals as any).user.username);
  let ingredients: any[] = ingrdntData;

  return {
    ingredients,
  }
}