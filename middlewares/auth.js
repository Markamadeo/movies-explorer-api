import jwt from 'jsonwebtoken';
import UnauthorizedError from '../utils/errors/unauthorized-error.js';
import { JWT_DEV_SECRET } from '../utils/appConfig.js';

export const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV !== 'production' ? JWT_DEV_SECRET : JWT_SECRET);
  } catch (e) {
    const err = new UnauthorizedError('Необходима авторизация');
    next(err);
  }
  req.user = payload;
  next();
};

export default auth;
