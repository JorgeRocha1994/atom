import * as dotenv from 'dotenv';
import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

import { userRouter } from './interface/routes/user.router';
import { taskRouter } from './interface/routes/tasks.router';

dotenv.config();

admin.initializeApp();
const firestore = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use('/user', userRouter(firestore));
app.use('/task', taskRouter(firestore));

export const api = functions.https.onRequest(app);
