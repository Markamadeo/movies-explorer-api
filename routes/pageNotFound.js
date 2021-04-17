import express from 'express';
import NotFoundError from '../utils/errors/not-found-error.js';

export const pageNotFound = express.Router();

pageNotFound.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

export default pageNotFound;
