///<reference path="../../../typings/index.d.ts" />



export default class BackendSrvMock {
    constructor(private $http) {
    }

    datasourceRequest(options) {
      var self = this;
      options.retry = options.retry || 0;
      var firstAttempt = options.retry === 0;
      console.log("******* REQ DATASOURCE ********");
      console.log(options);

      return self.$http(options).then(function(data){
          console.log("**** RESULT ********");
          console.log(data);
          return data;
      }, function(err) {
        //populate error obj on Internal Error
        if (_.isString(err.data) && err.status === 500) {
          err.data = {
            error: err.statusText
          };
        }

        // for Prometheus
        if (!err.data.message && _.isString(err.data.error)) {
          err.data.message = err.data.error;
        }

        throw err;
      });
    }
}
