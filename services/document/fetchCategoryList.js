import {config} from "../../config/index"
import Toast from 'tdesign-miniprogram/toast/index';

export function getCategoryList(pageIndex = 0, match = '') {
  return new Promise((resolve) => {
    wx.request({
      url: config.domain+ '/animal/get',
      method: 'POST',
      data: {
        "pageNum": 24,
        "page": 0,
        "context": ''
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code === 0) {
          console.log(res);
          resolve(res.data.body.animals);
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
