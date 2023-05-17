import {config} from "../../../config/index"
import Toast from 'tdesign-miniprogram/toast/index';

const ctr = require('./controller.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: {
      color: '#1890FF',
      tabColor: '#333' || '#20ACAB',
    },
    navH: 0,
    title: "",
    content: "",
    images: [],
    showAdd: false,
    albumName: '',
    checked: false,
    state: "",
    show: false,
    showID: "",
    inputValue: "",
    label: [],
    obtnArry: [],
    imageUrls: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ctr.setup(this);
    this.setData({
      navH: app.globalData.navHeight
    });
  },
  onUnload: function () {
    ctr.onUnload()
  },

  bindTitle: function(e) {
    this.setData({title: e.detail.value})
  },
  bindContent: function(e) {
    this.setData({content: e.detail.value})
  },
  writerPublish: function() {
    if (this.data.title == 0) {
      Toast({
        context: this,
        message: "请添加标题",
      });
      return;
    }
    if (this.data.content == 0) {
      Toast({
        context: this,
        message: "请添加帖子内容",
      });
      return;
    }
    if (this.data.imageUrls == 0) {
      Toast({
        context: this,
        message: "请至少添加一张图片",
      });
      return;
    }
    let that = this
    wx.request({
      url: config.domain + '/tweet/create',
      data: {
        "userId": wx.getStorageSync('userId'),
        "title": this.data.title,
        "content": this.data.content,
        "images": this.data.imageUrls,
        "tags": this.data.obtnArry
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': wx.getStorageSync('token')
      },
      success(res) {
        console.log(that.data.obtnArry);
        if (res.data.code === 0) {
          Toast({
            context: this,
            message: "发帖成功",
          });
          setTimeout(() => {
            //wx.redirectTo({url:'../realpage/realpage'  })//删
            wx.navigateBack({
              delta: 1,
              success: (res) => {},
              fail: (res) => {},
              complete: (res) => {},
            })
          }, 1000)
        } else {
          console.log(res)
          Toast({
            context: this,
            message: res.data.message,
            theme: 'error',
          });
        }
      },
      fail(err) {
        Toast({
          context: this,
          message: "发帖失败",
        });
        console.log(err)
      }
    });
  },
  chooseImage: ctr.onChooseImage,
  clickImage: ctr.onClickImage,
  clickDelete: ctr.onDeleteImage,
  clickDeleteLabel: ctr.onDeleteLabel,

//同步输入框内容
  bindKeyInput(e) {
      this.setData({
        albumName: e.detail.value
      })
  },

  addinput(e){
    this.setData({ 
      show: true,
    });
  },
 
//实时获取输入框的值
  bindValue(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
//确定按钮，添加数组达到添加标签的作用
  onInputValue(){
    this.setData({ 
      show: false ,
      inputValue: this.data.inputValue
    });
    var obtnArry = this.data.obtnArry;
    var newData = this.data.inputValue;
    obtnArry.push(newData);//实质是添加lists数组内容，使for循环多一次
    this.setData({
      obtnArry,
    })
    //console.log(this.data.inputValue)
  },
//取消按钮
  onCancel(){
    this.setData({ show: false });
  }
})