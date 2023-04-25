import {config} from "../../config/index"

export function fetchTweetsList(pageIndex = 0, match = '') {
  return new Promise((resolve) => {
    wx.request({
      url: config.domain + '/user/selfHelp',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "pageNum": 10,
        "page": pageIndex,
        "context": match
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === 0) {
          console.log(res);
          resolve(res.data.body.tweets);
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.message,
            theme: 'error',
          });
        }
      }
    })
  });
}
