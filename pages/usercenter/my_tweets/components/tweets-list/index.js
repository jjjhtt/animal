import {config} from '../../../../../config/index'
import Toast from 'tdesign-miniprogram/toast/index';
Component({
  externalClasses: ['wr-class'],

  properties: {
    tweetsList: {
      type: Array,
      value: [],
    },
    id: -1,
    index: -1
  },

  data: {
    confirmBtn: { content: '确定', variant: 'base' },
    showConfirm: false,
  },

  lifetimes: {
    ready() {
      this.init();
    },
  },

  methods: {
    onClicktweets(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('click', { ...e.detail, index });
    },

    onClicktweetsThumb(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('thumb', { ...e.detail, index });
    },

    delete: function(e) {
      let that = this
      wx.request({
        url: config.domain + '/tweet/delete',
        method: 'POST',
        data: {
          "userId": wx.getStorageSync('userId'),
          "tweetId": this.properties.id
        },
        header: {
          'content-type': 'application/json', // 默认值
          'authorization': wx.getStorageSync('token')
        },
        success: (res)=> {
          if (res.data.code === 0) {
            //console.log(res);
            //that.properties.tweetsList.splice(that.properties.index, 1)
            //console.log(that.properties.tweetsList)
            this.setData({showConfirm: false });
            Toast({
              context: this,
              selector: '#t-toast',
              message: '删除成功',
              theme: 'success',
            });
          } else {
            console.log(res);
            Toast({
              context: this,
              selector: '#t-toast',
              message: res.message,
              theme: 'error',
            });
          }
        },
        fail: (res)=> {
          console.log(res)
        }
      })
    },

    onLongPress: function(e) {
      console.log(e)
      var currentTarget = e.currentTarget
      var {index} = currentTarget.dataset
      var {id} = currentTarget.dataset
      this.setData({
        id: id,
        index: index,
        showConfirm: true
      })
    },

    closeDialog() {
      this.setData({showConfirm: false });
    },

    init() {

    },
  },
});
