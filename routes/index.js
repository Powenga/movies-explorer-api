const router = require('express').Router();

const { NotFoundError } = require('../errors/not-found-err');
const { userRouter } = require('./users');
//Валидация

router.post('/signup', );
router.post('/signin', );

router.use(auth());

router.use('/users', userRouter);
router.use('/movies', );

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден!'));
});

module.exports = router;
