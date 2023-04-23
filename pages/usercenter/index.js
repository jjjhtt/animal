import Toast from 'tdesign-miniprogram/toast/index';
import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';

const menuData = [
  [
    {
      title: '个人资料修改',
      tit: '',
      url: '',
      type: 'info',
    },
    {
      title: '我的帖子',
      tit: '',
      url: '',
      type: 'myPosts',
    },
    {
      title: '我的收藏',
      tit: '',
      url: '',
      type: 'myCollections',
    },
    {
      title: '我的消息',
      tit: '',
      url: '',
      type: 'myMessages',
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
    nickName: '未登录',
    number: 20000000,
    phoneNumber: '',
  },
  menuData,
  versionNo: '',
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.getVersionInfo();
  },

  onShow() {
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
        // eslint-disable-next-line no-unused-expressions
        menuData?.[0].forEach((v) => {
        });
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
      case 'myPosts': {
        wx.navigateTo({ url: '/pages/usercenter/my_posts/index' });
        break;
      }
      case 'myCollections': {
        wx.navigateTo({ url: '/pages/usercenter/collections/index' });
        break;
      }
      case 'myMessages': {
        wx.navigateTo({ url: '/pages/usercenter/message/index' });
        break;
      }

      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
