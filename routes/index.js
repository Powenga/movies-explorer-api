const router = require('express').Router();
const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/users');
const { movieRouter } = require('./movies');
const { userRouter } = require('./users');
const NotFoundError = require('../errors/not-found-err');

// Валидация

router.post('/signup', createUser);
router.post('/signin', login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден!'));
});

module.exports = router;
