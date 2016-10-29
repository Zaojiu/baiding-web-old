#!/bin/bash

set -ev

npm i
npm run test
npm run build.prod
