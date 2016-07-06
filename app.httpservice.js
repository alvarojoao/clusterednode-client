'use strict';
(function(app) {
	app.HTTPService = (function() {
		var HTTPService = function(http) {
			this.http = http;
		};
		HTTPService.parameters = [
			ng.http.Http
		];
		HTTPService.prototype.refs = function() {
			return this.http
				.get('reference.json')
				.map(function(response) {
					return response.json() || {
							"l0": [],
							"l1": [],
							"v": []
						};
				})
				.catch();
		};
		HTTPService.prototype.get = function(reqId, url, o, p) {
			return this.http
				.get(url + '?o=' + o + '&p=' + p, {
					"cache":   false,
					"headers": {
						"x-reqid": reqId
					}
				})
				.map(function(response) {
					var is_cached = response.headers.get('x-cache-status') === 'HIT';
					return {
						"json":   response.json() || {},
						"reqId":  parseInt(response.headers.get('x-reqid')),
						"rtt":    parseInt(response.headers.get('x-angular-time')),
						"tsn":    is_cached ? 0.5 : parseFloat(response.headers.get('x-nginx-time') * 1000.0) | 0,
						"exts":   is_cached ? 0 : parseFloat(response.headers.get('x-node-time')),
						"red":    is_cached ? 0 : parseFloat(response.headers.get('x-redis-time')),
						"cached": is_cached
					};
				})
				.catch();
		};
		HTTPService.prototype.post = function(url, body) {
			return this.http
				.post(url + '?time=' + Date.now(), body, {
					"cache":   false,
					"headers": {
						"Cache-Control":     'no-cache, no-store, must-revalidate',
						"If-Modified-Since": 'Mon, 26 Jul 1997 05:00:00 GMT',
						"Pragma":            'no-cache'
					}
				})
				.map(function(response) {
					return response.json() || {};
				})
				.catch();
		};
		return HTTPService;
	})();
})(window.app || (window.app = {}));
