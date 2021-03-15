import express from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getMovies, postMovie, deleteMovie,
} from '../controllers/movies.js';
import { linkRegExp } from '../utils/utils.js';

export const movies = express.Router();

movies.get('/movies', getMovies);
movies.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2).max(30),
      duration: Joi.number().required(),
      year: Joi.string().required().min(4),
      description: Joi.string().required().min(2).max(2000),
      image: Joi.string().required().custom((value, helpers) => {
        if (!linkRegExp.test(value)) {
          return helpers.message('Ссылка не прошла валидацию');
        }
        return value;
      }),
      trailer: Joi.string().required().custom((value, helpers) => {
        if (!linkRegExp.test(value)) {
          return helpers.message('Ссылка не прошла валидацию');
        }
        return value;
      }),
      thumbnail: Joi.string().required().custom((value, helpers) => {
        if (!linkRegExp.test(value)) {
          return helpers.message('Ссылка не прошла валидацию');
        }
        return value;
      }),
      movieId: Joi.string().required().min(1).max(30),
      nameRU: Joi.string().required().min(1).max(30),
      nameEN: Joi.string().required().min(1).max(30),
    }),
  }),
  postMovie,
);
movies.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

export default movies;
