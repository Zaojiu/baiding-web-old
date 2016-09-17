# 白丁项目Web前端

* 项目由 [angular2-seed](https://github.com/mgechev/angular2-seed) 搭建

## 克隆仓库：
```bash
git clone git@github.com:Zaojiu/baiding-web.git
```

## npm初始化
```bash
npm install
```

## typings初始化
```bash
typings install
```

## 运行
运行dev环境：
```bash
npm run serve.dev
```

运行prod环境 (不会watch,使用angular2 AOT模式,用于线上部署)：
```bash
npm run serve.prod.exp
```

查看页面：

[微信开发者工具](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1455784140&token=&lang=zh_CN) 打开 [http://0.0.0.0:9000](http://0.0.0.0:9000) or [http://localhost:9000](http://localhost:9000)

## 文件结构
angular2采用component形式组织项目文件，每个componet有自己的css(less)、js(ts)、html。每个module拥有自己的route、service、provider、model、enums、unit/e2e testing等。
```
baiding-web/
├── README.md
├── appveyor.yml
├── dist                                     # 编译后的代码
├── gulpfile.ts                              # gulp主文件
├── karma.conf.js                            # karma配置
├── package.json
├── protractor.conf.js                       # angular e2e 测试配置
├── src                                      # 源码
│   └── client
│       ├── app
│       │   ├── app.component.html
│       │   ├── app.component.ts
│       │   ├── app.config.ts
│       │   ├── app.model.ts
│       │   ├── app.module.ts
│       │   ├── app.routes.ts
│       │   ├── live-list
│       │   ├── live-room
│       │   ├── main-prod.ts                 # prod模式主ts入口文件
│       │   ├── main.ts                      # dev模式主ts入口文件
│       │   ├── notfound
│       │   ├── shared                       # 共享组件
│       │   ├── system-config.ts
│       │   └── vendor.ts                    # 第三方package入口文件
│       ├── assets
│       │   ├── data.json
│       │   ├── icon                         # iconfont文件夹,放svg
│       │   └── img                          # 图片文件夹
│       ├── css                              # 全局css文件夹
│       │   ├── _icons.template.css          # iconfont模板
│       │   ├── _utils.scss
│       │   └── main.scss                    
│       ├── index.html
│       ├── manual_typings                   # 自定义ts定义文件
│       │   ├── fastclick
│       │   └── moment-countdown
│       ├── tsconfig.json
│       └── typings.d.ts
├── test-config.js
├── test-main.js
├── tools                                      # gulp配置
├── tsconfig.json                              # ts编译配置
├── tslint.json                                # tsline配置
├── typings                                    # ts定义文件
└── typings.json                               # typings配置文件
```

# angular2编码规范
采用angluar2的各种编码规范，包括其对typescript的各种命名规范的扩展。请仔细阅读 [本官方规范](https://angular.cn/docs/ts/latest/guide/style-guide.html#!#03-03) 并遵守之。

# css&html编码规范
ruby系的人最喜欢的就是规范，例如 [这份sass规范](https://sass-guidelin.es/) 。
另外，这是 [一份来自google的编码建议](https://google.github.io/styleguide/htmlcssguide.xml)，[或者这份](http://codeguide.bootcss.com/)。
好的编码规范都是英雄所见略同，除了到底是敲tab还是space之外。
