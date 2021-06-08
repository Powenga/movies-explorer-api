const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const ConflictError = require('../errors/conflict-err');

const {
  SAVED_MOVIES_NOT_FOUND_MESSAGE,
  MOVIE_DATA_IS_MISSING_MESSAGE,
  MOVIE_INVALID_DATA_MESSAGE,
  MOVIE_NOT_FOUND_MESSAGE,
  MOVIE_ALREADY_SAVED_MESSAGE,
  MOVIE_DELETED_MESSAGE,
  USER_INVALID_ID_MESSAGE,
  USER_FORBITTEN_MESSAGE,
  MONGOOSE_TYPE_ERROR,
  MONGOOSE_VALIDATION_ERROR,
  MONGO_DUPLICATE_ERROR_CODE,
} = require('../constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(new NotFoundError(SAVED_MOVIES_NOT_FOUND_MESSAGE))
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      if (err.name === MONGOOSE_TYPE_ERROR) {
        next(new BadRequestError(USER_INVALID_ID_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  if (
    !country
    || !director
    || !duration
    || !year
    || !description
    || !image
    || !trailer
    || !thumbnail
    || !movieId
    || !nameRU
    || !nameEN
  ) {
    next(new BadRequestError(MOVIE_DATA_IS_MISSING_MESSAGE));
  } else {
    Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    })
      .then((movie) => {
        res.status(201).send(movie);
      })
      .catch((err) => {
        if (
          err.name === MONGOOSE_TYPE_ERROR
          || err.name === MONGOOSE_VALIDATION_ERROR
        ) {
          next(new BadRequestError(MOVIE_INVALID_DATA_MESSAGE));
        } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
          next(new ConflictError(MOVIE_ALREADY_SAVED_MESSAGE));
        } else {
          next(err);
        }
      });
  }
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new NotFoundError(MOVIE_NOT_FOUND_MESSAGE))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError(USER_FORBITTEN_MESSAGE);
      }
      return Promise.resolve(movie);
    })
    .then((movie) => Movie.deleteOne(movie))
    .then(() => res.send({ message: MOVIE_DELETED_MESSAGE }))
    .catch((err) => {
      if (err.name === MONGOOSE_TYPE_ERROR) {
        next(new BadRequestError(MOVIE_INVALID_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};
