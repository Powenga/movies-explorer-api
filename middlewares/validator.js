const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.createUserValidator = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().email().required().messages({
        'any.required': 'Поле "Email" должно быть заполнено!',
        'string.empty': 'Поле "Email" не может быть пустым!',
        'string.email': 'Невалидный email!',
      }),
      password: Joi.string().min(8).required().messages({
        'any.required': 'Поле "пароль" должно быть заполнено!',
        'string.empty': 'Поле "пароль" не может быть пустым!',
        'string.min': 'Пароль должен быть больше 8 символов!',
      }),
      name: Joi.string().min(2).max(30).required()
        .messages({
          'any.required': 'Имя должно быть заполнено!',
          'string.empty': 'Имя не может быть пустым!',
          'string.min': 'Имя должно быть больше 2 символов!',
          'string.max': 'Имя должно быть меньше 30 символов!',
        }),
    })
    .unknown(true),
});

module.exports.updateUserValidator = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().email().required().messages({
        'any.required': 'Поле "Email" должно быть заполнено!',
        'string.empty': 'Поле "Email" не может быть пустым!',
        'string.email': 'Невалидный email!',
      }),
      name: Joi.string().min(2).max(30).required()
        .messages({
          'any.required': 'Имя должно быть заполнено!',
          'string.empty': 'Имя не может быть пустым!',
          'string.min': 'Имя должно быть больше 2 символов!',
          'string.max': 'Имя должно быть меньше 30 символов!',
        }),
    })
    .unknown(true),
});

module.exports.loginValidator = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().email().required().messages({
        'any.required': 'Поле "Email" должно быть заполнено!',
        'string.empty': 'Поле "Email" не может быть пустым!',
        'string.email': 'Невалидный email!',
      }),
      password: Joi.string().min(8).required().messages({
        'any.required': 'Поле "пароль" должно быть заполнено!',
        'string.empty': 'Поле "пароль" не может быть пустым!',
        'string.min': 'Пароль должен быть больше 8 символов!',
      }),
    })
    .unknown(true),
});

module.exports.saveMovieValidator = celebrate({
  body: Joi.object()
    .keys({
      country: Joi.string().required().messages({
        'any.required': 'Поле "страна" должно быть заполнено!',
        'string.empty': 'Поле "страна" не может быть пустым!',
      }),
      director: Joi.string().required().messages({
        'any.required': 'Поле "режиссер" должно быть заполнено!',
        'string.empty': 'Поле "режиссер" не может быть пустым!',
      }),
      duration: Joi.number().required().messages({
        'any.required': 'Поле "продолжительность" не может быть пустым!',
        'number.base': 'Поле "продолжительность" должно быть числом!',
      }),
      year: Joi.string().required().messages({
        'any.required': 'Поле "год выпуска" должно быть заполнено!',
        'string.empty': 'Поле "год выпуска" не может быть пустым!',
      }),
      description: Joi.string().required().messages({
        'any.required': 'Поле "описание" должно быть заполнено!',
        'string.empty': 'Поле "описание" не может быть пустым!',
      }),
      image: Joi.string().required()
        .custom((value, helpers) => {
          if (!validator.isURL(value)) {
            return helpers.message('Поле "постер" должно быть ссылкой!');
          }
          return value;
        })
        .messages({
          'any.required': 'Поле "постер" должно быть заполнено!',
        }),
      trailer: Joi.string().required()
        .custom((value, helpers) => {
          if (!validator.isURL(value)) {
            return helpers.message('Поле "трейлер" должно быть ссылкой!');
          }
          return value;
        })
        .messages({
          'any.required': 'Поле "трейлер" должно быть заполнено!',
          'string.empty': 'Поле "трейлер" не может быть пустым!',
        }),
      thumbnail: Joi.string().required()
        .custom((value, helpers) => {
          if (!validator.isURL(value)) {
            return helpers.message('Поле "миниатюра" должно быть ссылкой!');
          }
          return value;
        })
        .messages({
          'any.required': 'Поле "миниатюра" должно быть заполнено!',
          'string.empty': 'Поле "миниатюра" не может быть пустым!',
        }),
      nameRU: Joi.string().required().messages({
        'any.required': 'Поле "название" должно быть заполнено!',
        'string.empty': 'Поле "название" не может быть пустым!',
      }),
      nameEN: Joi.string().required().messages({
        'any.required': 'Поле "title" должно быть заполнено!',
        'string.empty': 'Поле "title" не может быть пустым!',
      }),
    }).unknown(true),
});

module.exports.movieIdValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string()
      .alphanum()
      .length(24)
      .message('id фильма не валиден!'),
  }),
});

module.exports.authValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string()
      .alphanum()
      .length(24)
      .message('id фильма не валиден!'),
  }),
});
