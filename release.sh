#!/bin/bash

set -e

cd $(readlink -f $(dirname $0))

inc_version() { echo $1 | gawk -F"." '{$NF+=1}{print $0RT}' OFS="." ORS="" ;}
get_version() { sed -n 's/.*"version": "\([^"]*\)".*/\1/gp' $1 ; }
error() { echo $1 ; exit 1 ; }

version=$(git tag | tail -1)
version=$(inc_version $version)

# Sanity checks
[ ! "$GITHUB_TOKEN" ] && error "GITHUB_TOKEN is missing"
[ "$(get_version plugin.json)" != "$version" ] && error "plugin.json incorrect version"
[ "$(get_version package.json)" != "$version" ] && error "package.json incorrect version"
status=$(git status -sz)                                                                                                                
[ -z "$status" ] || error "Repo is not clean"

echo "Building version $version"

./run-tests.sh

echo
echo "release: ${version} ? "
echo

read 

git add -f dist/*
git commit -m "Release version $version" dist/

cp -a dist sileht-gnocchi-datasource
tar -czf sileht-gnocchi-datasource-${version}.tar.gz sileht-gnocchi-datasource

git tag $version -m "Release version $version"
git push
git push --tags

nextversion=$(inc_version $version)
sed -i 's/"version": "'$version'"/"version": "'$nextversion'"/' plugin.json package.json
git commit -m "Bump version $nextversion" plugin.json package.json 
git push

github-release release -u sileht -r grafana-gnocchi-datasource --tag $version --description "Release $version for Grafana 3.x"
github-release upload  -u sileht -r grafana-gnocchi-datasource --tag $version --name sileht-gnocchi-datasource-${version}.tar.gz --file sileht-gnocchi-datasource-${version}.tar.gz

rm -rf sileht-gnocchi-datasource*
