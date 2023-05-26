import {config} from '../../../../config/index'

Component({
  properties: {
    userInfo: {
      type: Object,
      value: {},
    },
    avatar: '',
  },

  data: {
    defaultAvatarUrl:
      'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
  },
  methods: {
  },
});
