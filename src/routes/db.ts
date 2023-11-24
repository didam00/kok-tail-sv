import mysql from 'mysql2/promise';

// 풀은 데이터베이스 연결을 재사용할 수 있게 해줌
const pool = mysql.createPool({
  host: '203.234.62.38',
  user: 'u2301415',
  password: "u2301415!",
  database: "DB",
  port: 3307,
})

export default pool;