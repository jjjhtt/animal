// pages/usercenter/message/message.js
import {config} from '../../../config/index'
import Toast from 'tdesign-miniprogram/toast/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirmBtn: { content: '确定', variant: 'base' },
    showConfirm: false,
    labaSrc: "../../../images/laba2.png",
    msgList: [
    ],
    popover: null,
    index: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    wx.request({
      url: config.domain + '/user/message/get',
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
          console.log(res);
          var tempList = []
          if(res.data.body != null && res.data.body.length > 0) {
            for(var i = 0; i < res.data.body.length; i++) {
              var item = res.data.body[i]
              var info = item.content.length <= 16 ? 
                item.content :  item.content.substring(0,15) + '...'
              item['info'] = info
              item['index'] = i
              tempList.push(item)
            }
            this.setData({
              msgList: tempList
            })
          }
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
    }),
    this.setData({
      popover: this.selectComponent('#popover')
    })
  },
  cancel: function(e) {
    this.data.popover.onHide();
  },
  delete: function(e) {
    console.log(this.data.msgList[this.data.index].id)
    // this.data.popover.onHide();
    wx.request({
      url: config.domain + '/user/message/delete',
      method: 'POST',
      data: {
        "messageId": this.data.msgList[this.data.index].id
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success: (res)=> {
        if (res.data.code === 0) {
          this.data.msgList.splice(this.data.index, 1)
          this.setData({
            msgList: this.data.msgList
          })
          Toast({
            context: this,
            selector: '#t-toast',
            message: '删除成功',
            theme: 'success',
          });
          this.setData({showConfirm: false });
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
  onLongPressMessage: function(e) {
    console.log(e)
    var currentTarget = e.currentTarget
    var {index} = currentTarget.dataset
    this.setData({
      index: index,
      showConfirm: true
    })
    // var mh = this.selectComponent('#cell0').app.globalData.navBarHeight
    // + this.selectComponent('#cell0').app.globalData.menuHeight
    // console.log(mh)
    // var position = {
    //   width: wx.getSystemInfoSync().windowWidth,
    //   height: 80,
    //   top: 40,
    //   left: 0,
    //   right: wx.getSystemInfoSync().windowWidth,
    //   bottom: mh * index + mh / 2,
    //   id: 'cell' + index
    // }
    // this.data.popover.onDisplay(position);
  },
  closeDialog() {
    this.setData({showConfirm: false });
  },
  onClickMessage({currentTarget}) {
    var {index} = currentTarget.dataset
    var content = this.data.msgList[index].content
    var time = this.data.msgList[index].time
    var id = this.data.msgList[index].id
    wx.request({
      url: config.domain + '/user/message/setRead',
      method: 'POST',
      data: {
        "messageId": id
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success: (res)=> {
        if (res.data.code === 0) {
          console.log(res);
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
    wx.navigateTo({
      url: '/pages/usercenter/messages/message/message?content='
      + content + '&time=' + time,
    })
  }

})