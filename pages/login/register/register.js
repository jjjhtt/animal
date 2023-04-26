import Toast from 'tdesign-miniprogram/toast/index';
Page({
    data: {
        username: '',
        email: '',
        phone: '',
        pw: '',
        pw2: '',
        errormessage: '',
        ma: '',
    },
    returnlogin: function() {
        wx.redirectTo({ url: '../login', })
    },
    getusername: function(e) {
        this.setData({ username: e.detail.value })
    },
    getemail: function(e) {
        this.setData({ email: e.detail.value })
    },
    getma: function(e) {
      this.setData({ ma: e.detail.value })
    },
    getphone: function(e) {
      this.setData({ phone: e.detail.value })
    },
    getpw: function(e) {
        this.setData({ pw: e.detail.value })
    },
    getpw2: function(e) {
        this.setData({ pw2: e.detail.value })
    },
    requestma: function() {
      self = this
      console.log(this.data.email)
        wx.request({
          url:'http://h7gfkf.natappfree.cc/user/registerRequest',
          //url: 'https://anith2.2022martu1.cn/user/registerRequest',
          data: { email: this.data.email },
          method: 'POST',
          success: function(res) {
            console.log(res)
            if (res.data.code == 0) {
              Toast({
                context: this,
                selector: '#t-toast',
                message: res.data.message,
              });
            } else {
              Toast({
                context: this,
                selector: '#t-toast',
                message: res.data.message,
              });
              self.setData({email:''})
            }
          }
        })
    },
    postregister: function() {
      self = this
      wx.request({
        url: 'https://114.116.203.97/user/registerVerify',
        data: { username: this.data.username,
          password:this.data.pw,
          passwordConfirm: this.data.pw2,
          email: this.data.email,
          phone: this.data.phone,
          verification: this.data.ma },
        method: 'POST',
        success: function(res) {
          console.log(res)
          if (res.data.code == 0) {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '注册成功',
              theme: 'success',
              direction: 'column',
            });
            setTimeout(() => {
              wx.navigateBack()
              }, 2000)
          } else {
            Toast({
              context: this,
              selector: '#t-toast',
              message: res.data.message,
              theme: 'error',
              direction: 'column',
            });
          }
          self.setData({
            username: '',
            email: '',
            phone: '',
            pw: '',
            pw2: '',
            ma: ''
          })
        }
      })
    }
  })
  