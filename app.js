import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { celebrate, Joi, errors } from 'celebrate';
import helmet from 'helmet';
import { DB_LINK, PORT } from './utils/appConfig.js';
import limiter from './utils/limiterConfig.js';
import corsOptions from './utils/corsConfig.js';
import { movies } from './routes/movies.js';
import { pageNotFound } from './routes/pageNotFound.js';
import { users } from './routes/users.js';
import { login, createUser, logout } from './controllers/users.js';
import { auth } from './middlewares/auth.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

dotenv.config();
const app = express();

mongoose.connect(DB_LINK, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('*', cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);

app.get(
  '/logout',
  logout,
);

app.use(
  '/',
  auth,
  users,
  movies,
  pageNotFound,
);

app.use(errorLogger);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? `На сервере произошла ошибка: ${message}`
        : message,
    });
});

app.listen(PORT, () => { // eslint-disable-next-line no-console
  console.log(`Server has been started on port ${PORT}...`);
});
