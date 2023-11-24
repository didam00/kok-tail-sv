// import { ServerRequest } from '@sveltejs/kit/types/hooks'
// import pool from '$lib/db';

// export async function post(req, res) {
//   const { email, password } = req.body;

//   const [rows] = await pool.execute(
//     'SELECT * FROM `users` WHERE `email` = ? AND `password` = ?',
//     [email, password]
//   );

//   if (rows.length > 0) {
//     req.session.user = {email};
//     res.end(JSON.stringify( {success: true} ));
//   } else {
//     res.end(JSON.stringify( {success: false} ));
//   }
// }