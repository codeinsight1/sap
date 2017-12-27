jQuery.sap.declare("salesmapAPF1d2.model.stubbedMethods");
salesmapAPF1d2.model.stubbedMethods = function(oTokenForServices) {
	var fnStub = function() {
		// ajax stubing for xscrf token
		var fnOriginalAjax = jQuery.ajax;
		function ajaxStubbed(oConfig) {
			var fnOriginalSuccess = oConfig.success;
			var oXMLHttpRequest = {};
			var tmp = [];
			oXMLHttpRequest.getResponseHeader = function(arg) {
				if (arg === "x-sap-login-page") {
					return null;
				}
				return arg;
			};
			
			/*if (oConfig.type === "HEAD" && oConfig.url.search("annotation.xml") !== -1) {
				tmp = {};
				fnOriginalSuccess(tmp, "success", undefined);
			} else */
			
			if (oConfig.url === oTokenForServices.sAppOdataPath || oConfig.url === oTokenForServices.sPersistencyOdataPath || oConfig.url === oTokenForServices.sSmartBusinessOdataPath) {
				fnOriginalSuccess(tmp, "success", oXMLHttpRequest);
			} else {
				return fnOriginalAjax(oConfig);
			}
		}
		this.stubJqueryAjax = sinon.stub(jQuery, "ajax", ajaxStubbed);
		// sjax stubbing for annotation.xml
		var fnOriginalSjax = jQuery.sap.sjax;
		function sjaxStubbed(oConfig) {
			/*if (oConfig.url.search("annotation.xml") !== -1) {
				var sAnnotationXmlPath = jQuery.sap.getModulePath('salesmapAPF1d2') + "/model/metadata/annotation.xml";
				oConfig.url = sAnnotationXmlPath;
			}*/
			return fnOriginalSjax(oConfig);
		}
		this.stubJquerySjax = sinon.stub(jQuery.sap, "sjax", sjaxStubbed);
	};
	var fnRestore = function() {
		this.stubJquerySjax.restore();
		this.stubJqueryAjax.restore();
	};
	return {
		fnStub : fnStub,
		fnRestore : fnRestore
	};
};
