FROM node:7.1
ADD hack/files/debian.jessie.conf /etc/apt/sources.list
ADD hack/files/localtime /etc/localtime
WORKDIR /root/zaojiu/baiding-web

RUN apt-get update && \
  apt-get install -y vim curl httpie

RUN wget -q https://npm.taobao.org/mirrors/phantomjs/phantomjs-2.1.1-linux-x86_64.tar.bz2 && \
  tar xjf phantomjs-2.1.1-linux-x86_64.tar.bz2 && \
  install -t /usr/local/bin phantomjs-2.1.1-linux-x86_64/bin/phantomjs && \
  rm -rf phantomjs-2.1.1-linux-x86_64*
ENV PHANTOMJS_BIN=/usr/local/bin/phantomjs

RUN npm config set registry http://registry.npm.taobao.org
RUN ln -s /root/zaojiu/baiding-web/node_modules/typings/dist/bin.js /usr/local/bin/typings
