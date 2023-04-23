import Toast from 'tdesign-miniprogram/toast/index';
import {config} from '../../../../config/index'

Page({
  data: {
    nameValue: '',
  },
  onLoad(options) {
    const { name } = options;
    this.setData({
      nameValue: name,
    });
  },
  onSubmit() {
    console.log(wx.getStorageSync('userid'))
    wx.request({
      url: config.domain + '/user/modify',
      data: {
          "userId": wx.getStorageSync('userId'),
          "username": this.data.nameValue,
          "password": "",
          "passwordConfirm": "",
          "phone": "",
          "bio": ""
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
      nameValue: '',
    });
  },
});
