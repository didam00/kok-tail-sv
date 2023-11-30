// export const prerender = true;

import { json, type RequestHandler } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import pool, { ControlDB } from "$lib/db";

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