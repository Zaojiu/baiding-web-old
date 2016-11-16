FROM node:7.1
ADD hack/files/debian.jessie.conf /etc/apt/sources.list
ADD hack/files/localtime /etc/localtime
WORKDIR /root/zaojiu/baiding-web

RUN apt-get update && \
  apt-get install -y vim curl httpie

RUN npm config set registry https://registry.npm.taobao.org
RUN ln -s /root/zaojiu/baiding-web/node_modules/typings/dist/bin.js /usr/local/bin/typings
