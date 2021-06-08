const router = require('express').Router();
const { getMovies, saveMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', saveMovie);
router.delete('/:_id', deleteMovie);

module.exports.movieRouter = router;
