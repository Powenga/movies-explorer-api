module.exports.errorHandler = (error, req, res, next) => {
  const { statusCode = 500, message } = error;
  if (res.headersSent) {
    return next(error);
  }
  return res.status(statusCode).send({
    message: statusCode === 500 ? 'Что-то пошло не так!' : message,
  });
};
