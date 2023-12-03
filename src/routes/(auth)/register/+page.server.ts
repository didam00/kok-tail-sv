// export const prerender = true;

import db, { ControlDB } from "$lib/db";
import { fail, redirect } from "@sveltejs/kit";
import type { Action, Actions } from "./$types";
import { DB_NAME, DB_TABLE_NAME, SALT, generateAuthToken } from "$lib/constants";
import bcrypt from 'bcrypt';

const isString = function (checks: Array<any>) {
  for (let check in checks)
    if (typeof check !== 'string') return false;
  return true;
};

const register: Action = async function ({ request, cookies }) {
  const data = await request.formData();

  const username = data.get('username');
  const password = data.get('password') as string;
  const hasedPassword = await bcrypt.hash(password, SALT);
  const nickname = data.get('nickname');
  const email = data.get('email');
  const registeredOn = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (!isString([username, password, nickname, email])) {
    return fail(400, { invalid: true });
  }

  const dup_email_check = await ControlDB.select(db, "users", `email = "${email}"`);
  const dup_username_check = await ControlDB.select(db, "users", `username = "${username}"`);

  if (dup_email_check.length > 0) {
    console.log("dup_email");
    return fail(400, { dup_email: true });
  }
  
  if (dup_username_check.length > 0) {
    console.log("dup_username");
    return fail(400, { dup_username: true });
  }

  const token = generateAuthToken();

  try {
    await ControlDB.insert(db, "users", {
      username: username,
      password: hasedPassword,
      nickname: nickname,
      email: email,
      registeredOn: registeredOn,
      userAuthToken: token,
    })

    cookies.set('kok-tail-logins', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error) {
    console.log(error);
    return error;
  }

  throw redirect(303, '../../app/profile');
}

export const actions: Actions = { register };