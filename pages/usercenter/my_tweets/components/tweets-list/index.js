import {config} from '../../../../../config/index'
import Toast from 'tdesign-miniprogram/toast/index';
Component({
  externalClasses: ['wr-class'],

  properties: {
    tweetsList: {
      type: Array,
      value: [],
    },
    popover: null,
    id: -1,
    index: -1
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

    cancel: function(e) {
      this.data.popover.onHide();
    },

    delete: function(e) {
      this.data.popover.onHide();
      console.log(this.properties.id)
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
            console.log(res);
            that.properties.tweetsList.splice(that.properties.index, 1)
            console.log(that.properties.tweetsList)
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
        index: index
      })
      if (index % 2 == 0) {
        var position = {
          width: wx.getSystemInfoSync().windowWidth/2,
          height: 80,
          top: 170,
          left: 0,
          right: wx.getSystemInfoSync().windowWidth,
        }
      } else {
        var position = {
          width: wx.getSystemInfoSync().windowWidth*3/2,
          height: 80,
          top: 170,
          left: 0,
          right: wx.getSystemInfoSync().windowWidth,
        }
      }
      this.data.popover.onDisplay(position);
    },

    init() {
      this.setData({
        popover: this.selectComponent('#popover')
      })
    },


  },
});
