import Movie from '../models/movie.js';
import BadRequestError from '../utils/errors/bad-request-error.js';
import ForbiddenError from '../utils/errors/forbidden-error.js';
import NotFoundError from '../utils/errors/not-found-error.js';
import { checkRequestToNull } from '../utils/utils.js';

export const getMovies = (req, res, next) => {
  Movie.find({owner: req.user._id})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

export const postMovie = (req, res, next) => {
  const movieData = req.body;
  const owner = req.user._id;

  if (!movieData && owner) {
    next(new BadRequestError('Переданы некорректные данные в метод создания фильма или пользователя'));
    return;
  }

  Movie.create({ ...movieData })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError('Переданы некорректные данные в метод создания фильма или пользователя');
      }
      res.send({ data: movie });
    })
    .catch(next);
};

export const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (checkRequestToNull(movie)) {
        throw new NotFoundError('Фильм не найден');
      }

      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Не хватает прав для удаления чужого фильма');
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((deletedMovie) => {
          res.send({ data: deletedMovie });
        })
        .catch(next);
    })
    .catch(next);
};
