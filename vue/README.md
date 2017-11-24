# baiding-web-vue

> 白丁新版前端项目库，使用vue+ts，依赖等文件请参考package.json。

## 安装前端

``` bash
# install docker
vue项目构建依赖docker，查阅 https://www.docker.com ，安装完成后，命令行运行docker --help，检查是否安装成功。

# install dependencies
npm run init

安装失败，可能是网络不行，需要代理翻墙。

npm run init -- proxy http://shadowsocks ip:port source https://registry.npmjs.org/

# serve dev mode with hot reload at localhost:9000
npm run dev

# serve prod mode with hot reload at localhost:9000
npm run prod

# build for production
npm run build
```

## 配置前端

前端配置在 `zaojiu/baiding-web/vue/src/env/` 中，`environment.ts` 是默认的配置，`environment.production.ts`是线上配置，其中只有一些字符串占位符，如果需要增加新配置，请在`environment.production.ts`中加入一个配置，使用 `_REPL_xxx` 来占位，并且把 `_REPL_xxx` 及其真实的值通知后端同学配上。

可以加入一个`environment.dev.ts`，来加入开发配置，`environment.dev.ts`会被忽略，不入库。

## 目录结构

```
├── README.md
├── hack
│   └── run.sh 启动脚本
├── manual_typings 手动添加的typescript对其他库的声明文件
│   ├── fastclick
│   │   ├── index.d.ts
│   │   └── package.json
│   ├── moment
│   │   ├── index.d.ts
│   │   └── package.json
│   └── setprototypeof
│       ├── index.d.ts
│       └── package.json
├── package.json
├── src
│   ├── assets public文件
│   │   ├── favicon.ico
│   │   ├── icon 图标svg，新图标加入目录后，<i class="bi-图标文件名"></i> 来使用
│   │   ├── img
│   │   └── wxpay.html
│   ├── components
│   │   ├── app.comp.vue 主组件
│   │   ├── columns 专栏
│   │   ├── error 通用错误处理页面
│   │   ├── event 活动购票
│   │   ├── lives 直播
│   │   ├── member 会员
│   │   ├── my 个人中心
│   │   ├── notfound 通用404页面
│   │   ├── order 下单
│   │   ├── signin 登录
│   │   └── talks 文章
│   ├── css
│   │   ├── _article.scss
│   │   ├── _avatar.scss
│   │   ├── _button.scss
│   │   ├── _clickable-block.scss
│   │   ├── _form.scss
│   │   ├── _hack.scss
│   │   ├── _utils.scss
│   │   └── _variables.scss sass变量
│   ├── env 配置
│   │   ├── environment.production.ts 线上配置
│   │   ├── environment.dev.ts 开发配置 
│   │   └── environment.ts 默认配置
│   ├── hooks.ts 全局钩子，使用appendBeforeEachHook、appendAfterEachHook来给路由添加全局钩子，这里面加的函数，在每个页面跳转时都会被运行。
│   ├── index.html 主html
│   ├── main.ts 主入口
│   ├── router.ts 主路由
│   ├── shared
│   │   ├── api api文件夹，请把api及其model添加在此
│   │   │   ├── code-map.enum.ts
│   │   │   ├── column.api.ts
│   │   │   ├── column.model.ts
│   │   │   ├── event.api.ts
│   │   │   ├── event.model.ts
│   │   │   ├── lives.api.ts
│   │   │   ├── lives.model.ts
│   │   │   ├── member.api.ts
│   │   │   ├── member.model.ts
│   │   │   ├── order.api.ts
│   │   │   ├── order.model.ts
│   │   │   ├── pay.api.ts
│   │   │   ├── pay.enum.ts
│   │   │   ├── sms.api.ts
│   │   │   ├── speaker.model.ts
│   │   │   ├── talk.api.ts
│   │   │   ├── talk.model.ts
│   │   │   ├── ticket.api.ts
│   │   │   ├── ticket.model.ts
│   │   │   ├── upload.api.ts
│   │   │   ├── upload.model.ts
│   │   │   ├── user.api.ts
│   │   │   ├── user.model.ts
│   │   │   ├── video.model.ts
│   │   │   └── xhr.ts http请求对象的封面，里面会拦截错误，做一些默认tips或者跳转登录等操作
│   │   ├── app-download-tips.comp.vue
│   │   ├── audio-bar.comp.vue
│   │   ├── bd-loading.comp.vue
│   │   ├── circle-loading.comp.vue
│   │   ├── count-down.comp.vue
│   │   ├── error.comp.vue
│   │   ├── form
│   │   │   ├── autosize.directive.ts 给textarea添加此directive可以让textarea高度自适应文字。
│   │   │   ├── focus-first-invalid.directive.ts 给form添加让form出错时自动focus出错的输入框
│   │   │   ├── focus.directive.ts
│   │   │   ├── has-value.directive.ts
│   │   │   └── index.ts
│   │   ├── guard
│   │   │   ├── member-activate-comp.guard.ts
│   │   │   ├── mobile-binded-comp.guard.ts
│   │   │   ├── mobile-binded.guard.ts
│   │   │   ├── route-task.ts 路由任务，在进入路由前，执行某些任务，可以是guard（守卫，angular2的概念，做路由权限检查），可以是resolver（同样是angular2概念，在进入路由前获取数据注入组件）
│   │   │   ├── signin-comp.guard.ts
│   │   │   └── user-auth.guard.ts
│   │   ├── icons.font.js svg转iconfont的文件，在webpack中使用，具体参见[webfonts-loader](https://www.npmjs.com/package/webfonts-loader)
│   │   ├── live-cover.comp.vue
│   │   ├── live-intro.comp.vue
│   │   ├── modal.comp.vue
│   │   ├── payment.comp.vue 支付遮罩提示组件
│   │   ├── qrcode.comp.vue
│   │   ├── resolver
│   │   │   └── live-info.resolver.ts
│   │   ├── scroll-view
│   │   │   └── scroll-view.directive.ts
│   │   ├── share-popup.comp.vue
│   │   ├── tool-tips.comp.vue
│   │   ├── top-nav.comp.vue
│   │   └── utils
│   │       ├── analytics.ts
│   │       ├── auth.ts 鉴权核心文件
│   │       ├── ios.ts 与ios通信的核心文件
│   │       ├── polyfill.ts polyfill文件，对浏览器做兼容的，具体可以google polyfill和ponyfill是干嘛的
│   │       ├── promise-polyfill.ts
│   │       ├── setPrototypeOf-polyfill.ts
│   │       ├── share.ts 设置app和微信分享
│   │       ├── store.ts 内存和localstorage封装
│   │       ├── title.ts 设置页面标题
│   │       ├── utils.ts 各种通用工具函数
│   │       ├── wechat.ts 微信初始化文件
│   │       └── weinre.ts 远程调试工具，用来在ios微信中作调试，可在配置文件中的host.weinre配上你的weinre client地址，然后页面地址后加上?debug=weinre开启调试。[weinre教程](https://github.com/nupthale/weinre)
│   ├── store vuex文件夹
│   │   ├── index.ts 
│   │   ├── modal.ts 全局弹窗
│   │   ├── payment.ts 全局支付提示弹窗
│   │   ├── qrcode.ts 全局二维码弹窗
│   │   ├── share.ts 全局分享二维码弹窗
│   │   ├── tip.ts 全局底部小tips
│   │   └── user.ts 本来想做来存储全局用户信息，但后面感觉不好，废弃，请使用api中的getUserInfo及getUserInfoCache
│   └── vue-shims.d.ts
├── tsconfig.json
├── webpack-shims.d.ts
└── webpack.config.js

```

