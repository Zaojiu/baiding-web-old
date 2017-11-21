#!/bin/bash

function docker_killrm(){
    docker rm -f baiding-web-vue
}

function docker_bash(){
    docker_killrm
    docker run -it --name baiding-web-vue -p 9000:9000 -v `pwd`:/baiding-web-vue -w /baiding-web-vue \
        297951292/node-with-yarn:latest /bin/bash
}

function docker_dev(){
    docker_killrm
    docker run -it --name baiding-web-vue -p 9000:9000 -v `pwd`:/baiding-web-vue -w /baiding-web-vue \
        297951292/node-with-yarn:latest /bin/bash -c "NODE_ENV=development ./node_modules/.bin/webpack-dev-server --progress"
}

function docker_install(){
    childCommand="npm install"
    proxy=""

    if [[ $3 == "source" && $4 != "" ]]; then
        childCommand="npm config set registry $4 && npm install"
    fi

    command="docker run -it --name baiding-web-vue -p 9000:9000 -v `pwd`:/baiding-web-vue -w /baiding-web-vue \
                      297951292/node-with-yarn:latest /bin/bash -c \"$childCommand\""
    docker_killrm
    eval $command
}

function docker_prod(){
    docker_killrm
    docker run -it --name baiding-web-vue -p 9000:9000 -v `pwd`:/baiding-web-vue -w /baiding-web-vue \
        297951292/node-with-yarn:latest /bin/bash -c "NODE_ENV=production ./node_modules/.bin/webpack-dev-server --progress"
}

function docker_build(){
    docker_killrm
    docker run -it --name baiding-web-vue -p 9000:9000 -v `pwd`:/baiding-web-vue -w /baiding-web-vue \
        297951292/node-with-yarn:latest /bin/bash -c "yarn install --verbose && rm -rf dist && NODE_ENV=production ./node_modules/.bin/webpack --progress --hide-modules --display-optimization-bailout"
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
        docker.install)
            docker_install $2 $3 $4 $5
            ;;
    esac
done
