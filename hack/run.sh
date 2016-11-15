#!/bin/bash
WEB_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd ${WEB_DIR}/..

function clean(){
    rm -rf tmp
    [ -f angular-cli.tmp.json ] && mv angular-cli.tmp.json angular-cli.json || true
}

image=registry.cn-hangzhou.aliyuncs.com/baiding/web-bootstrap

function docker_killrm(){
    docker rm -f baiding-web
}

function docker_start(){
    state=`docker inspect -f "{{.State.Status}},{{.State.Running}}" baiding-web`
    [ "${state}" == "running,true" ] && return
    docker_killrm
    docker run -d -i --name baiding-web -p 9000:9000 \
        -v baiding-web-node-modules:/root/zaojiu/baiding-web/node_modules \
        -v `pwd`:/root/zaojiu/baiding-web \
        ${image} bash
    [ "${https_proxy}" != "" ] && docker_exec npm config set https-proxy ${https_proxy}
}

function docker_exec(){
    docker exec -i baiding-web ${@}
}

function docker_exect(){
    docker exec -ti baiding-web ${@}
}

for target in $@; do
    case "${target}" in
        bootstrap.init)
            docker_killrm
            docker build -f hack/env.Dockerfile -t ${image} .
            docker_start
            docker_exec npm i
            docker_exec npm update
            ;;
        bootstrap.clean)
            docker_killrm
            docker volume rm baiding-web-node-modules
            docker rmi ${image}
            ;;
        bootstrap.shell)
            docker_start
            docker_exect bash
            ;;
        bootstrap.kill)
            docker_killrm
            ;;
        build.prod.docker)
            docker_start
            docker_exec npm run build.prod
            ;;
        serve.dev.docker)
            docker_start
            docker_exec npm run serve.dev
            ;;
        serve.prod.docker)
            docker_start
            docker_exec npm run serve.prod
            ;;
        test.docker)
            docker_start
            docker_exec npm run test
            ;;
        build.prod)
            rm -rf dist
            clean
            ./node_modules/gulp/bin/gulp.js || { clean; exit 1; }
            ./node_modules/.bin/ngc -p tmp || { clean; exit 1; }
            ./node_modules/.bin/ng build --prod || { clean; exit 1; }
            clean
            ;;
        serve.dev)
            ./node_modules/.bin/ng serve -p 9000 -H 0.0.0.0
            ;;
        serve.prod)
            ./hack/run.sh build.prod || { exit 1; }
            ./node_modules/static-server/bin/static-server.js -p 9000 ./dist
            ;;
        test)
            ./node_modules/.bin/ng test --log-level=debug
            ;;
        clean)
            rm -rf tmp dist
            ;;
        *)
            echo "no action ${target}"
            ;;
    esac
done
