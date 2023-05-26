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
    try {
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.chooseMedia({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          mediaType: ['image'],
          success: (res) => {
            console.log(res);
            const path = res.tempFiles[0].tempFilePath;
            this.setData({
              'personInfo.avatarUrl': path,
            })
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.setData({
                'userInfo.avatarUrl': path,
            })
            wx.uploadFile({
              url: config.domain + '/image/upload', 
              filePath: path,
              name: "image",
              formData: {
                "type": "user"
              },
              header: {
                'content-type': 'multipart/form-data',
                'authorization': wx.getStorageSync('token')
              },
              success (res){
                console.log(res);
                let p = JSON.parse(res.data);
                //console.log(p.body.imagePath);
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
                  header: {
                    'content-type': 'multipart/form-data',
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
                      resolve(res);
                    } else {
                      //console.log(res.data.message);
                      Toast({
                        context: this,
                        message: res.data.message,
                        theme: 'error',
                      });
                    }
                  },
                  fail: (err) => reject(err),
                })
              }
            })
          },
          fail: (err) => reject(err),
        });
      });
    } catch (error) {
      console.log(error);
      Toast({
        context: this,
        selector: '#t-toast',
        message: error.errMsg || error.msg || '修改头像出错了',
        theme: 'error',
      });
    }
  },
});
