Component({
  externalClasses: ['custom-class'],

  properties: {
    data: {
      type: Object,
      observer(data) {
        if (!data) {
          return;
        }
        this.setData({ tweets: data});
        //console.log(this.data.tweets);
      },
    },
  },

  data: {
    tweets: {},    
  },
  methods: {
    
  },
});
