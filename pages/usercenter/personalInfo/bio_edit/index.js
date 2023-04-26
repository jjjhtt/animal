import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../../../config/index'

Page({
  data: {
    bioValue: '',
  },
  onLoad(options) {
    const { bio } = options;
    this.setData({
      bioValue: bio,
    });
  },
  onSubmit() {
    wx.request({
      url: config.domain + '/user/modify',
      data: {
          "userId": wx.getStorageSync('userId'),
          "username": "",
          "password": "",
          "passwordConfirm": "",
          "phone": "",
          "bio": this.data.bioValue
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(res);
        if (res.data.code === 0) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: "修改成功",
            theme: 'success',
          });
          setTimeout(()=>
          {
            wx.navigateBack();
          }, 1000)
        } else {
          console.log(res.data.message);
          Toast({
            context: this,
            message: res.data.message,
            theme: 'error',
          });
        }
      },
    });
    //wx.navigateBack();
  },
  clearContent() {
    this.setData({
      bioValue: '',
    });
  },
});
