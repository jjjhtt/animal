import Toast from 'tdesign-miniprogram/toast/index';
import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';

const menuData = [
  [
    {
      title: '个人资料修改',
      type: 'info',
    },
    {
      title: '我的帖子',
      type: 'myTweets',
    },
    {
      title: '我的收藏',
      type: 'myCollections',
    },
    {
      title: '我的求助',
      type: 'myHelp',
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
  versionNo: 'alpha',
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
  },

  fetUseriInfoHandle() {
    fetchUserCenter().then(
      res => {
        menuData?.[0].forEach((v) => {
        });
        console.log(res);
        this.setData({
          userInfo: res,
          menuData,
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
      case 'exit': {
        wx.clearStorageSync();
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }, 500)
      }

      default: {
        break;
      }
    }
  },
});
