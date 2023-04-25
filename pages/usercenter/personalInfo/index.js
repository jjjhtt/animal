import Toast from 'tdesign-miniprogram/toast/index';
import { fetchUserCenter } from '../../../services/usercenter/fetchUsercenter';
import {config} from '../../../config/index'

Page({
  data: {
    personInfo: {
      avatarUrl: '',
      nickName: '',
      bio: '',
      phoneNumber: '',
    },
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
      console.log(res);
      this.setData({
        personInfo: res,
        'personInfo.phoneNumber': res.phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      });
    });
  },
  onClickCell({ currentTarget }) {
    const { dataset } = currentTarget;
    const { nickName } = this.data.personInfo;
    const { bio } = this.data.personInfo;
    const { phoneNumber } = this.data.personInfo;

    switch (dataset.type) {
      case 'name':
        wx.navigateTo({
          url: `/pages/usercenter/personalInfo/name_edit/index?name=${nickName}`,
        });
        break;
      case 'bio':
        wx.navigateTo({
          url: `/pages/usercenter/personalInfo/bio_edit/index?bio=${bio}`,
        });
        break;
      case 'phoneNumber':
        wx.navigateTo({
          url: `/pages/usercenter/personalInfo/phone_edit/index?phoneNumber=${phoneNumber}`,
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
        break;
      }
    }
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
          success: (res) => {
            const path = res.tempFiles[0].tempFilePath;
            wx.uploadFile({
              url: config.domain + '/upload', 
              filePath: tempFilePaths[0],
              formData: {
                "image": res.tempFiles[0],
                "type": "user"
              },
              success (res){
                const data = res.data
                resolve(path);
              },
              fail: (err) => reject(err),
            })
          },
          fail: (err) => reject(err),
        });
      });
      Toast({
        context: this,
        selector: '#t-toast',
        message: `已选择图片-${tempFilePath}`,
        theme: 'success',
      });
    } catch (error) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: error.errMsg || error.msg || '修改头像出错了',
        theme: 'error',
      });
    }
  },
});
