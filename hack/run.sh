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
    docker_killrm
    docker run -d -i --name baiding-web -p 9000:9000 \
        -v baiding-web-node-modules:/root/zaojiu/baiding-web/node_modules \
        -v `pwd`:/root/zaojiu/baiding-web \
        ${image} bash
    [ "${https_proxy}" != "" ] && docker_exec npm config set https-proxy ${https_proxy}
}

function docker_start2(){
    state=`docker inspect -f "{{.State.Status}},{{.State.Running}}" baiding-web`
    [ "${state}" == "running,true" ] && return
    docker_start
}

function docker_exec(){
    docker exec -i baiding-web "${@}"
}

function docker_exect(){
    docker exec -ti baiding-web "${@}"
}

function update_if_pkg_change(){
    is_hash_changed
    [ "$?" != "1" ] && echo "package.json not changed" && return
    echo "package.json has changed"
    docker_exec npm cache clean
    docker_exec npm i || { exit 1; }
    docker_exec npm update || { exit 1; }
    pkg_hash_cache_update
}

function update_force(){
    docker_exec npm cache clean
    docker_exec npm i || { exit 1; }
    docker_exec npm update || { exit 1; }
    pkg_hash_cache_update
}

function pkg_hash_get(){
    if [ ! -f "package.json" ]; then
        return
    fi
    cat package.json|md5sum
}

function pkg_hash_cache_get(){
    docker_exec touch node_modules/package.json.hash
    docker_exec cat node_modules/package.json.hash
}

function pkg_hash_cache_update(){
    hash=`pkg_hash_get`
    docker_exec sh -c "echo '${hash}' > node_modules/package.json.hash"
    echo "package.json hash writed"
}

function is_hash_changed(){
    hash=`pkg_hash_get`
    cache=`pkg_hash_cache_get`
    [ "${hash}" == "${cache}" ] && [ "${cache}" != "" ] && return
    return 1
}

for target in $@; do
    case "${target}" in
        bootstrap.init)
            docker_killrm
            docker build -f hack/env.Dockerfile -t ${image} .
            docker_start
            update_force
            ;;
        bootstrap.update)
            docker_killrm
            docker build -f hack/env.Dockerfile -t ${image} .
            docker_start
            update_if_pkg_change
            ;;
        bootstrap.clean)
            docker_killrm
            docker volume rm baiding-web-node-modules
            docker rmi ${image}
            ;;
        bootstrap.shell)
            docker_start2
            docker_exect bash
            ;;
        bootstrap.kill)
            docker_killrm
            ;;
        build.prod.docker)
            docker_start
            docker_exec npm run build.prod
            ;;
        build.test-prod.docker)
            docker_start
            docker_exec npm run build.test-prod
            ;;
        serve.dev.docker)
            docker_start
            docker_exec npm run serve.dev
            ;;
        serve.prod.docker)
            docker_start
            docker_exec npm run serve.prod
            ;;
        serve.test-prod.docker)
            docker_start
            docker_exec npm run serve.test-prod
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
        build.test-prod)
            rm -rf dist
            clean
            ./node_modules/gulp/bin/gulp.js || { clean; exit 1; }
            ./node_modules/.bin/ngc -p tmp || { clean; exit 1; }
            ./node_modules/.bin/ng build -e test-prod || { clean; exit 1; }
            clean
            ;;
        serve.dev)
            ./node_modules/.bin/ng serve -p 9000 -H 0.0.0.0
            ;;
        serve.prod)
            ./node_modules/static-server/bin/static-server.js -p 9000 ./dist
            ;;
        serve.test-prod)
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
