# Architecture Overview

This project uses a **Feature-based Layered Architecture**, which is a modern and scalable approach for building backend applications. It is designed to be highly modular and maintainable.

## Architecture Overview

The project follows a **Feature-based Layered Architecture**. This approach ensures high cohesion and low coupling by grouping logic by business functionality.

### Core Principles
1.  **Feature-Based (Modular)**: Files are grouped by feature (e.g., `user`, `project`, `auth`) rather than type.
2.  **Layered Responsibility**: Separation of concerns across distinct logic layers.

---

## Project Structure & Responsibilities

Each feature module within `src/api/` follows a strict pattern to ensure maintainability:

### Module Components (Per Feature)
*   **`*.routes.js` (The Entry Point)**:
    Defines the HTTP endpoints and methods. It acts as a traffic controller, delegating the request to the appropriate controller and applying security middlewares (authentication/authorization) where needed.
*   **`*.controllers.js` (The Orchestrator)**:
    Receives the request object (`req`) and extracts data. It communicates with the service layer to execute business logic and is responsible for sending the final response (`res`) and status codes to the client. It never talks directly to the database.
*   **`*.services.js` (The Brain)**:
    This is where the business rules live. It performs data validation (using **Zod**), manages complex workflows (like creating a project and linking coders and technologies simultaneously), and processes data before it's saved or returned.
*   **`*.repository.js` (The Data Access Layer)**:
    Contains specialized database queries (SQL) for that specific feature. It abstracts the database implementation from the rest of the application, communicating directly with the database.

### Global Folders
*   **`src/config/`**: Contains application-wide configuration files, such as the MySQL connection pool.
*   **`src/middlewares/`**: Global functions that intercept requests (e.g., `auth.middleware.js` to verify JWT tokens, `validation.middleware.js` to validate request parameters).
*   **`src/repositories/`**: Houses the **Generic Repository** pattern, providing reusable SQL functions (`insertIntoTable`, `selectAll`, `updateTable`) to avoid code repetition across the app.
*   **`src/utils/`**: Helper functions and global error handlers (`errorHandler.js`) used throughout the project.

---

## Getting Started

### Prerequisites
- **Node.js** (LTS version recommended)
- **MySQL Server**
- **npm** (Package manager)

### Installation & Setup
1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```
2.  Configure your environment variables in a `.env` file (see [Environment Variables](#-environment-variables)).

### Running the API
*   **Development Mode (with Nodemon):**
    ```bash
    npm run api
    ```
    The server will start at: `http://localhost:3000` (or the port specified in your `.env`).

---

## API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login and receive an access token. A refresh token is sent via an HTTP-only cookie. |
| `POST` | `/api/auth/refresh` | (Authenticated) Renews access token using the refresh token from the cookie. |
| `POST` | `/api/auth/logout` | (Authenticated) Terminates the session and clears the refresh token cookie. |
| `GET` | `/api/auth/profile` | (Authenticated) Gets the current authenticated user's data from the token. |

### Users & Registration
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users` | Register a new user (default role: `cliente`). |
| `GET` | `/api/users` | (Admin only) List all users. |
| `GET` | `/api/users/:id` | (Admin only) Get a user by ID. |
| `PATCH` | `/api/users/:id` | (Admin only) Update user roles, credentials, or other information. |
| `DELETE` | `/api/users/:id` | (Admin only) Delete a user account. |

### Projects
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | Get all projects (supports `?id=` or `?name=`). |
| `GET` | `/api/projects/all` | Get all projects including their associated coders and technologies. |
| `GET` | `/api/projects/:id` | Get detailed information of a single project. |
| `POST` | `/api/projects` | (Admin only) **Massive Creation**: Creates project and auto-links coders and technologies. |
| `PATCH` | `/api/projects/:id` | (Admin only) Update project fields (Partial update). |
| `DELETE` | `/api/projects/:id` | (Admin only) Delete a project. |

### Project Media
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/media-projects` | (Authenticated) List all project media (images/videos). |
| `GET` | `/api/media-projects/:id` | (Authenticated) Get specific media details. |
| `POST` | `/api/media-projects` | (Admin only) Add new media to a project. |
| `PATCH` | `/api/media-projects/:id` | (Admin only) Update media URL or type. |
| `DELETE` | `/api/media-projects/:id` | (Admin only) Remove media. |

### Coders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/coders` | List all coders. |
| `GET` | `/api/coders/:id` | Get coder by ID. |
| `POST` | `/api/coders` | (Admin only) Create a new coder record. |
| `PATCH` | `/api/coders/:id` | (Admin only) Update coder information. |
| `DELETE` | `/api/coders/:id` | (Admin only) Remove a coder from the system. |