## 前端构建

目前前端构建使用webpack作为构建器，其中做了代码分离，js压缩、postcss和css压缩等。具体参见 `zaojiu/baiding-web/vue/webpack.config.js`。

其中thirdPartyLibs数组，是全局共用第三方库，适合放jquery、momentjs、lodash等这些第三方工具。


```
entry: {
	'global': thirdPartyLibs,
	'libs': ...,
	'shared': sharedFiles,
	'main': './src/main.ts',
},
```
global，暴露在全局(window)的第三方库。

libs，非暴露在全局(window)的第三方库，通过ts的import引入，为了避免代码里面多次引入，所以抽离在一个文件中，复用一个文件，也利于缓存。

shared，用于vue项目内的共享组件、api等，理由同上，他们单独打包在shared.js中。

main，主入口，执行app mount操作。

组件文件，现在全部使用lazy load，按需加载，具体可以查看 `zaojiu/baiding-web/vue/src/router.ts`。

## 前端单测

vue项目目前没有跑单测，后面如果有需要，可以使用 [ava](https://github.com/avajs/ava) 等单测工具去测试。

## 安装后端
在本地搭建后端服务，需要安装golang，mongo，mysql，redis等工具，mongo，mysql推荐使用brew安装，launchrocket进行管理。

`brew install mongo`

`brew install mysql`

`brew install redis`

`brew cask install launchrocket`

## 配置后端服务

后端服务的配置文件，里面有各种域名的配置，数据库地址配置等。在zaojiu/baiding-server/hack/conf/中，如果需要添加开发配置，请复制各个.ini文件，并加上前缀.dev.ini。

## 安装完成后，需要运行四个基础后端服务。

启动nginx，负责api请求分发，export BAIDING_NGINX_DOMAIN=zaojiu.tv，设置nginx代理zaojiu.tv这个域名。

`cd zaojiu/baiding-server`

`export BAIDING_NGINX_DOMAIN=zaojiu.tv`

`make nginx`

---

使用charles或者修改/etc/hosts文件，把io.zaojiu.tv/auth.zaojiu.tv/www.zaojiu.tv三个域名指向127.0.0.1，由上一步的nginx去代理分发到前端或者后端服务。

---

另起一个窗口，启动accountd服务，用于对应api域名auth.zaojiu.com。

`cd zaojiu/baiding-server`

`make accountd`

---

另起一个窗口，启动lived服务，用于对应api域名io.zaojiu.com。

`cd zaojiu/baiding-server`

`make lived`

---

另起一个窗口，启动wechatd服务，用于微信签名等。

`cd zaojiu/baiding-server`

`make wechatd`

## 其他技术要点

### 支付

### 与IOS通信

### 微信js-sdk操作