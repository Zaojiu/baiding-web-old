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

## 安装后端
后端需要安装golang，mongo，mysql，redis等工具，mongo，mysql推荐使用brew安装，launchrocket进行管理。

`brew install mongo`

`brew install mysql`

`brew install redis`

`brew cask install launchrocket`
