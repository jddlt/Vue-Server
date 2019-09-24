const promise_one = new Promise((resolve, reject) => {
  
})
const promise_two = new Promise((resolve, reject) => {
  
})
Promise.all(['Promise_one', 'Promise_two']).then(() => {
  mySend(res, { msg: '取消点赞成功' })
}).catch(err => {
  myError(res, err)
})