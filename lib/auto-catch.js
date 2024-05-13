// auto catch is helper function that wraps our route handlers.  This way errors will be caught automatically and passed to next() in express
module.exports = function autoCatch (handlers) {
    return Object.keys(handlers).reduce((autoHandlers, key) => {
      const handler = handlers[key]
      autoHandlers[key] = (req, res, next) =>
        Promise.resolve(handler(req, res, next)).catch(next)
      return autoHandlers
    }, {})
  }
  