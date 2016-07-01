///<reference path="../typings/index.d.ts" />

export class GnocchiDatasourceQueryCtrl  {
  static templateUrl = 'partials/query.editor.html';
  aggregators: any;
  queryModes: any;
  target: any;
  panelCtrl: any;
  panel: any;
  datasource: any;

  constructor(public $scope, private $injector, private $rootScope, private $timeout, private uiSegmentSrv) {
    this.panel = this.panelCtrl.panel;
    this.$scope = $scope;

    // TODO(sileht): Allows custom
    this.aggregators = ['mean', 'sum', 'min', 'max',
        'std', 'median', 'first', 'last', 'count'].concat(
        _.range(1, 100).map(function (i) { return i + "pct"; }));
    this.queryModes = [
        {text: 'Measurements of a metric of multiple resources', value: 'resource_search'},
        {text: 'Aggregated measurements of a metric across resources', value: 'resource_aggregation'},
        {text: 'Measurements of a metric of a resource', value: 'resource'},
        {text: 'Measurements of a metric', value: 'metric'}
    ];

    if (!this.target.refId) {
        this.target.refId = this.getNextQueryLetter();
    }

    // default
    if (!this.target.aggregator) {
        this.target.aggregator = 'mean' ;
    }
    if (!this.target.queryMode) {
        this.target.queryMode = "resource_search";
    }

    this.target.validQuery = false;
    this.target.queryError = 'No query';
    this.queryUpdated();
  }
  suggestResourceIDs(query, callback) {
    this.datasource
      .performSuggestQuery(query, 'resources', this.target)
      .then(callback);
  }

  queryUpdated() {
    this.target.queryError = this.datasource.validateTarget(this.target, false);
    this.target.validQuery = !this.target.queryError;
    this.refresh();
  }

  suggestMetricIDs(query, callback) {
    this.datasource
      .performSuggestQuery(query, 'metrics', this.target)
      .then(callback);
  }

  suggestMetricNames(query, callback) {
    this.datasource
      .performSuggestQuery(query, 'metric_names', this.target)
      .then(callback);
  }

  /*
  toggleQueryMode() {
    var mode = [
      "resource_search", "resource_aggregation",
      "resource", "metric",
    ];
    var index = mode.indexOf($scope.target.queryMode) + 1;
    if (index === mode.length) {
      index = 0;
    }
    $scope.target.queryMode = mode[index];
  }
  */

  // QueryCTRL stuffs
  getNextQueryLetter() {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return _.find(letters, refId => {
      return _.every(this.panel.targets, function(other: any) {
        return other.refId !== refId;
      });
    });
  }

  refresh(){
    this.panelCtrl.refresh();
  }
}
