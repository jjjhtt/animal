import {config} from '../../config/index'
import Toast from 'tdesign-miniprogram/toast/index';
export function fetchPopular() {
  return new Promise((resolve) => {
    wx.request({
      url: config.domain + '/help/hotSearch',
      method: 'POST',
      data: {

      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === 0) {
          console.log(res);
          resolve(res.data.body);
        } else {
          console.log(res);
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
