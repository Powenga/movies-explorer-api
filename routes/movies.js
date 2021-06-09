const router = require('express').Router();
const { getMovies, saveMovie, deleteMovie } = require('../controllers/movies');
const { saveMovieValidator, movieIdValidator } = require('../middlewares/validator');

router.get('/', getMovies);
router.post('/', saveMovieValidator, saveMovie);
router.delete('/:id', movieIdValidator, deleteMovie);

module.exports.movieRouter = router;
