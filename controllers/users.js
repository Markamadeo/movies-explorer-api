import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { JWT_DEV_SECRET, DOMAIN } from '../utils/appConfig.js';
import BadRequestError from '../utils/errors/bad-request-error.js';
import ConflictError from '../utils/errors/conflict-error.js';
import { checkRequestToNull } from '../utils/utils.js';

export const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const createUser = (req, res, next) => {
  User.init()
    .then(() => {
      if (checkRequestToNull(req.body)) {
        throw new BadRequestError('Тело запроса не может быть пустым');
      }
      bcrypt.hash(req.body.password, 10)
        .then((hash) => {
          if (!hash) {
            throw new BadRequestError('Переданы некорректные данные в метод создания фильма или пользователя');
          }
          User.create({
            email: req.body.email,
            password: hash,
            name: req.body.name,
          })
            .then((user) => {
              if (!user) {
                throw new BadRequestError('Переданы некорректные данные в метод создания фильма или пользователя');
              }
              res.send({
                data: {
                  email: user.email,
                  name: user.name,
                },
              });
            })
            .catch((err) => {
              if (err.code === 11000) {
                return next(new ConflictError('Данный email уже используется'));
              }
              return next(err);
            });
        })
        .catch(next);
    })
    .catch(next);
};

export const editProfile = (req, res, next) => {
  const { email, name } = req.body;
  if (!email && !name) {
    next(new BadRequestError('Переданы некорректные данные в метод создания карточки или пользователя'));
  }
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Данный email уже используется'));
      }
      return next(err);
    });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV !== 'production' ? JWT_DEV_SECRET : JWT_SECRET, { expiresIn: '7d' });
      if(NODE_ENV === 'production') {
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          domain: NODE_ENV !== 'production' ? 'localhost:3000' : DOMAIN,
          sameSite: 'none',
          secure: true,
        }).send({ message: 'Авторизация успешна' });
        return;
      }
      res.cookie('jwt', token).send({ message: 'Авторизация успешна' });
    })
    .catch(next);
};

export const logout = (req, res) => {
  const { NODE_ENV } = process.env;
  if(NODE_ENV === 'production') {
    res.cookie('jwt', 'deleted', {
      maxAge: 100,
      httpOnly: true,
      domain: NODE_ENV !== 'production' ? 'localhost:3000' : DOMAIN,
      sameSite: 'none',
      secure: true,
    }).send({ message: 'Выход успешно выполнен' });
    return;
  }
  res.clearCookie('jwt').send({ message: 'Выход успешно выполнен' });
};
