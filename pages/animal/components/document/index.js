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
        //console.log(this.data.tweets);
      },
    },
  },
  data: {
    document: {},    
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
