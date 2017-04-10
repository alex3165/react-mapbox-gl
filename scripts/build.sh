#!/bin/bash
set -ev

npm run build

if [ "${TRAVIS_TAG}" ]; then
    pushd example
    unset CI
    npm run build
    popd
fi
