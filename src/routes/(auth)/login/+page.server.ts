// export const prerender = true;

import db, { ControlDB } from "$lib/db";
import { fail, redirect } from "@sveltejs/kit";
import type { Action, Actions } from "./$types";
import { DB_NAME, DB_TABLE_NAME, SALT } from "$lib/constants";
import bcrypt from 'bcrypt';

const login: Action = async function ({ request }) {
  const data = await request.formData();

  const username = data.get('username');
  const password = data.get('password') as string;
  const hasedPassword = await bcrypt.hash(password, SALT);

  const dbUserData = await ControlDB.select(db, `username = "${username}"`);
  console.log(hasedPassword);
  console.log(dbUserData[0].password);

  if (dbUserData.length == 0) {
    return fail(400, { cantFindUsername: true });
  }

  // const correctCheck = await bcrypt.compare(dbUserData[0].password, hasedPassword);
  const correctCheck = dbUserData[0].password == hasedPassword;
  console.log(correctCheck);

  if (!correctCheck) {
    return fail(400, { incorrectPassword: true });
  }

  throw redirect(303, "/app");
}

export const actions: Actions = { login };