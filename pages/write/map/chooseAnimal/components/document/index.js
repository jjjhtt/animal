Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    category: {
      type: Object,
      observer(category) {
        if (!category) {
          return;
        }
        this.setData({
          document: category
        });
        //console.log(category)
      },
    },
  },
  data: {
    document: {},  
    domain: "https://anith2.2022martu1.cn",  
  },
  methods: {
    onClick(e) {
      let id = e.currentTarget.dataset.item.id;
      let name = e.currentTarget.dataset.item.name;
      var pages = getCurrentPages(); //当前页面
      var beforePage = pages[pages.length - 2]; //前一页
      beforePage.setData({
        animalName: name,
        animalID: id,
      });
      wx.navigateBack({
        delta: 1
      });
    }
  },
});
