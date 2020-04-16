module.exports = function(middleware) {
  return function(req, res, next) {
    return Promise.resolve(middleware(req, res, next)).catch(next)
  }
}