import {config} from '../../config/index'

Component({
  externalClasses: ['wr-class'],
  options: {
    addGlobalClass: true,
  },

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

      wx.navigateTo({
        url: `/pages/helppage/helppage?id=${id}`,
      });
    }
  },
});
