Component({
  options: {
    addGlobalClass: true,
  },

  externalClasses: ['custom-class'],

  properties: {
    data: {
      type: Object,
      observer(data) {
        if (!data) {
          return;
        }
        this.setData({ tweets: data});
        
        for (let i = 0;i < this.data.tweets.length; i++) {
          console.log(this.data.tweets[i])
        }
        console.log(this.data.tweets);
      },
    },
  },

  data: {
    tweets: {},    
  },
  methods: {
    onClick(e) {
      let id = e.currentTarget.dataset.item.id;

      wx.navigateTo({
        url: `/pages/helppage/helppage?id=${id}`,
      });
    }
  },
});
