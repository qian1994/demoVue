// 创建vue对象
function Dep() {
}

Dep.prototype.init = function() {

}

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;

function Vue(option) {
    // 参数接受
    this.$option = option || {}
    this.$data = option.data

    this.$render = option.render || function() {}
    // 对象的获取
    if (!option.el) {
        return
    }
    this.root = option.el
    this.rootEle = document.querySelector(option.el)
    this.init()
    this.render()
}

// 初始化vue 添加监听器
Vue.prototype.init = function() {
    for (let key in this.$data) {
        defineReactive(this, key, this.$data[key])
    }
}

Vue.prototype.render = function() {
    let res = this.$render()
    const div = new Parse(res);
    this.template(div)
}

function defineReactive(obj, key, value) {
    const property = Object.getOwnPropertyDescriptor(obj, key)
    const getter = property && property.get
    const setter = property && property.set
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            const val = getter ? getter.call(obj) : value
            return val
        },
        set: function(newValue) {
            if (value == newValue) {
                return
            }
            value = newValue
            this.render()
        }
    })
}


Vue.prototype.template = function(data, currentParent) {
    let elE = currentParent
    if(data.type == 1) {
        elE = document.createElement(data.tag)
    } else if(data.type == 2) {
        const key = data.text.replace("{{", '').replace("}}", '')
        const value = this[key]
        const node = document.createTextNode(value)
        currentParent.appendChild(node)
    }
    const childrenLength = data.children ? data.children.length : 0
    if(!childrenLength) {
        this.rootEle.innerHTML = ''
        this.rootEle.appendChild(elE)
        return
    }

    for(let i = 0; i < childrenLength; i++) {
        this.template(data.children[i], elE)
    }
}
