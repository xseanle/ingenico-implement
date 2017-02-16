var rekuire				= require("rekuire"),
	config				= rekuire("config"),
	createRequest		= rekuire("createRequest"),
	paymentBody			= rekuire("samplePayment"),
	approveBody			= rekuire("sampleCapture"),
	realtimeBody		= rekuire("sampleRealtime"),
	hostedBody			= rekuire("sampleHost");

//var context = connect.getContext();
var	postMethod		= 'POST',
	getMethod		= 'GET',
	paymentPath		= '/v1/' + config.merchantId + '/payments/',
	sessionBody		= {
		"tokens": [
				"126166b16ed04b3ab85fb06da1d7a167",
                "226166b16ed04b3ab85fb06da1d7a167",
                "122c5b4d-dd40-49f0-b7c9-3594212167a9",
                "326166b16ed04b3ab85fb06da1d7a167",
                "426166b16ed04b3ab85fb06da1d7a167"
			]
	};

class payment {
	constructor() {
		
	}

	createPayment(paymentContext, cb) {
		var dict = {
			method: postMethod,
			path: paymentPath,
			body: paymentBody,
			context: paymentContext,
			cb: cb
		}

		// dict.context.idemPotence = {
		// 	key: 'idempotence'
		// };

		var buildRequest = new createRequest(dict, function(self){
			this.setParams(self.getResponseBody());
			cb(this);
		}.bind(this));

	}

	getPayment(paymentId, paymentContext, cb) {
		var dict = {
			method: getMethod,
			path: paymentPath + paymentId,
			body: null,
			context: paymentContext,
			cb:cb
		}

		var buildRequest = new createRequest(dict, function(self){
			this.setParams(self.getResponseBody());
			cb(this);
		}.bind(this));
	}

	approvePayment(paymentId, paymentContext, cb) {
		var dict = {
			method: postMethod,
			path: paymentPath + paymentId + '/approve/',
			body: approveBody,
			context: paymentContext,
			cb: cb
		}

		var buildRequest = new createRequest(dict, function(self){
			this.setParams(self.getResponseBody());
			cb(this);
		}.bind(this));
	}

	tokenizePayment(paymentId, paymentContext, cb) {
		var tbody = {
		  "alias": "Somes alias"
		};
		var dict = {
			method: postMethod,
			path: paymentPath + paymentId + '/tokenize/',
			body: tbody,
			cb: cb
		}

		var buildRequest = new createRequest(dict, function(self){
			this.setParams(self.getResponseBody());
			cb(this);
		}.bind(this));
	}

	hostedCheckout(paymentContext, cb) {
		var dict = {
			method: postMethod,
			path: '/v1/' + config.merchantId + '/hostedcheckouts/',
			body: hostedBody,
			cb: cb
		}

		var buildRequest = new createRequest(dict, function(self){
			this.setParams(self.getResponseBody());
			cb(this);
		}.bind(this));
	}

	realtimeBanking(paymentContext, cb) {
		var dict = {
			method: postMethod,
			path: paymentPath,
			body: realtimeBody,
			cb:cb
		}

		var buildRequest = new createRequest(dict, function(self){
			this.setParams(self.getResponseBody());
			cb(this);
		}.bind(this))
	}
	
	createSession(paymentContext, cb) {
		var dict = {
			method: postMethod,
			path: '/v1/' + config.merchantId + '/sessions/',
			body: sessionBody,
			cb: cb
		}
		
		var buildRequest = new createRequest(dict, function(self){
			this.setParams(self.getResponseBody());
			cb(this);
		}.bind(this));
	}

	setParams(params){
		this.params = params;
	}

	getParams() {
		return this.params;
	}
}

module.exports = payment;