import express from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  editProfile, getUserInfo,
} from '../controllers/users.js';

export const users = express.Router();

users.get('/users/me/', getUserInfo);
users.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  editProfile,
);

export default users;
