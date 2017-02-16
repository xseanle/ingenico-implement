var rekuire				= require("rekuire"),
	validate			= require('jsonschema').validate,
	paymentBody			= rekuire("samplePayment"),
	approveBody			= rekuire("sampleCapture"),
	requestPayment 		= rekuire("CreatePaymentRequest"),
	requestApproval		= rekuire("ApprovePaymentRequest");

class setInformation {
	constructor(requestObject, cb) {
		paymentBody.cardPaymentMethodSpecificInput.card.cardholderName = requestObject["cardName"];
		paymentBody.cardPaymentMethodSpecificInput.card.cardNumber = requestObject["cardNumber"];
		paymentBody.cardPaymentMethodSpecificInput.card.cvv = requestObject["cardCVV"];
		paymentBody.cardPaymentMethodSpecificInput.card.expiryDate = requestObject.expiryMonth + requestObject.expiryYear;
		//this.validateInfo(paymentBody);
		//this.validateInfo(approveBody);
		cb();
	}

	validateInfo(data) {
		var checkinfo;
		if (data == paymentBody) {
			checkinfo = validate(data, requestPayment);
		} else if (data == approveBody) {
			checkinfo = validate(data, requestApproval);
		}
		if (!checkinfo.valid) {
			console.log(checkinfo.errors);
			throw new Error(checkinfo.errors);
		}
	}


}

module.exports = setInformation;