
import bcrypt from 'bcrypt';

/**
 * Fetches the user's details and their associated role name after a successful operation (e.g., registration).
 *
 * @param {import('mysql2/promise').Pool} createConnectionPool - The MySQL connection pool.
 * @param {object} result - The result object from a previous database operation, expected to contain `insertId`.
 * @returns {Promise<object | undefined>} A promise that resolves to the user object with their role name,
 *                                         or `undefined` if no user is found.
 */

export async function getUserRole(createConnectionPool, result) {

    // Fetch the newly created user along with their role name to include in the token.
    const [newUser] = await createConnectionPool.query(`
        SELECT u.user_id, u.username, u.email, r.role_name
        FROM user u
        JOIN role r ON u.role_id = r.role_id
        WHERE u.user_id = ?
    `, [result.insertId]);

    // The query returns an array; we expect at most one user.
    return newUser ? newUser[0] : undefined;

}


export async function createPasswordHash(password) {
    return bcrypt.hash(password, 10);
}
//new
export async function getAllUsersWithRole(createConnectionPool) {
  const [rows] = await createConnectionPool.query(`
    SELECT 
      u.user_id,
      u.username,
      u.email,
      u.is_active,
      u.last_login,
      u.created_at,
      u.telephone,
      u.company,
      r.role_name
    FROM user u
    JOIN role r ON u.role_id = r.role_id
  `);
  return rows;
}