#!/bin/bash
set -ev

npm run build

if [ "${TRAVIS_TAG}" ]; then
    pushd example
    npm run build
    popd
fi
