import Toast from 'tdesign-miniprogram/toast/index';
import { fetchUserCenter } from '../../../services/usercenter/fetchUsercenter';
import {config} from '../../../config/index'

Page({
  data: {
    personInfo: {
      usrename: '',
      avatarUrl: '',
      bio: '',
      email: ''
    },
    domain: 'https://anith2.2022martu1.cn'
  },
  onLoad() {
    
  },

  onShow() {
    this.init();
  },

  init() {
    this.fetchData();
  },
  fetchData() {
    fetchUserCenter().then(res => {
      this.setData({
        personInfo: res,
      });
      this.setData ({
        'personInfo.avatarUrl': this.data.domain+this.data.personInfo.avatarUrl
      });
    });
  },
  onClickCell({ currentTarget }) {
    const { dataset } = currentTarget;
    const { username } = this.data.personInfo;
    const { bio } = this.data.personInfo;
    const { phone } = this.data.personInfo;

    switch (dataset.type) {
      case 'name':
        wx.navigateTo({
          url: `/pages/usercenter/personalInfo/name_edit/index?name=${username}`,
        });
        break;
      case 'bio':
        wx.navigateTo({
          url: `/pages/usercenter/personalInfo/bio_edit/index?bio=${bio}`,
        });
        break;
      case 'phoneNumber':
        wx.navigateTo({
          url: `/pages/usercenter/personalInfo/phone_edit/index?phoneNumber=${phone}`,
        });
        break;
      case 'password':
        wx.navigateTo({
          url: '/pages/usercenter/personalInfo/password_edit/index',
        });
        break;
      case 'avatarUrl':
        this.toModifyAvatar();
        break;
      default: {
        console.log(this.data.personInfo);
        break;
      }
    }
  },

  onClickEmail() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: "邮箱地址不可修改",
    });
  },

  onClose() {
    
  },
  async toModifyAvatar() {
    let that = this;
    let path = ''
    try {
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.chooseMedia({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          mediaType: ['image'],
          success: (res) => {
            console.log(res);
            wx.cropImage({ 
              src: res.tempFiles[0].tempFilePath, // 图片路径 
              cropScale: '1:1', // 裁剪比例 
              success: (res)=>{ 
                path = res.tempFilePath;
                wx.uploadFile({
                  url: config.domain + '/image/upload', 
                  filePath: res.tempFilePath,
                  name: "image",
                  formData: {
                    "type": "user"
                  },
                  header: {
                    'content-type': 'multipart/form-data',
                    'authorization': wx.getStorageSync('token')
                  },
                  success (res){
                    //console.log(res);
                    let p = JSON.parse(res.data);
                    if (p.code == 7) {
                      Toast({
                        message: p.message,
                        theme: 'error',
                      });
                      wx.clearStorageSync();
                      setTimeout(() => {
                        wx.reLaunch({
                          url: '/pages/login/login',
                        })
                      }, 1000)
                      resolve(res)
                      return
                    }
                    if (p.code == 0) {
                      that.setData({
                        'personInfo.avatarUrl': path,
                      })
                    }
                    console.log(that.data.personInfo.avatarUrl)
                    //console.log(p.body.imagePath);
                    if (p.code == 1) {
                      Toast({
                        message: "图片大小超过10MB",
                      });
                      resolve(res)
                      return
                    }
                    wx.request({
                      url: config.domain + '/user/modify',
                      data: {
                          "userId": wx.getStorageSync('userId'),
                          "username": "",
                          "password": "",
                          "passwordConfirm": "",
                          "phone": "",
                          "bio": "",
                          "avatar": p.body.imagePath
                      },
                      method: "POST",
                      header: {
                        'content-type': 'application/json',
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
                          that.onShow();
                          resolve(res);
                        } else {
                          //console.log(res.data.message);
                          Toast({
                            context: this,
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
                      },
                      fail: (err) => reject(err),
                    })
                  }
                })
              }
            })
          },
          fail: (err) => reject(err),
        });
      });
    } catch (error) {
      //console.log(error);
    }
  },
});
