const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/validator');

router.get('/me', getUser);
router.patch('/me', updateUserValidator, updateUser);

module.exports.userRouter = router;
