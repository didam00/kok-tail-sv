// export const prerender = true;

import db, { ControlDB } from "$lib/db";
import { fail, redirect } from "@sveltejs/kit";
import type { Action, Actions } from "./$types";
// import { DB_NAME, DB_TABLE_NAME, SALT } from "$lib/constants";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateAuthToken } from "$lib/constants";

const login: Action = async function ({ cookies, request }) {
  const data = await request.formData();

  const username = data.get('username');
  const password = data.get('password') as string;

  const dbUserData = await ControlDB.select(db, "users", `username = '${username}'`);

  if (dbUserData.length == 0) {
    return fail(400, { cantFindUsername: true });
  }

  // const correctCheck = await bcrypt.compare(dbUserData[0].password, hasedPassword);
  const correctCheck = await bcrypt.compare(password, dbUserData[0].password);

  if (!correctCheck) {
    return fail(400, { incorrectPassword: true });
  }

  const token = generateAuthToken();
  await ControlDB.update(db, "users", `\`username\` = '${username}'`, {
    userAuthToken: token,
  });

  cookies.set('kok-tail-logins', token, {
    httpOnly: true, // 클라이언트 스크립트에서 이 쿠키를 읽을 수 없음
    sameSite: 'strict',
    // ! https 가 아닌 곳에서는 secure 속성을 사용할 수 없다!
    secure: false,
    path: '/', // 쿠키가 전송될 경로
    maxAge: 60 * 60 * 24 * 7, // 쿠키의 유효기간을 1주일로 설정
  });
  // localStorage.setItem('kok-tail-logins', token);

  throw redirect(303, '../../app/profile');
}

export const actions: Actions = { login };