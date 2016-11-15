var rekuire		= require('rekuire'),
	config		= rekuire('config'),
	http		= require('http'),
	https		= require('https'),
	uuid 		= require('node-uuid'),
	obfuscate 	= rekuire('obfuscate'),
	traverse 	= require('traverse'),
	_ 			= require("lodash");

var API_version = 'v1';

class Connection {
	contructor(cb) {
		var context = {};
		context = {
			host: config.apiEndpoint.host,
			scheme: config.apiEndpoint.scheme,
			port: config.apiEndpoint.port,
			apiKeyId: config.apiKeyId,
			secretApiKey: config.secretApiKey
		}
		context.httpOptions = {
				host: config.apiEndpoint.host,
				protocol: config.apiEndpoint.scheme + ':',
				method: null,
				port: config.apiEndpoint.port,
				headers: {
					'Content-Type': 'application/json'
				}
			}

		context.API_VERSION = API_version;
		context.enableLogging = true;
		console.log("connection Class")
		this.setContext(context);
		cb(this);
	}

	setContext(context) {
		this.context = context;
	}

	getContext() {
		return this.context;
	}
}

module.exports = Connection;