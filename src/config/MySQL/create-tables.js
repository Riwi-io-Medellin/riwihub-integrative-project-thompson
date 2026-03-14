/**
 * @file db-schema.js
 * @description This file defines the SQL `CREATE TABLE` statements for the application's MySQL database schema.
 *              Each constant variable holds a DDL (Data Definition Language) string to create a specific table,
 *              including column definitions, data types, primary keys, foreign keys, unique constraints,
 *              check constraints, and indexes. This centralizes the database structure definition.
 */

/**
 * SQL statement to create the `role` table.
 * Stores different user roles (e.g., 'admin', 'comercial', 'cliente').
 *
 * @constant {string} roleTable
 */

const roleTable = `CREATE TABLE IF NOT EXISTS \`role\` (
                                role_id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                role_name  ENUM('admin','comercial','cliente') NOT NULL ,

                                PRIMARY KEY (role_id),
                                CONSTRAINT uq_role_name UNIQUE (role_name)
                            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

/**
 * SQL statement to create the `coder` table.
 * Stores information about coders/developers.
 *
 * @constant {string} coderTable
 */

const coderTable = `CREATE TABLE IF NOT EXISTS \`coder\`  (
                                coder_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                coder_name   VARCHAR(60) NOT NULL UNIQUE,
                                
                
                                PRIMARY KEY (coder_id),
                                INDEX        idx_coder_coder_name (coder_name)
                            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`


/**
 * SQL statement to create the `technology` table.
 * Stores a list of technologies used in projects or by coders.
 *
 * @constant {string} technologyTable
 */

const technologyTable = `CREATE TABLE IF NOT EXISTS \`technology\` (
                                technology_id   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                technology_name VARCHAR(30) NOT NULL,
                    
                                PRIMARY KEY (technology_id),
                                CONSTRAINT uq_technology_name UNIQUE (technology_name)
                            
                            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

/**
 * SQL statement to create the `project` table.
 * Contains details about projects, including their status, level, and curation score.
 *
 * @constant {string} projectTable
 */

const projectTable = `CREATE TABLE IF NOT EXISTS \`project\` (
                                project_id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                project_name  VARCHAR(60) NOT NULL UNIQUE,
                                short_description   TEXT NULL,
                                complete_description  TEXT NULL,
                                nicho           VARCHAR(100) NOT NULL,
                                project_link    VARCHAR(255) NULL DEFAULT "Sin link",
                                github_link     VARCHAR(255) NULL DEFAULT "Sin link",
                                route_level     ENUM('Básica', 'Avanzada', 'Complementos', 'Otra') NOT NULL DEFAULT 'Básica',
                                rating        TINYINT UNSIGNED NULL DEFAULT 0,
                                cohort       VARCHAR(50) NULL,
                                created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                deleted_at      DATETIME NULL DEFAULT NULL,
        
                                PRIMARY KEY (project_id),
                                INDEX idx_project_route (route_level),
                                INDEX idx_project_deleted_at (deleted_at),
                                INDEX idx_project_rating (rating)
                            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`


/**
 * SQL statement to create the `media_project` table.
 * Contains audio or videos about projects, including their media_url and media_type.
 *
 * @constant {string} mediaProject
 */

const mediaProject = `CREATE TABLE IF NOT EXISTS \`media_project\` (
                                media_project_id   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                media_url          VARCHAR(255) NOT NULL,
                                media_type         ENUM('image','video') NOT NULL DEFAULT 'video',
                                project_id         BIGINT UNSIGNED NOT NULL,
    
                                PRIMARY KEY (media_project_id),
                                CONSTRAINT fk_mp_project FOREIGN KEY (project_id) REFERENCES \`project\` (project_id)
                                    ON DELETE CASCADE ON UPDATE CASCADE,
                                INDEX idx_mp_project_id (project_id)
                                            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`


/**
 * SQL statement to create the `project_technology` join table.
 * Establishes a many-to-many relationship between `project` and `technology` tables.
 *
 * @constant {string} projectTechnologyTable
 */

const projectTechnologyTable = `CREATE TABLE IF NOT EXISTS \`project_technology\` (
                                            project_technology_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                            project_id            BIGINT UNSIGNED NOT NULL,
                                            technology_id         BIGINT UNSIGNED NOT NULL,
            
                                            PRIMARY KEY (project_technology_id),
                                            CONSTRAINT fk_pt_project FOREIGN KEY (project_id) REFERENCES \`project\` (project_id)
                                                    ON DELETE CASCADE ON UPDATE CASCADE,
                                            CONSTRAINT fk_pt_technology FOREIGN KEY (technology_id) REFERENCES \`technology\` (technology_id)
                                                    ON DELETE CASCADE ON UPDATE CASCADE,
                                            INDEX  idx_pt_technology_id (technology_id)
                                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`


