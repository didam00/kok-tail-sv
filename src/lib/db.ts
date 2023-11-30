import mysql from 'mysql2/promise';
import { DB_NAME } from './constants';

// 풀은 데이터베이스 연결을 재사용할 수 있게 해줌
const pool = await mysql.createPool({
  host: '203.234.62.38',
  user: 'u2301415',
  password: "u2301415!",
  database: "u2301415",
  port: 3307,
})

export default pool;

export class ControlDB {
  static async insert(db: mysql.Pool, table: string, obj: {[key:string]: any}) {
    let keys: string[] = [];
    let values: any[] = [];

    for (const key in obj) {
      keys.push(key);
      values.push(obj[key]);
    }

    let placeholders = keys.map(() => "?").join(", ");

    let query_string = `INSERT ${DB_NAME}.${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    console.log(query_string);

    const [rows, fields] = await db.query(query_string, values);
    return rows;
  }

  static async select(db: mysql.Pool, table: string, where: string = "", select: string[] = ["*"]): Promise<mysql.RowDataPacket[]> {
    const query = `SELECT ${select.join(", ")} FROM ${DB_NAME}.${table}` + (where !== "" ? " WHERE " : "") + where;
    
    const [rows, fields] = await db.query(query);
    return rows as mysql.RowDataPacket[];
  }
  
  static async update(db: mysql.Pool, table: string, where: string, set: {[key: string]: any}) {
    const query = `UPDATE ${DB_NAME}.${table} SET ? WHERE ${where}`;
    
    const [rows, fields] = await db.query(query, set);
    return rows;
  };

  static async delete(db: mysql.Pool, table: string, where: string) {
    const query = `DELETE FROM ${DB_NAME}.${table} WHERE ${where}`;

    const [rows, fields] = await db.query(query);
    return rows;
  }

  static async getAllUserIngrdnts(db: mysql.Pool, userId: number) {
    const query
      = ` SELECT userIngrdnts.id, userIngrdnts.keyname, userIngrdnts.volume
          FROM u2301415.userIngrdnts
          WHERE username = ?`;
    const [rows, fields] = await db.query(query, userId);
    return rows;
  }
}