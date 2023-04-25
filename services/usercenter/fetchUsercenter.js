import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index'

export function fetchUserCenter() {
  return new Promise((resolve) => {
    wx.request({
      url: config.domain + '/user/mainPage',
      method: 'POST',
      data: wx.getStorageSync('userId'),
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === 0) {
          console.log(res);
          resolve(res.data.body);
        } else {
          //console.log(res);
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
