
import express from 'express';

import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import './src/config/MySQL/mysql.db.js';
import { authRouter } from "./src/api/auth/auth.routes.js";
import { userRouter } from "./src/api/user/user.routes.js";
import { authenticate, authorize } from "./src/middlewares/auth.middleware.js";

config();
const app = express();

// app.use(cors());
const corsOptions = {
    origin: 'http://localhost:5173', // origen exacto de tu frontend Vite
    credentials: true,               // permite envío de cookies/tokens
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Public routes accessible to anyone
app.use('/auth', authRouter);

<!-- Before the first admin user is registered, comment out the authentication middleware in `index.js` for the users route temporarily: -->

// Protected routes that require authentication and admin role
app.use('/api/users', authenticate, authorize('admin'), userRouter )
// app.use('/api/users', userRouter)


app.get('/', (req, res) => {
    res.send('RiwiHub API');
});

let port = process.env.API_PORT || 3000;

app.listen(port, () =>
    console.log(`\nServer is running on http://localhost:${port}`));