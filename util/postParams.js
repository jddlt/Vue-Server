const querystring = require('querystring')

module.exports =  function postParams(req) {
  return new Promise((resolve, reject) => {
    let str = "";
    req.on("data", function (data) {
      str += data;
    })
    req.on("end", function () {
      console.log(456456465)
      if (str == '') {resolve(str)}
      var post = querystring.parse(str);
      console.log(66666666666)
      resolve(post)
      reject(post)
      console.log(7777777)
    })
  })
}