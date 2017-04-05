#!/bin/bash
set -ev

npm install --ignore-scripts

if [ "${TRAVIS_TAG}" ]; then
    pushd example
    npm install
    popd
fi
