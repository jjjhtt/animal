var timer
var DEFAULT_CONFIG = {
  duration: 3000,
  type: 'error' // warn、success、error
}
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    content: String
  },
  data: {
    type: '',
    show: false
  },
  methods: {
    show (content = '', options = {}) {
      // 如果已经有一个计时器在了，就先清理掉
      if (timer) {
        clearTimeout(timer) 
        timer = undefined
      }
      options = Object.assign({}, DEFAULT_CONFIG, options)
      this.setData({
        content: content,
        type: options.type,
        show: true
      })
      timer = setTimeout(() => {
        this.setData({
          show: false
        })
      }, options.duration)
    }
  }
})
