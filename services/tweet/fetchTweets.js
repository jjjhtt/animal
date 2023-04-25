import {config} from '../../config/index'
import Toast from 'tdesign-miniprogram/toast/index';
export function fetchTweetsList(pageIndex = 0, key = 0, match = '') {
  return new Promise((resolve) => {
    wx.request({
      url: config.domain + '/tweet/get',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
        "commentpage": pageIndex,
        "type": key,
        "match": match
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
