///<reference path="../../typings/index.d.ts" />

import {Datasource} from "../module";
import {QueryCtrl} from "../module";
import BackendSrvMock from "./mocks/backendsrv";
import TemplateSrvMock from "./mocks/templatesrv";
import * as moment from "moment";
import * as angular from "angular";

describe('GnocchiQueryCtrl', function() {
  var ds = null;
  var $q = null;
  var $httpBackend = null;
  var backendSrv = null;
  var templateSrv = null;
  var results = null;
  var $rootScope = null;

  /*
  beforeEach(angular.module('grafana.core'));
  beforeEach(angular.module('grafana.controllers'));
  beforeEach(angular.module('grafana.services'));
  beforeEach(createControllerPhase('GnocchiQueryCtrl'));
  beforeEach(serv_createService('GnocchiDatasource'));
  */

  beforeEach(angular.mock.inject(function($injector) {
    $q = $injector.get("$q");
    $httpBackend = $injector.get('$httpBackend');
    backendSrv = new BackendSrvMock($injector.get('$http'));
    templateSrv = new TemplateSrvMock();
    ds = new Datasource({url: [''], jsonData: {token: 'XXXXXXXXXXXXX'} },
                         $q, backendSrv, templateSrv);

    $rootScope.target = {};
//    $rootScope.get_data = sinon.spy();
    $rootScope.datasource = ds;
    /*queryCtrl = new DatasourceQueryCtrl($scope, $
      constructor(public $scope, private $injector, private $rootScope, private $timeout, private uiSegmentSrv) {
      */
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  var resources = [
    {
      "created_by_project_id": "8a722a26-e0a0-4993-b283-76925b7b02de",
      "created_by_user_id": "5587ebf3-58a5-42eb-8024-ef756e09a552",
      "ended_at": null,
      "id": "cba8d3d5-d5e1-4692-bcfe-d77feaf01d7e",
      "metrics": {
        "temperature": "86adbe6c-22d7-4a86-9ab7-e8d112f6cb79",
        "cpu_util": "ccdd3d2c-7f83-42a0-9280-49e0791349dd"
      },
      "project_id": "bd3a1e52-1c62-44cb-bf04-660bd88cd74d",
      "revision_end": null,
      "revision_start": "2015-09-10T08:00:25.690667+00:00",
      "started_at": "2015-09-10T08:00:25.690654+00:00",
      "type": "generic",
      "user_id": "bd3a1e52-1c62-44cb-bf04-660bd88cd74d"
    },
    {
      "created_by_project_id": "8a722a26-e0a0-4993-b283-76925b7b02de",
      "created_by_user_id": "5587ebf3-58a5-42eb-8024-ef756e09a552",
      "ended_at": null,
      "id": "9b4f6da9-4e67-4cfd-83bd-fb4b8bcc8dd8",
      "metrics": {},
      "project_id": "bd3a1e52-1c62-44cb-bf04-660bd88cd74d",
      "revision_end": null,
      "revision_start": "2015-09-10T08:00:25.690667+00:00",
      "started_at": "2015-09-10T08:00:25.690654+00:00",
      "type": "generic",
      "user_id": "bd3a1e52-1c62-44cb-bf04-660bd88cd74d"
    },
  ];

  var metrics = [
    {
      "id": "b8c73d22-d944-47d9-9d84-1e7f618c25e1",
      "archive_policy": {},  // shouldn't be empty be too big and useless for test
      "created_by_project_id": "8a722a26-e0a0-4993-b283-76925b7b02de",
      "created_by_user_id": "5587ebf3-58a5-42eb-8024-ef756e09a552",
      "name": "temperature",
      "resource_id": "cba8d3d5-d5e1-4692-bcfe-d77feaf01d7e"
    },
    {
      "id": "86adbe6c-22d7-4a86-9ab7-e8d112f6cb79",
      "archive_policy": {},  // shouldn't be empty be too big and useless for test
      "created_by_project_id": "8a722a26-e0a0-4993-b283-76925b7b02de",
      "created_by_user_id": "5587ebf3-58a5-42eb-8024-ef756e09a552",
      "name": "cpu_util",
      "resource_id": "cba8d3d5-d5e1-4692-bcfe-d77feaf01d7e"
    }
  ];

  describe('basic', function() {
    it('target toggle', function() {
      $rootScope.init();
      expect($rootScope.target.queryMode).to.be('resource_search');
      $rootScope.toggleQueryMode();
      expect($rootScope.target.queryMode).to.be('resource_aggregation');
      $rootScope.toggleQueryMode();
      expect($rootScope.target.queryMode).to.be('resource');
      $rootScope.toggleQueryMode();
      expect($rootScope.target.queryMode).to.be('metric');
      $rootScope.toggleQueryMode();
      expect($rootScope.target.queryMode).to.be('resource_search');
    });
  });

  describe('suggestMetricIDs', function() {
    var results;
    beforeEach(function() {
      $httpBackend.expect('GET', "/v1/metric").respond(metrics);
      $rootScope.suggestMetricIDs("foobar", function(data) { results = data ; });
      $httpBackend.flush();
    });

    it('should return metric ids', function() {
      expect(results.length).to.be(2);
      expect(results[0]).to.be('b8c73d22-d944-47d9-9d84-1e7f618c25e1');
      expect(results[1]).to.be('86adbe6c-22d7-4a86-9ab7-e8d112f6cb79');
    });
  });

  describe('suggestResourceIDs', function() {
    var results;
    beforeEach(function() {
      $httpBackend.expect('GET', "/v1/resource/generic").respond(resources);
      $rootScope.suggestResourceIDs("foobar", function(data) { results = data ; });
      $httpBackend.flush();
    });

    it('should return resource ids', function() {
      expect(results.length).to.be(2);
      expect(results[0]).to.be('cba8d3d5-d5e1-4692-bcfe-d77feaf01d7e');
      expect(results[1]).to.be('9b4f6da9-4e67-4cfd-83bd-fb4b8bcc8dd8');
    });
  });

  describe('suggestMetricNames', function() {
    var results;
    beforeEach(function() {
      $rootScope.target = {'resource_id': 'cba8d3d5-d5e1-4692-bcfe-d77feaf01d7e', 'queryMode': 'resource'};
      $httpBackend.expect('GET', "/v1/resource/generic/cba8d3d5-d5e1-4692-bcfe-d77feaf01d7e").respond(resources[0]);
      $rootScope.suggestMetricNames("foobar", function(data) { results = data ; });
      $httpBackend.flush();
    });

    it('should return resource ids', function() {
      expect(results.length).to.be(2);
      expect(results[0]).to.be('temperature');
      expect(results[1]).to.be('cpu_util');
    });
  });

  describe('validate query success', function() {
    beforeEach(function() {
      $rootScope.target = {'resource_query': '{"=": {"id": "foobar"}}',
                          'queryMode': 'resource_search', 'metric_name': 'cpu_util'};
      $httpBackend.expect('POST', "/v1/search/resource/generic").respond([]);
      $httpBackend.expect('POST', "/v1/search/resource/generic").respond([]);
      $rootScope.init();
      $rootScope.targetBlur();
      $httpBackend.flush();
    });
    it('no target error', function() {
      expect($rootScope.target.error).to.be(undefined);
    });
  });

  describe('validate query missing field', function() {
    it('resource', function() {
      $rootScope.target = {'resource_id': '', 'queryMode': 'resource', 'metric_name': ''};
      $rootScope.init();
      expect($rootScope.target.error).to.be("Missing or invalid fields: Resource ID, Metric name");
      $rootScope.target.error = null;
      $rootScope.targetBlur();
      expect($rootScope.target.error).to.be("Missing or invalid fields: Resource ID, Metric name");
    });

    it('metric', function() {
      $rootScope.target = {'metric_id': '', 'queryMode': 'metric'};
      $rootScope.init();
      expect($rootScope.target.error).to.be("Missing or invalid fields: Metric ID");
      $rootScope.target.error = null;
      $rootScope.targetBlur();
      expect($rootScope.target.error).to.be("Missing or invalid fields: Metric ID");
    });

    it('resource_search', function() {
      $rootScope.target = {'resource_search': '', 'queryMode': 'resource_search', 'metric_name': ''};
      $rootScope.init();
      expect($rootScope.target.error).to.be("Missing or invalid fields: Query, Metric name");
      $rootScope.target.error = null;
      $rootScope.targetBlur();
      expect($rootScope.target.error).to.be("Missing or invalid fields: Query, Metric name");
    });
  });

});
;
