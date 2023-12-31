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
      httpOnly: true, // 클라이언트 스크립트에서 이 쿠키를 읽을 수 없음
      sameSite: 'strict',
      // ! https 가 아닌 곳에서는 secure 속성을 사용할 수 없다!
      secure: false,
      path: '/', // 쿠키가 전송될 경로
      maxAge: 60 * 60 * 24 * 7, // 쿠키의 유효기간을 1주일로 설정
    });
    // localStorage.setItem('kok-tail-logins', token);
  } catch (error) {
    console.log(error);
    return error;
  }

  throw redirect(303, '../../app/profile');
}

export const actions: Actions = { register };