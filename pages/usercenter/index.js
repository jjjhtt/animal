import Toast from 'tdesign-miniprogram/toast/index';
import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import {config} from '../../config/index'


const menuData = [
  [
    {
      title: '个人信息',
      type: 'info',
    },
    {
      title: '我的帖子',
      type: 'myTweets',
    },
    {
      title: '我的求助',
      type: 'myHelp',
    },
    {
      title: '我的收藏',
      type: 'myCollections',
    },
    {
      title: '我的领养',
      type: 'myAdoption',
    },
    {
      title: '我的消息',
      type: 'myMessage',
    },
  ],
  [
    {
      title: '退出登录',
      tit: '',
      url: '',
      type: 'exit',
    },
  ]
];

const getDefaultData = () => ({
  userInfo: {
    avatarUrl: '',
    username: '未登录',
    number: 20000000,
    phoneNumber: '',
  },
  menuData,
  versionNo: 'Stable',
  MessageNum: 1,
  showConfirm: false,
  domain: 'https://anith2.2022martu1.cn',
  avatar: ''
});

Page({
  data: getDefaultData(),
  
  onLoad() {
    
  },

  onShow() {
    this.init();
  },

  onReady() {
    this.init();
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.fetUseriInfoHandle();
    wx.request({
      url: config.domain + '/user/message/unreadNum',
      method: 'POST',
      data: {
        "userId": wx.getStorageSync('userId'),
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success: (res)=> {
        if (res.data.code === 0) {
          //console.log(res);
          this.setData({
            MessageNum: res.data.body.num
          })
        } else {
          //console.log(res);
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
      },
      fail: (res)=> {
        console.log(res)
      }
    })
    
  },

  fetUseriInfoHandle() {
    fetchUserCenter().then(
      res => {
        menuData?.[0].forEach((v) => {
        });
        //console.log(res);
        this.setData({
          userInfo: res,
          menuData,
        });
        this.setData ({
          avatar: this.data.domain+this.data.userInfo.avatarUrl
        });
        wx.stopPullDownRefresh();
      },
    );
    
  },
  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;
    switch (type) {
      case 'info': {
        wx.navigateTo({ url: '/pages/usercenter/personalInfo/index' });
        break;
      }
      case 'myTweets': {
        wx.navigateTo({ url: '/pages/usercenter/my_tweets/index' });
        break;
      }
      case 'myCollections': {
        wx.navigateTo({ url: '/pages/usercenter/collection/index' });
        break;
      }
      case 'myHelp': {
        wx.navigateTo({ url: '/pages/usercenter/help/index' });
        break;
      }
      case 'myMessage': {
        wx.navigateTo({ url: '/pages/usercenter/messages/messages' });
        break;
      }
      case 'myAdoption': {
        wx.navigateTo({ url: '/pages/usercenter/adoption/index' });
        break;
      }
      case 'exit': {
        this.setData({
          showConfirm: true
        })
      }

      default: {
        break;
      }
    }
  },

  cancel() {
    this.setData({
      showConfirm: false
    })
  },

  confirm() {
    this.setData({
      showConfirm: false
    })
    wx.clearStorageSync();  //清除缓存
    this.getTabBar().updateActive(0);
    wx.reLaunch({
      url: '/pages/login/login',
    })
  }
});
