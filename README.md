# 白丁项目Web前端

* 项目由 [angular2-weboack-starter](https://github.com/angularclass/angular2-webpack-starter) 搭建

## 克隆仓库：
```bash
git clone git@github.com:Zaojiu/baiding-web.git
```

## 初始化
```bash
npm install
```

## 运行
运行 server：
```bash
npm start
```

使用 Webpack HMR 启动：
```bash
npm run server:dev:hmr
```

查看页面：

浏览器打开 [http://0.0.0.0:3000](http://0.0.0.0:3000) or [http://localhost:3000](http://localhost:3000)

## 文件结构
angular2采用component形式组织项目文件，每个componet有自己的css(less)、js(ts)、html。每个module拥有自己的route、service、provider、model、enums、unit/e2e testing等。
```
baiding-web/
 ├──config/                    * webpack配置等
 |   ├──helpers.js             * helper functions for our configuration files
 |   ├──spec-bundle.js         * ignore this magic that sets up our angular 2 testing environment
 |   ├──karma.conf.js          * karma config for our unit tests
 |   ├──protractor.conf.js     * protractor config for our end-to-end tests
 │   ├──webpack.dev.js         * our development webpack config
 │   ├──webpack.prod.js        * our production webpack config
 │   └──webpack.test.js        * our testing webpack config
 │
 ├──src/                       * 源码
 |   ├──main.browser.ts        * 浏览器主入口（此文件加载./app/app.component.ts进行app初始化）
 │   │
 |   ├──index.html             * 主页
 │   │
 |   ├──polyfills.ts           * 退化方案主文件，所有需要退化的polyfill都在此引入
 │   │
 |   ├──vendor.ts              * 第三方文件，所有第三方库都在此引入
 │   │
 │   ├──app/                   * app文件夹
 │   |   ├──shared             * shared文件夹，用于存放公共component，任何使用两次以上的component建议存放于此
 │   |   ├──sub-components     * 其余子组件文件夹
 │   |   ├──app.module.ts      * app主模块定义文件，其他子模块在此引入
 │   |   ├──app.route.ts       * app根路由文件，此文件不存放任何子路由，只存放一个空地址重定向到app主页面
 │   |   ├──app.resolver.ts    * 用于向某路由注入特定数据
 │   |   ├──app.service.ts     * 获取Webpack HMR时任意Object的信息
 │   │   └──app.component.ts   * app主入口，此组件不存放任何东西，只提供一个route-outlet作为子component加载器
 │   │
 │   └──assets/                * 静态资源
 │       ├──icon/              * 图标
 │       ├──img/               * 图片
 │       ├──mock-data/         * 用于测试的伪数据
 │       ├──robots.txt         * for search engines to crawl your website
 │       └──humans.txt         * for humans to know who the developers are
 │
 │
 ├──tslint.json                * typescript lint config
 ├──typedoc.json               * typescript documentation generator
 ├──tsconfig.json              * config that webpack uses for typescript
 ├──package.json               * what npm uses to manage it's dependencies
 └──webpack.config.js          * webpack main configuration file

```

# angular2编码规范
采用angluar2的各种编码规范，包括其对typescript的各种命名规范的扩展。请仔细阅读 [本官方规范](https://angular.cn/docs/ts/latest/guide/style-guide.html#!#03-03) 并遵守之。

# css&html编码规范
ruby系的人最喜欢的就是规范，例如 [这份sass规范](https://sass-guidelin.es/) 。
另外，这是 [一份来自google的编码建议](https://google.github.io/styleguide/htmlcssguide.xml)，[或者这份](http://codeguide.bootcss.com/)。
好的编码规范都是英雄所见略同，除了到底是敲tab还是space之外。

# 定义types
[点此查阅]https://github.com/AngularClass/angular2-webpack-starter#types