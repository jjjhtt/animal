import {config} from '../../config/index'
import Toast from 'tdesign-miniprogram/toast/index';
export function fetchTweetsList(pageIndex = 0, match = '') {
  return new Promise((resolve) => {
    wx.request({
      url: config.domain + '/user/selfTweet',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "page": pageIndex,
        "context": ''
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
          console.log(res);
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