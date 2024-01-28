const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnathorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле должно быть заполнено!'],
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Некорректный E-mail!',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено!'],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2 символа!'],
    maxlength: [30, 'Максимальная длина поля - 30 символов!'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2 символа!'],
    maxlength: [30, 'Максимальная длина поля - 30 символов!'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: 'Ошибка в URL!',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnathorizedError('Пользователь с данным E-mail не найден!');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnathorizedError('Неправильные почта или пароль!');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
