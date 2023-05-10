const app = getApp()
Component({
    properties: {
        defaultData: {
            type: Object,
            value: {
                img: '',
                name: ''
            },
            observer(defaultData) {
              if (!defaultData) {
                return;
              }
              this.setData({ img: defaultData.img, name: defaultData.name});
            },
        }
    },
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuTop: app.globalData.menuTop,
        menuHeight: app.globalData.menuHeight,
        name: '',
        img: ''
    },
    attached: function() {},
    methods: {
      onIconTap() {
        console.log()
        wx.navigateBack()
      }
    }
})
