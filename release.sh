#!/bin/bash

set -e
cd $(readlink -f $(dirname $0))

version=$1

./run-tests.sh

git tag $version

cp -a dist grafana-gnocchi-datasource
tar -czf grafana-gnocchi-datasource-${version}.tar.gz grafana-gnocchi-datasource

git push --tags

rm -rf grafana-gnocchi-datasource
