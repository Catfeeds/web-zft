#! /bin/bash

IMAGE_VERSION=${1:-latest}
REPO=registry.cn-hangzhou.aliyuncs.com/em_test/web-zft
docker pull $REPO:$IMAGE_VERSION

function start () {
  docker rm -f web
  docker rmi $(docker images -qf "before=$REPO:$IMAGE_VERSION" -f=reference="$REPO:v*")
  docker run -d -e ZFT_BACKEND_PROXY -p 80:80 --net=zft --name=web $REPO:$IMAGE_VERSION
}
function test_deploy() {
  docker rm -f test_deploy
  docker run -d --name test_deploy -p 8080:80 --net=zft $REPO:$IMAGE_VERSION
}
function test_curl() {
  response=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:8080)
  if [[ $response == "200" ]]; then
    docker rm -f test_deploy;
  else
    exit 1;
  fi
}

test_deploy

sleep 3

test_curl && start