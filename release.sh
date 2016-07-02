#!/bin/bash

set -e
cd $(readlink -f $(dirname $0))

version=$1

git tag $version

./run-tests.sh
cp -a dist grafana-gnocchi-datasource
tar -czf grafana-gnocchi-datasource-${version}.tar.gz grafana-gnocchi-datasource

rm -rf grafana-gnocchi-datasource
