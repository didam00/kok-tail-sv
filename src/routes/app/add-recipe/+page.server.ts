import type { Action, Actions } from "../$types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = function ({ locals }) {
  let users: {
    [key: string]: any
  } = {
    user: ('user' in locals)
  }
  
  if ('user' in locals) {
    users.nickname = (locals.user as any).nickname;
  }

  return {
    users: users
  }
}