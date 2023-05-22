import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index'

export function fetchTweetsList(pageIndex = 0, match = '', key) {
  return new Promise((resolve) => {
    let tag = ''
    let m = ''
    if (match.charAt(0) == '#') {
      tag = match.substring(1)
    } else {
      m = match
    }
    wx.request({
      url: config.domain + '/user/help/get',
      method: 'POST',
      data: {
        "pageNum": 10,
        "page": pageIndex,
        "context": m,
        "type": key,
        "tag": tag
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
