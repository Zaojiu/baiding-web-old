# 使用

## 命令

### 直接运行

* `npm i`：安装依赖
* `npm run serve.dev`：运行开发环境
* `npm run serve.prod`：运行线上环境
* `npm run test`：运行测试

### 容器环境运行

`npm run <command>`

* `npm run bootstrap.init`：初始化（强制运行 install / update）
* `npm run bootstrap.update`：初始化（依据 package.json 来决定是否运行 install / update）
* `npm run bootstrap.clean`：清理所有容器生成的内容
* `npm run bootstrap.shell`：登录运行中的容器
* `npm run bootstrap.kill`：停止容器
* `npm run build.prod.docker`：编译 prod 文件
* `npm run serve.dev.docker`：运行开发环境
* `npm run serve.prod.docker`：运行线上环境
* `npm run test.docker`：运行测试

ps：如果没有安装 `node/npm` 那么也可以使用 `./hack/run.sh <command>` 直接执行

## 环境配置

* environment.ts: 入库，默认配置。
* environment.dev.ts: 不入库，开发配置，开发自己本地维护。
* environment.prod.ts: 入库，线上配置，key和id只用渲染变量，线上docker运行时替换为真实值。

# 如何引入第三方库

首先, 需要评估第三方库, 包括以下方面:

* 体积: 移动端应用, js体积敏感, 50k-100k可接受, 50k以下为佳。
* 依赖: 第三方库如果有依赖, 需要查看依赖的稳定性, 有无严重的缺陷。
* 第三方库自身情况:
  - 有无定义文件(.d.ts, 一般去 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 找)
  - 多少star
  - 社区支持如何
  - 有无严重缺陷
  - 最近更新日期是什么时候
* 安装方式:
  - 能否通过npm安装, 这个最方便。
  - 不行的话, 最少可以github引入。
  - 实在不行, 自己起个repo, 写个package.json进行安装。

如果通过以上评估, 觉得可以引入, 那么:

* npm i xxx --save
* npm i @types/xxx --save-dev (定义文件)
* 在 angular-cli.json 的 scripts 中引入 or 如果不是全局库, 不能独立打包运行, 那么在用到的地方import
* 如果没有定义文件, 那么需要在用的地方定义, declare var xxx: any;
* 或者, 在 `/baiding-web/manual_typings` 下, 手写定义文件。

# 前端代码验收checklist

1. 检查文案是否正确，是否有错别字。
2. 检查业务逻辑，交互，设计，排版是否符合设计稿。（文字颜色，字号，块间距，行距，图标大小，极限情况下溢出，多行文本显示）
3. 检查代码逻辑，状态切换，角色切换，逻辑分支，极限情况。
4. 权限设置，是否正确，是否观众、主持人、嘉宾可访问、可见。
5. 入口、链接，是否能正确跳转。
6. 如有表单，检查表单项验证逻辑。是否必填，必填为空，提交是否可通过（正向）。非必填项置空，提交是否可通过（反向）。
   
以上测试，需要同时在ios、安卓、pc端同时进行。避免js、css、html兼容性问题。

# 发布构建HACK

zone.js包里面的geolocation在微信里面不兼容，需要注释掉

```bash
➜  zone.js git:(dev) grep -n patchPrototype **/*.js
dist/zone.js:811:function patchPrototype(prototype, fnNames) {
dist/zone.js:1602:    // patchPrototype(_global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
```

angular 构建时需要修复
```
➜  models git:(dev) ✗ grep 'url=false' **/*.js
webpack-build-common.js:                { test: /\.font\.(js|json)$/, loader: "style!css?url=false!fontgen" }
```

以上修改需要同步到docker里面，比如
```
docker cp node_modules/angular-cli/models/webpack-build-common.js <docker id>:/root/zaojiu/baiding-web/node_modules/angular-cli/models/
```
