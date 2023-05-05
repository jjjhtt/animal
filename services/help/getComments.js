import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index'

export function getComments(pageIndex = 0, id = 0) {
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
          resolve(res.data.body.comments);
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