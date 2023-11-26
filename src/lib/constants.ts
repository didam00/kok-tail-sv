import bcrypt from 'bcrypt';

export const DB_NAME = "u2301415";
export const DB_TABLE_NAME = "u2301415.users";
export const SALT = await bcrypt.genSalt(10);