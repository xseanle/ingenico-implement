var _					= require('lodash'),
	rekuire				= require('rekuire'),
	crypto				= require('crypto'),
	dateformat			= require('dateformat'),
	http				= require('http'),
	https				= require('https'),
	uuid 				= require('node-uuid'),
	obfuscate 			= rekuire('obfuscate'),
	config				= rekuire('config'),
	_ 					= require("lodash");

class createRequest {
	constructor(dict, cb) {
		this.context = {};
		this.context = {
			host: config.apiEndpoint.host,
			scheme: config.apiEndpoint.scheme,
			port: config.apiEndpoint.port,
			apiKeyId: config.apiKeyId,
			secretApiKey: config.secretApiKey
		}
		this.context.httpOptions = {
				host: config.apiEndpoint.host,
				protocol: config.apiEndpoint.scheme + ':',
				method: null,
				port: config.apiEndpoint.port,
				headers: {
					'Content-Type': 'application/json'
				}
			}

		this.context.enableLogging = true;

		var path = dict.path;
		var body = dict.body;
		
		var headers = {
			'Content-Type': 'application/json',
			Date: dateformat('UTC:ddd, dd mmm yyyy HH:MM:ss') + ' UTC'
		}

		var options			= _.merge({}, this.context.httpOptions),
			extraHeaders	= [];
			options.path 	= dict.path;
			options.headers = headers;
			options.method 	= dict.method;

		//if present, set the idempotence request
		if (dict.context && dict.context.idemPotence) {
			var idemPotenceKey = dict.context.idemPotence.key;
			var idemPotenceHeader = {
				key: "X-GCS-Idempotence-Key",
				value: idemPotenceKey
			}
			options.headers[idemPotenceHeader.key] = idemPotenceHeader.value;
			extraHeaders.push(idemPotenceHeader);
		}

		//set server meta info
		var serverMetaInfo = {
			key: "X-GCS-ServerMetaInfo",
			value: {
				'sdkCreator': 'Ingenico',
				'sdkIdentifier': 'Ingenico Implementation',
				'platformIdentifier': process.env['OS'] + ' Node.js/' + process.versions.node
			}
		}
		serverMetaInfo.value = new Buffer(JSON.stringify(serverMetaInfo.value)).toString("base64");
		options.headers[serverMetaInfo.key] = serverMetaInfo.value;
		extraHeaders.push(serverMetaInfo);

		options.headers["Authorization"] = 'GCS v1HMAC:' + this.context.apiKeyId + ':' + this.getSignature(this.context.secretApiKey, dict.method, 'application/json', options.headers.Date, extraHeaders, options.path);
		
		this.send(options, dict.body, function(error, response){
			if (error) {
				console.log(error);
			} else {
				if (response.headers["x-gcs-idempotence-request-timestamp"]) {
					this.setIdempotenceRequestTimestamp(response.headers["x-gcs-idempotence-request-timestamp"]);
				}
				this.setResponseBody(response.body);
				cb(this);
			}
		}.bind(this));
	}

	//crypto to build authentication found on api references
	getSignature(SApiKey, method, contentType, date, gcsHeaders, path) {
		return crypto.createHmac("SHA256", SApiKey).update(method + "\n" + contentType + "\n" + date + "\n" + this.getSortedHeader(gcsHeaders) + path + "\n").digest('base64');
	}

	//sorts headers to follow format on api references
	getSortedHeader(gcsHeaders) {
		var headers = '';
		if (gcsHeaders) {
			var sortedXGCSHeaders = [];
			_.forEach(gcsHeaders, function(header) {
				if (header.key.toUpperCase().indexOf("X-GCS") === 0) {
					sortedXGCSHeaders.push(header);
				}
			});
			sortedXGCSHeaders = sortedXGCSHeaders.sort(function(a,b) {
				a.key = a.key.toUpperCase();
				b.key = b.key.toUpperCase();
				if (a.key < b.key) {
					return -1;
				} else if (a.key > b.key) {
					return 1;
				} else {
					return 0;
				}
			});
			_.forEach(sortedXGCSHeaders, function(header) {
				headers += header.key.toLowerCase() + ":" + header.value + "\n";
			});
		}
		return headers;
	}

	//send request to server
	send(options, postData, cb) {
		var uuidString = uuid.v4();
		var h = options.protocol === 'https:' ? https : http;
		var req = h.request(options, function (res) {
			var body = '';
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				console.log('Response from Message ID: ' + uuidString + "\n" + "status: " + res.statusCode + "\n" + "headers: " + obfuscate.getObfuscated(res.headers, this.context) + "\n" + "body: " + obfuscate.getObfuscated(body, this.context));
				cb(null, {
					status: res.statusCode,
					body: body,
					headers: res.headers
				});
			});
		});
		req.on('error', function(e) {
			console.log('Error for Message ID:' + uuidString + ", error: " + JSON.stringify(e));
			cb(e, null);
		});
		if (postData) {
			req.write(JSON.stringify(postData));
		}
		req.end();
	}

	//set response to use elsewhere
	setResponseBody(response) {
		this.ingenicoresponse = JSON.parse(response);
	}

	getResponseBody() {
		return this.ingenicoresponse;
	}

	setIdempotenceRequestTimestamp(ts) {
		this.idempotenceRequestStamp = ts;
		console.log("idempotence timestamp: " + this.idempotenceRequestStamp);
	}

	getIdempotenceRequestTimestamp() {
		return this.idempotenceRequestStamp;
	}
}

module.exports = createRequest;