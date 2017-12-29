#!/bin/bash

NODE_IMAGE="node:9.2.0"

host_port=9000
docker_port=9000

function docker_killrm(){
    docker rm -f baiding-web-vue
}

function docker_bash(){
    docker_killrm
    docker run -it --name baiding-web-vue -p $host_port:$docker_port -v `pwd`:/baiding-web-vue -w /baiding-web-vue \
        $NODE_IMAGE /bin/bash
}

function docker_dev(){
    docker_killrm
    docker run -it --name baiding-web-vue -p $host_port:$docker_port -v `pwd`:/baiding-web-vue -w /baiding-web-vue \
        $NODE_IMAGE /bin/bash -c "NODE_ENV=development ./node_modules/.bin/webpack-dev-server --progress"
}

function docker_init(){
    childCommand="npm install --verbose"
    proxy=""

    if [[ $3 == "source" && $4 != "" ]]; then
        childCommand="npm config set registry $4 && npm install --verbose"
    fi

    command="docker pull $NODE_IMAGE && rm -rf node_modules package-lock.json yarn.lock && docker run -it --name baiding-web-vue -p $host_port:$docker_port -v `pwd`:/baiding-web-vue -w /baiding-web-vue \
                      $NODE_IMAGE /bin/bash -c \"$childCommand\""
    docker_killrm
    eval $command
}

function docker_prod(){
    docker_killrm
    docker run -it --name baiding-web-vue -p $host_port:$docker_port -v `pwd`:/baiding-web-vue -w /baiding-web-vue \
        $NODE_IMAGE /bin/bash -c "NODE_ENV=production ./node_modules/.bin/webpack-dev-server --progress"
}

function docker_build(){
    docker_killrm
    docker run -it --name baiding-web-vue -p $host_port:$docker_port -v `pwd`:/baiding-web-vue -w /baiding-web-vue \
        $NODE_IMAGE /bin/bash -c "rm -rf package-lock.json yarn.lock && npm install --verbose && rm -rf dist && NODE_ENV=production ./node_modules/.bin/webpack --progress --hide-modules --display-optimization-bailout"
}

for target in $@; do
    case "${target}" in
        docker.dev)
            docker_dev
            ;;
        docker.prod)
            docker_prod
            ;;
        docker.build)
            docker_build
            ;;
        docker.bash)
            docker_bash
            ;;
        docker.init)
            docker_init $2 $3 $4 $5
            ;;
    esac
done