### Technologies
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/technologies` | List all technologies. |
| `GET` | `/api/technologies/:id` | Get technology by ID. |
| `POST` | `/api/technologies` | (Admin only) Create a new technology record. |
| `PATCH` | `/api/technologies/:id` | (Admin only) Update technology information. |
| `DELETE` | `/api/technologies/:id` | (Admin only) Remove a technology from the system. |

---

**Important: Creating the First Admin User**

Before any users can be managed, you'll need to create the initial admin user. Since user registration is protected, follow these steps:

1.  **Temporarily Disable Authentication:** In your `index.js` file, locate the line where the `/api/users` route is defined and comment out the `authenticate` and `authorize('admin')` middlewares. This temporarily opens the route for registration.

    ```javascript
    // app.use('/api/users', authenticate, authorize('admin'), userRouter )  // Comment out this line temporarily
    app.use('/api/users', userRouter)
    ```

2.  **Create Admin User via Postman (or similar tool):**

    *   Send a `POST` request to `http://localhost:3000/api/users` (adjust the port if necessary).
    *   Set the `Content-Type` header to `application/json`.
    *   Include the following JSON structure in the request body:

        ```json
        {
          "username": "adminUsername",
          "email": "admin@example.com",
          "password": "yourAdminPassword",
          "role_name": "admin"
        }
        ```

3.  **Re-enable Authentication:** After creating the admin user, **immediately** uncomment the authentication middlewares in `index.js` to secure the user routes again.

    ```javascript
    app.use('/api/users', authenticate, authorize('admin'), userRouter )  // Uncomment this line to restore security
    // app.use('/api/users', userRouter)
    ```


## Environment Variables
Create a `.env` file in the root directory:
```env
# Server
PORT=3000

# Database
MYSQL_HOST=your_host
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_db_name

# JSON Web Token
JWT_SECRET=your_super_secret_key_with_at_least_32_characters
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=3d
```
## Detailed Project Structure

```text
Backend/
├── src/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── auth.controllers.js     # Handles HTTP login, logout, refresh, and profile requests.
│   │   │   ├── auth.repository.js      # Specific SQL: checking active users, refresh token validation.
│   │   │   ├── auth.routes.js          # Router for /auth/* endpoints.
│   │   │   └── auth.services.js        # Logic: Zod validation, JWT generation, bcrypt comparison.
│   │   ├── coder/
│   │   │   ├── coder.controllers.js    # Receives requests for coder CRUD.
│   │   │   ├── coder.routes.js         # Routes for /api/coders (protected by Admin for write ops).
│   │   │   └── coder.services.js       # Business logic for coders, validation with Zod.
│   │   ├── media_project/
│   │   │   ├── media_project.controllers.js # Handles media-related HTTP requests.
│   │   │   ├── media_project.routes.js      # Routes for managing project images/videos.
│   │   │   └── media_project.services.js    # Logic for URL validation and project-media linkage.
│   │   ├── project/
│   │   │   ├── project.controllers.js  # Orchestrates complex project creation workflows.
│   │   │   ├── project.routes.js       # Routes for /api/projects.
│   │   │   └── project.services.js     # "Atomic" logic: links coders, techs, and media during creation.
│   │   ├── project_coder/
│   │   │   └── project_coder.services.js    # Logic for associating many-to-many: Projects <-> Coders.
│   │   ├── project_technology/
│   │   │   └── project_technology.services.js # Logic for associating many-to-many: Projects <-> Techs.
│   │   ├── technology/
│   │   │   ├── technology.controllers.js # Orchestrates technology management.
│   │   │   ├── technology.routes.js      # Routes for /api/technologies.
│   │   │   └── technology.services.js    # Business logic for technology records.
│   │   ├── user/
│   │   │   ├── user.controllers.js     # Controller for registration and user management.
│   │   │   ├── user.repository.js      # SQL: Fetching roles, creating initial user records.
│   │   │   ├── user.routes.js          # Routes for /api/users (Admin-only management).
│   │   │   └── user.services.js        # Logic: User creation, password hashing via bcrypt.
│   │   └── user_project_save/
│   │       └── user_project_save.services.js # Logic for users saving their favorite projects.
│   ├── config/
│   │   └── MySQL/
│   │       ├── create-tables.js        # SQL DDL: Table definitions (Project, User, RefreshToken, etc.).
│   │       └── mysql.db.js             # Initializes Pool and auto-creates schema on startup.
│   ├── middlewares/
│   │   ├── auth.middleware.js        # Auth guard: JWT verification and Role-Based Access (RBAC).
│   │   └── validation.middleware.js  # Common validations (e.g., checking for numeric IDs).
│   ├── repositories/
│   │   └── repository.js               # Generic DAO: insertIntoTable, selectBy, updateTable, etc.
│   └── utils/
│       └── errorHandler.js           # Global Error Handler: formatting Zod, MySQL, and Auth errors.
├── .env                                # Credentials and secrets.
├── .gitignore                          # Files to exclude from Git.
├── index.js                            # Main Entry Point: boots Express, middlewares, and routers.
├── package-lock.json                   # Locked dependencies.
└── package.json                        # Scripts and dependencies (express, mysql2, zod, etc.).
```