import {config} from '../../config/index'
import Toast from 'tdesign-miniprogram/toast/index';
export function fetchComments(pageIndex = 0, id = 0) {
  return new Promise((resolve) => {
    wx.request({
      url: config.domain + '/tweet/getComments',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "tweetId": id,
        "commentPage":pageIndex
      },
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 0) {
          console.log(res);
          resolve(res.data.body.comments);
        } else {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.data.message,
            theme: 'error',
          });
          if (res.data.code == 7) {
            wx.clearStorageSync();
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/login/login',
              })
            }, 1000)
          }
        }
      }
    })
  });
}
