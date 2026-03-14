/**
 * @file repository.js
 * @description This file provides a set of generic asynchronous functions for basic CRUD (Create, Read, Update, Delete)
 *              database operations. It acts as a simple Data Access Object (DAO) layer, abstracting common SQL queries
 *              to interact with various tables in a MySQL database using a provided connection pool.
 *              These functions are designed to be reusable across different entities/tables in the application.
 */

/**
 * Retrieves all records from a specified database table.
 *
 * @param {import('mysql2/promise').Pool} pool - The MySQL connection pool to execute the query.
 * @param fields
 * @param tables
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of row objects from the table.
 * @throws {Error} If a database error occurs during the selection process.
 */


export let selectAllWithJoin = async function (pool, fields = "*", tables = [], joins = []) {
    try {
        if (tables.length === 0) throw new Error("Se requiere al menos una tabla");

        let query = `SELECT ${fields} FROM ${tables[0]}`;

        for (let i = 0; i < joins.length; i++) {
            const joinClause = joins[i].trim();
            if (joinClause.toUpperCase().includes('JOIN')) {
                query += ` ${joinClause}`;
            } else {
                const nextTable = tables[i + 1];
                if (nextTable) {
                    query += ` JOIN ${nextTable} ON ${joinClause}`;
                }
            }
        }

        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw new Error(`Error en selectAllWithJoin: ${error.message}`);
    }
}

export let selectAll = async function (pool, table) {
    try {

        // Executes a SELECT * query to fetch all rows from the given table.
        const [rows] = await pool.query(`SELECT * FROM ${table};`);
        return rows;
    } catch (error) {

        throw new Error(`Error en selectAll (${table}): ${error.message}`);
    }
}

/**
 * Retrieves records from a specified database table filtered by a given attribute.
 *
 * @param {import('mysql2/promise').Pool} pool - The MySQL connection pool to execute the query.
 * @param {string} table - The name of the table from which to select records.
 * @param {string} attribute - The name of the column to filter by (e.g., 'email', 'user_id').
 * @param {any} filter - The value to match against the specified attribute.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of row objects matching the filter.
 * @throws {Error} If a database error occurs during the selection process.
 */

export let selectBy = async function (pool, table, attribute, filter = null) {
    try {

        // Executes a SELECT * query to fetch rows from the table where a specific attribute matches the filter.
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${attribute} = ?`, [filter]);
        return rows;
    } catch (error) {

        // Catches any database errors and re-throws them with a descriptive message.
        throw new Error(`Error en selectBy (${table}): ${error.message}`);
    }
}

/**
 * Inserts a new record into a specified database table.
 *
 * @param {import('mysql2/promise').Pool} pool - The MySQL connection pool to execute the query.
 * @param {string} table - The name of the table into which to insert the record.
 * @param {Object} data - An object where keys are column names and values are the data to insert.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the insert operation,
 *          typically containing `insertId` (if applicable) and `affectedRows`.
 * @throws {Error} If a database error occurs during the insertion process.
 */

export let insertIntoTable = async function (pool, table, data) {
    try {

        // Executes an INSERT query, using a placeholder for the data object which `mysql2` converts into `SET key = value`.
        const [result] = await pool.query(`INSERT INTO ${table} SET ?`, [data]);
        return result;
    } catch (error) {

        // Catches any database errors and re-throws them with a descriptive message.
        throw new Error(`Error en insertIntoTable (${table}): ${error.message}`);
    }
}

/**
 * Updates records in a specified database table.
 *
 * @param {import('mysql2/promise').Pool} pool - The MySQL connection pool to execute the query.
 * @param {string} table - The name of the table to update.
 * @param {Object} data - An object where keys are column names and values are the new data to set.
 * @param {string} attribute - The name of the column used for the WHERE clause (e.g., 'id').
 * @param {any} filter - The value to match against the `attribute` to identify which records to update.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the update operation,
 *          typically containing `affectedRows`.
 * @throws {Error} If a database error occurs during the update process.
 */

export let updateTable = async function (pool, table, data, attribute, filter) {
    try {

        // Executes an UPDATE query, setting new data for records matching the filter.
        const [result] = await pool.query(`UPDATE ${table} SET ? WHERE ${attribute} = ?`, [data, filter]);
        return result;
    } catch (error) {

        // Catches any database errors and re-throws them with a descriptive message.
        throw new Error(`Error en updateTable (${table}): ${error.message}`);
    }
}

/**
 * Deletes records from a specified database table.
 *
 * @param {import('mysql2/promise').Pool} pool - The MySQL connection pool to execute the query.
 * @param {string} table - The name of the table from which to delete records.
 * @param {string} attribute - The name of the column used for the WHERE clause (e.g., 'id').
 * @param {any} filter - The value to match against the `attribute` to identify which records to delete.
 * @returns {Promise<import('mysql2/promise').ResultSetHeader>} A promise that resolves to the result of the delete operation,
 *          typically containing `affectedRows`.
 * @throws {Error} If a database error occurs during the deletion process.
 */

export let deleteFromTable = async function (pool, table, attribute, filter) {
    try {
        // Executes a DELETE query for records matching the filter.
        const [result] = await pool.query(`DELETE FROM ${table} WHERE ${attribute} = ?`, [filter]);
        return result;
    } catch (error) {
        throw new Error(`Error en deleteFromTable (${table}): ${error.message}`);
    }
}
