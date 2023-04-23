//在这个js中专门创建Store的实例对象,引入要使用的初始化方法
import {
  action,
  observable
} from 'mobx-miniprogram'

//创建Store对象并导出
export const store = observable({
  //在此处填写共享的数据
  active: 0,
  menulist: [{
      "pagePath": "pages/home/home",
      "text": "首页",
      "iconPath": "../image/home.png",
      "selectedIconPath": "../image/home_blue.png"
    },
    {
      "pagePath": "pages/animal/index",
      "text": "动物",
      "iconPath": "../image/animal.png",
      "selectedIconPath": "../image/animal_blue.png"
    },
    {
      "pagePath": "pages/write/index",
      "iconPath": "../image/add_blue.png",
    },
    {
      "pagePath": "pages/help/index",
      "text": "求助",
      "iconPath": "../image/help.png",
      "selectedIconPath": "../image/help_blue.png"
    },
    {
      "pagePath": "pages/usercenter/index",
      "text": "我的",
      "iconPath": "../image/person.png",
      "selectedIconPath": "../image/person_blue.png"
    }
  ],
  //action 方法，用来修改store中的数据
  updateActive: action(function (step) {
    this.active = step
    return this.active
  })
})
