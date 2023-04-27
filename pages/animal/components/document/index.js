Component({
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
      wx.navigateTo({
        url: `/pages/realanimal/realanimal?id=${id}`,
      });
    }
  },
});
