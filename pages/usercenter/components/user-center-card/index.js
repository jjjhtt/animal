import {config} from '../../../../config/index'

Component({
  properties: {
    userInfo: {
      type: Object,
      value: {},
    },
    avatar: {
      type: String,
      value: '',
      observer(avatar) {
        this.setData({
          avatarUrl: avatar
        })
      }
    }
  },

  data: {
    defaultAvatarUrl:
      'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    avatarUrl: ''
  },
  methods: {
  },
});
