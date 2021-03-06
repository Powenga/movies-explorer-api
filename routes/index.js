const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUserValidator, loginValidator } = require('../middlewares/validator');
const { createUser, login, logout } = require('../controllers/users');
const { movieRouter } = require('./movies');
const { userRouter } = require('./users');
const NotFoundError = require('../errors/not-found-err');

// Валидация

router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginValidator, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.get('/signout', logout);

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден!'));
});

module.exports = router;
