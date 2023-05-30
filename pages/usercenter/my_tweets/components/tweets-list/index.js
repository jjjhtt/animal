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
      var list = this.properties.tweetsList;
      list.splice(this.properties.index, 1)
      this.setData({
        tweetsList: list
      })
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
            var pages = getCurrentPages();
            var page = pages[pages.length - 1];
            page.setData({showConfirm: false });
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

    onLongPress: function(e) {
      //console.log(e)
      var currentTarget = e.currentTarget
      var {index} = currentTarget.dataset
      var {id} = currentTarget.dataset
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      //console.log(page)
      this.setData({
        id: id,
        index: index,
      })
      page.setData({
        showConfirm: true
      })
    },

    init() {

    },
  },
});
