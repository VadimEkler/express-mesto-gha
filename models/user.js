const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2 символа!'],
    maxlength: [30, 'Максимальная длина поля - 30 символов!'],
    required: [true, 'Поле должно быть заполнено!'],
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2 символа!'],
    maxlength: [30, 'Максимальная длина поля - 30 символов!'],
    required: [true, 'Поле должно быть заполнено!'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле должно быть заполнено!'],
    validate: {
      validation(url) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(url);
      },
      message: 'Введите URL!',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
