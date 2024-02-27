import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {userRouter} from './user/user.router';
import {collectionRouter} from './collection/collection.router';
import {ressourceRouter} from "./ressource/ressource.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT, 10);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/collections', collectionRouter);
app.use('/api/ressources', ressourceRouter);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})