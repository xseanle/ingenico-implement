var rekuire				= require("rekuire"),
	config				= rekuire("config"),
	createRequest		= rekuire("createRequest"),
	paymentBody			= rekuire("samplePayment"),
	approveBody			= rekuire("sampleCapture");

//var context = connect.getContext();
var	postMethod		= 'POST',
	getMethod		= 'GET',
	paymentPath		= '/v1/' + config.merchantId + '/payments/';

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

	setParams(params){
		this.params = params;
	}

	getParams() {
		return this.params;
	}
}

module.exports = payment;