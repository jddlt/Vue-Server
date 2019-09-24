const postParams = require('../../util/postParams')
const { userModel, articalModel } = require('../../mongodb/usr')
const { mySend, myError } = require('../../util/send')

module.exports = function (app) {

    // 发帖子接口
    app.post('/artical/sendArtical', async (req, res) => {
        const { title, content, author } = app.get('params');
        articalModel.create({
            title,
            content,
            likes: [],
            answer: [],
            collect: 0,
            id: app.get('_id'),
            create_time: new Date().getTime(),
            author: JSON.parse(author)
        }, err => {
            if (err) {
                myError(res, err)
                return
            }
            mySend(res, { msg: '发贴成功' })
        })
    })

    // 获取帖子
    app.get('/artical', async (req, res) => {
        const { pageIndex } = req.query;
        articalModel.countDocuments({}, (err, count) => {
            if (err) {
                myError(res, err)
                return
            }
            articalModel.find({})
                .skip(5 * ((pageIndex ? pageIndex : 1) - 1))
                .sort({ '_id': -1 })
                .limit(5)
                .exec((err, msg) => {
                    if (err) {
                        myError(res, err)
                        return
                    }
                    mySend(res, { msg: '获取成功', data: msg, total: count })
                })
        })
    })

    // 点赞帖子
    app.get('/artical/like', async (req, res) => {
        const { id, is_like } = req.query
        const userId = app.get('_id')
        if(String(is_like) == 'true') {
            const promise_one = new Promise((resolve, reject) => {
                articalModel.updateOne({_id: id}, {
                    $push: {
                        likes: userId
                    },
                    $inc: {collect: 1}
                }, 
                (err, meg) => {
                    if (err) {
                        reject(err)
                    }
                    resolve()
                    // mySend(res, { msg: '点赞成功' })
                })
            })
            const promise_two = new Promise((resolve, reject) => {
                articalModel.findOne({_id: id}, (err, msg) => {
                    if(err) {
                        reject(err)
                    }
                    userModel.updateOne({_id: msg.id}, {
                        $inc: {like: 1}
                    }, 
                    (err, meg) => {
                        if (err) {
                            reject(err)
                        }
                        resolve()
                    })
                })

            })
            Promise.all([promise_one, promise_two]).then(() => {
                mySend(res, { msg: '点赞成功' })
            }).catch(err => {
                myError(res, err)
            })
        } else {
            const promise_one = new Promise((resolve, reject) => {
                articalModel.updateOne({_id: id}, {
                    $pull: {
                        likes: userId
                    },
                    $inc: {collect: -1}
                }, 
                (err, meg) => {
                    if (err) {
                        reject(err)
                    }
                    resolve()
                    // mySend(res, { msg: '点赞成功' })
                })
            })
            const promise_two = new Promise((resolve, reject) => {
                articalModel.findOne({_id: id}, (err, msg) => {
                    if(err) {
                        reject(err)
                    }
                    userModel.updateOne({_id: msg.id}, {
                        $inc: {like: -1}
                    }, 
                    (err, meg) => {
                        if (err) {
                            reject(err)
                        }
                        resolve()
                    })
                })
            })
            Promise.all([promise_one, promise_two]).then(() => {
                mySend(res, { msg: '取消点赞成功' })
            }).catch(err => {
                myError(res, err)
            })
        }
    })

    // 获取帖子排行
    app.get('/artical/sort', async (req, res) => {
        articalModel.find({}).sort({ 'looks': -1 }).limit(9).exec((err, msg) => {
            if (err) {
                myError(res, err)
                return
            }
            mySend(res, { msg: '获取成功', data: msg })
        })
    })

    // 获取帖子详情
    app.get('/artical/detail', async (req, res) => {
        const { _id } = req.query;
        const promise_one = new Promise((resolve, reject) => {
            articalModel.findOne({ _id }, (err, msgD) => {
                if (err) {
                    reject(err)
                }
                userModel.updateOne({ _id: msgD.id},{
                    $inc: {looks: 1}
                }, (err, msg) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(msgD)
                });
            });
        })
        const promise_two = new Promise((resolve, reject) => {
            articalModel.updateOne({_id}, {
                $inc: {looks: 1}
            }, (err, msg) => {
                if(err) {
                    reject(err)
                } 
                resolve()
            })
        })
        Promise.all([promise_one, promise_two]).then((sres) => {
          mySend(res, { msg: '获取成功', data: sres[0] })
        }).catch(err => {
          myError(res, err)
        })
        
    })

    // 回复帖子
    app.get('/artical/reply', async (req, res) => {
        const { _id, content } = req.query;
        articalModel.updateOne({ _id }, {
            '$push': {
                answer: {
                    user_info: app.get('userInfo'),
                    content,
                    time: new Date().getTime()
                }
            }
        }, (err, msg) => {
            if (err) {
                myError(res, err)
                return
            }
            mySend(res, { msg: '评论成功' })
        });
    })

}
