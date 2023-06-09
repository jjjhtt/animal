Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['wr-class'],

  properties: {
    data: {
      type: Object,
      observer(data) {
        if (!data) {
          return;
        }
        this.setData({ tweets: data});
      },
    },
  },

  data: {
    tweets: {},    
  },
  methods: {
    onClick(e) {
      let id = e.currentTarget.dataset.item.id;
      let index = e.currentTarget.dataset.index;

      wx.navigateTo({
        url: `/pages/helppage/helppage?id=${id}&index=${index}`,
      });
    }
  },
});