/**
 * SQL statement to create the `project_coder` join table.
 * Establishes a many-to-many relationship between `project` and `coder` tables,
 * indicating which coders are assigned to which projects.
 *
 * @constant {string} projectCoderTable
 */

const projectCoderTable = `CREATE TABLE IF NOT EXISTS \`project_coder\` (
                                           project_coder_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                           project_id       BIGINT UNSIGNED NOT NULL,
                                           coder_id         BIGINT UNSIGNED NOT NULL,
            
                                           PRIMARY KEY (project_coder_id),
                                           CONSTRAINT fk_pd_project FOREIGN KEY (project_id) REFERENCES \`project\` (project_id)
                                                   ON DELETE CASCADE ON UPDATE CASCADE,
                                           CONSTRAINT fk_pd_coder FOREIGN KEY (coder_id) REFERENCES \`coder\` (coder_id)
                                                   ON DELETE CASCADE ON UPDATE CASCADE,

                                           INDEX idx_pd_coder_id (coder_id)
                                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

/**
 * SQL statement to create the `user` table.
 * Stores user authentication and profile information.
 *
 * @constant {string} userTable
 */

const userTable = `CREATE TABLE IF NOT EXISTS \`user\` (
                            user_id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                            username      VARCHAR(50) NOT NULL UNIQUE,
                            email         VARCHAR(100) NOT NULL UNIQUE,
                            password_hash VARCHAR(255) NOT NULL,
                            telephone     VARCHAR(15) NULL,
                            company       VARCHAR(100) NULL,
                            is_active     BOOLEAN NOT NULL DEFAULT TRUE,
                            role_id       BIGINT UNSIGNED NOT NULL,

                            created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            last_login    DATETIME NULL,

                            PRIMARY KEY (user_id), CONSTRAINT fk_user_role 
                            FOREIGN KEY (role_id) REFERENCES \`role\` (role_id)
                            ON DELETE RESTRICT ON UPDATE CASCADE,
                            INDEX idx_user_email (email),
                            INDEX idx_user_role (role_id)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

/**
 * SQL statement to create the `user_project_save` join table.
 * Records that project a user has saved, acting as a many-to-many relationship.
 *
 * @constant {string} user_project_save
 */

const user_project_save = `CREATE TABLE IF NOT EXISTS \`user_project_save\` (
                                    user_project_save_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                    user_id    BIGINT UNSIGNED NOT NULL,
                                    project_id BIGINT UNSIGNED NOT NULL,
                                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                
                                    PRIMARY KEY (user_project_save_id), 
                                    CONSTRAINT fk_ups_user FOREIGN KEY \`user\` (user_id) 
                                        REFERENCES \`user\` (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                    
                                    CONSTRAINT fk_ups_project FOREIGN KEY (project_id) 
                                        REFERENCES \`project\` (project_id)
                                        ON DELETE CASCADE ON UPDATE CASCADE,
                                        INDEX idx_ups_project_id (project_id)
                                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`


/**
 * SQL statement to create the `refresh_token` table.
 * Stores refresh tokens issued to users for maintaining long-term authenticated sessions.
 *
 * @constant {string} refreshTokenTable
 */

const refreshTokenTable = `CREATE TABLE IF NOT EXISTS \`refresh_token\` (
                                    token_id   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                    user_id    BIGINT UNSIGNED NOT NULL,
                                    token      VARCHAR(500) NOT NULL UNIQUE,
                                    expires_at DATETIME NOT NULL,
                                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
                                    PRIMARY KEY (token_id), CONSTRAINT fk_refresh_token_user FOREIGN KEY 
                                    (user_id) REFERENCES \`user\` (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
                                    INDEX idx_refresh_token_user (user_id),
                                    INDEX idx_refresh_token_expires (expires_at)
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

/**
 * Exports all defined table creation SQL statements as named constants.
 * This allows other parts of the application (e.g., database initialization scripts)
 * to easily import and execute these DDL statements to set up the database schema.
 */

export {coderTable, technologyTable, projectTable, projectTechnologyTable, projectCoderTable,
            userTable, user_project_save, refreshTokenTable, roleTable, mediaProject};