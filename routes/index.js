const user = require('./route/user')
const artical = require('./route/artical')


module.exports = function(app) {
  user(app)
  artical(app)
}