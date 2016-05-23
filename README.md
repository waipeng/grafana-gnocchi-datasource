Grafana Gnocchi datasource 
==========================

Gnocchi datasource for Grafana 3.x

Installation via grafana.net
============================

    sudo grafana-cli plugins install grafana-gnocchi-datasource

Installation from sources
=========================

    npm install
    npm install -g grunt-cli
    grunt

    ln -s dist /var/lib/grafana/plugins/grafana-gnocchi-datasource
    # or
    cp -a dist /var/lib/grafana/plugins/grafana-gnocchi-datasource


Implemented
===========

* Getting measures of a metric with the metric_id
* Getting measures of multiple resources with a search query and a metric name
* Getting measures of metric with the resource id and the metric name
* Getting measures from a cross aggregation query
* Listing resources id for template query.

Not yet implemented
===================


Current Limitation
==================

Grafana doesn’t allow to query two different servers when using the proxy mode,
so we are not able to query Keystone for a token and then query gnocchi.

In proxymode, we need to set a token and the Gnocchi URL on the datasource.

In direct mode, we can use login/password and the Keystone URL.
Note that CORS MUST be enabled on Keystone and Gnocchi servers.

License
=======

APACHE LICENSE Version 2.0, January 2004
