import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import {
  DEFAULT_BASE_PATH, DEFAULT_MONGO_DB_NAME, DEFAULT_MONGO_DB_PATH, DEFAULT_PORT,
} from './utils/constants';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';
// eslint-disable-next-line
import expressTypes from './types/express';
import { auth } from './middlewares/auth';
import { errorHandler } from './errors/error-handler';

const {
  PORT = DEFAULT_PORT,
  BASE_PATH = DEFAULT_BASE_PATH,
  DATABASE = `${DEFAULT_MONGO_DB_PATH}/${DEFAULT_MONGO_DB_NAME}`,
} = process.env;

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DATABASE);

app.use(helmet());

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.table({
    PORT: `App listening on port ${PORT}`,
    ADDRESS: `App address ${BASE_PATH}:${PORT}`,
  });
});
