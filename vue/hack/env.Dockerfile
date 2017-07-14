FROM node:8.1.3

RUN npm config set registry http://registry.npm.taobao.org

RUN npm i yarn -g
