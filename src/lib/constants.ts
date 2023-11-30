import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const generateAuthToken = () => crypto.randomBytes(30).toString('hex');

export const DB_NAME = "u2301415";
export const DB_TABLE_NAME = "u2301415.users";
export const SALT = 10;