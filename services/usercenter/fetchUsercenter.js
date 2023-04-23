import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../config/index'

export function fetchUserCenter() {
  return new Promise((resolve) => {
    wx.request({
      url: config.domain + '/animal/api/usercenter',
      method: 'POST',
      data: wx.getStorageSync('userid'),
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === 0) {
          resolve(res.data.userInfo);
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
