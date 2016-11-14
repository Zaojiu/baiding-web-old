# 初始化

* 安装依赖: `npm i`
* 运行开发环境前端: `npm run serve.dev`
* 运行线上环境前端: `npm run serve.prod`

# 开发配置

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