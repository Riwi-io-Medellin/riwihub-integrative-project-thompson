
import express from 'express';

import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import './src/config/MySQL/mysql.db.js';
import { projectRouter } from "./src/api/project/project.routes.js";
import { coderRouter } from "./src/api/coder/coder.routes.js";
import { authRouter } from "./src/api/auth/auth.routes.js";
import { userRouter } from "./src/api/user/user.routes.js";
import { technologyRouter } from "./src/api/technology/technology.routes.js";
import { authenticate, authorize } from "./src/middlewares/auth.middleware.js";
import { mediaProjectRouter } from './src/api/media_project/media_project.routes.js';
import  cors  from "cors";

config();
const app = express();

const corsOptions = {
    origin: ['http://localhost:5173','http://localhost','https://riwihub-backend-production.up.railway.app','https://riwihub.netlify.app'],
    credentials: true,               // allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Public routes accessible to anyone
app.use('/auth', authRouter);

// Protected routes that require authentication
app.use('/api/projects', authenticate, projectRouter);
app.use('/api/coders', authenticate,  coderRouter);


// Before any users can be managed, you'll need to create the initial admin user.
// Since user registration is protected, see the README.md

// Protected routes that require authentication and admin role
app.use('/api/users', authenticate, authorize('admin','comercial'), userRouter )
// app.use('/api/users', userRouter)


app.use('/api/technologies', authenticate, technologyRouter);
app.use('/api/media-projects', authenticate, mediaProjectRouter);


app.get('/', (req, res) => {
    res.send('RiwiHub API - Sistema de autenticación JWT activo');
});

let port = process.env.API_PORT || 3000;

app.listen(port, () =>
    console.log(`\nServer is running on http://localhost:${port}`));