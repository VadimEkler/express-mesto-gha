const router = require('express').Router();
const signupRoutes = require('./signup');
const signinRoutes = require('./signin');
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

router.use('/signup', signupRoutes);
router.use('/signin', signinRoutes);
router.use(auth);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена!'));
});

module.exports = router;
