/**
 * @file db-mysql.js
 * @description This file is responsible for establishing and exporting the MySQL connection pool,
 *              as well as initializing the database schema by creating tables and seeding initial data.
 *              It leverages environment variables for database configuration and uses `mysql2/promise`
 *              for asynchronous database operations.
 */


import {
    coderTable, technologyTable, projectTable, projectTechnologyTable,
    projectCoderTable, userTable, refreshTokenTable, user_project_save, roleTable, mediaProject,
} from "./create-tables.js";
import { createConnection, createPool } from 'mysql2/promise';
import { config } from 'dotenv';
config();


/**
 * @constant {Promise<import('mysql2/promise').Pool>} createConnectionPool
 * @description Exports a promise that resolves to a MySQL connection pool.
 *              This pool is used throughout the application to manage database connections efficiently.
 *              It is initialized immediately upon file load using environment variables.
 */

export let createConnectionPool = await createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,

});

/**
 * Asynchronously creates the necessary database and tables if they do not already exist.
 * This function ensures that the database schema is set up correctly when the application starts.
 * It uses a temporary connection to perform DDL (Data Definition Language) operations.
 *
 * @returns {Promise<void>} A promise that resolves when the database and tables are successfully created,
 *                          or rejects if a connection or creation error occurs.
 */

async function createSchemes() {

    try {

        // Establish a temporary connection without specifying a database initially,
        // as the database itself might need to be created.

        const connection = await createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        });

        // Create the database if it doesn't already exist.
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE};`)
        await connection.query(`USE ${process.env.MYSQL_DATABASE};`)

        // --- Create Tables ---
        // Execute DDL statements to create each table based on the imported SQL strings.
        // The order of table creation is important due to foreign key dependencies.

        // Create the Coder table
        await connection.query(coderTable);

        // Create the Technology table
        await connection.query(technologyTable)

        // Create the Project table
        await connection.query(projectTable)

        // Create the ProjectTechnology table
        await connection.query(projectTechnologyTable)

        // Create the ProjectCoder table
        await connection.query(projectCoderTable)

        // Create the MediaProject table
        await connection.query(mediaProject)

        // Create the Role table
        await connection.query(roleTable)

        // Create the User table
        await connection.query(userTable)

        // Create the User_Project table
        await connection.query(user_project_save)

        // Create the RefreshToken table
        await connection.query(refreshTokenTable)


        // Insert default roles into the `role` table if they don't already exist (`IGNORE`).
        await connection.query(`
            INSERT IGNORE INTO \`role\` (role_name) VALUES
            ('admin'),
            ('comercial'),
            ('cliente')
        `);


        console.log("Connected to MySQL database..." + "\nDatabase and tables created successfully...")

        // Close the temporary connection. The connection pool remains open and managed.
        connection.end();

    } catch (error) {

        // Log any errors encountered during the database connection or schema creation process.
        console.error("Can't connect to MySQL database: " + error.message);
    }

}

// Immediately invoke the `createSchemes` function to set up the database when the script runs.
await createSchemes()

