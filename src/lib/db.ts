import mysql from 'mysql2/promise';
import { DB_TABLE_NAME } from './constants';

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
  static async insert(db: mysql.Pool ,obj: {[key:string]: any}) {
    let keys: string[] = [];
    let values: any[] = [];

    for (const key in obj) {
      keys.push(key);
      values.push(obj[key]);
    }

    let placeholders = keys.map(() => "?").join(", ");
    // let adaptValues = values.map((v: string) => {
    //   if (v.includes("(") && v.includes(")")) {
    //     return v;
    //   } else {
    //     return `'${v}'`;
    //   }
    // });

    let query_string = `INSERT ${DB_TABLE_NAME} (${keys.join(', ')}) VALUES (${placeholders})`;

    // console.log("ControlDB: Run query ->", query_string);

    const [rows, fields] = await db.query(query_string, values);
    return rows;
  }

  static async select(db: mysql.Pool, where: string = "", columns: string[] = ["*"]): Promise<mysql.RowDataPacket[]> {
    const query = `SELECT ${columns.join(", ")} FROM ${DB_TABLE_NAME}` + (where !== "" ? " WHERE " : "") + where;
    console.log("ControlDB: Run query ->", query);

    const [rows, fields] = await db.query(query);
    return rows as mysql.RowDataPacket[];
  }
}