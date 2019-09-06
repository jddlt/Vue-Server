const user = require('./route/user')
const artical = require('./route/artical')
const upload = require('./route/upload')


module.exports = function(app) {
  user(app)
  artical(app)
  upload(app)
}