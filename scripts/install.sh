#!/bin/bash
set -ev

npm install

if [ "${TRAVIS_TAG}" ]; then
    pushd example
    npm install
    popd
fi
