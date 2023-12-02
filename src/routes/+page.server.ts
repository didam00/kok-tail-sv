import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = function () {
  return {
    test: "hello world"
  }
}