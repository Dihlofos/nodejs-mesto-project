import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import {
  DEFAULT_BASE_PATH, DEFAULT_MONGO_DB_NAME, DEFAULT_MONGO_DB_PATH, DEFAULT_PORT,
} from './utils/constants';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';
import types from './types/index.d';
import { auth } from './middlewares/auth';
import { errorHandler } from './errors/error-handler';
import { notFound } from './middlewares/notFound';
import { createUser, login } from './controllers/users';
import { errorLogger, requestLogger } from './middlewares/logger';
import { userLoginValidate } from './middlewares/validations';

const {
  PORT = DEFAULT_PORT,
  BASE_PATH = DEFAULT_BASE_PATH,
  DATABASE = `${DEFAULT_MONGO_DB_PATH}/${DEFAULT_MONGO_DB_NAME}`,
} = process.env;

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DATABASE);

app.post('/signin', userLoginValidate, login);
app.post('/signup', userLoginValidate, createUser);
app.use(helmet());

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use('*', notFound);

app.use(errorLogger);
app.use(errors());
app.use(requestLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.table({
    PORT: `App listening on port ${PORT}`,
    ADDRESS: `App address ${BASE_PATH}:${PORT}`,
  });
});
