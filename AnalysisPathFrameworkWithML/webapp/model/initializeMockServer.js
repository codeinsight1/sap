/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("salesmapAPF1d2.model.initializeMockServer");
jQuery.sap.require("sap.ui.core.util.MockServer");
/**
* @class initializeMockServer
* @memberOf salesmapAPF1d2.model
* @name initializeMockServer
* @description initialize all mock server request to mock the data request from local file path
*/
salesmapAPF1d2.model.initializeMockServer = (function() {
	var restoreApplicationMethods;
	var initializeMockServer = function() {
		var sApplicationPath = jQuery.sap.getModulePath('salesmapAPF1d2');
		var sJSONfilePath = sApplicationPath + "/model/data/";
		var sMetaDataFilePath = sApplicationPath + "/model/metadata/";
		var oStubbedMethods;
		var sAppOdataPath = "/sap/hba/apps/wca/dso/s/odata/wca.xsodata/";
		var sPersistencyOdataPath = "/sap/hba/r/apf/core/odata/apf.xsodata/";
		var sSmartBusinessOdataPath = "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata/";
		var sModelerOdataPath = "/sap/hba/r/apf/core/odata/apf.xsodata/";
		var oTokenForServices = {
			"sAppOdataPath" : sAppOdataPath,
			"sPersistencyOdataPath" : sPersistencyOdataPath,
			"sSmartBusinessOdataPath" : sSmartBusinessOdataPath
		};
		var stubApplicationMethods = function() {
			jQuery.sap.require('salesmapAPF1d2.model.stubbedMethods');
			oStubbedMethods = new salesmapAPF1d2.model.stubbedMethods(oTokenForServices);
			oStubbedMethods.fnStub();
		};
		restoreApplicationMethods = function() {
			oStubbedMethods.fnRestore();
		};
		/**
		* @private
		* @function
		* @name startApplicationMockServer
		* @description Mock Server for simulating the original request for application metadata and 
		* subsequent xso data request & also stub the application token request                      
		* */
		var startApplicationMockServer = function() {
			var oApplicationMockServer = new sap.ui.core.util.MockServer({
				rootUri : sAppOdataPath
			});
			var sApplicationMatadaPath = sMetaDataFilePath + "applicationMetadata.xml";
			oApplicationMockServer.simulate(sApplicationMatadaPath, sJSONfilePath);
			oApplicationMockServer.start();
			//stub required methods
			stubApplicationMethods();
		};
		/**
		* @private
		* @function
		* @name startApplicationAnnotationMockServer
		* @description Mock Server for simulating the original request for application annotation.xml file                    
		* */
		var startApplicationAnnotationMockServer = function() {
			var oApplicationAnnotationMockServer = new sap.ui.core.util.MockServer({
				rootUri : "/sap/hba/apps/wca/dso/s/odata/",
				requests : [ {
					method : "GET",
					path : new RegExp(".*annotation\.xml$"),
					response : function(oXhr) {
						jQuery.sap.require("jquery.sap.xml");
						jQuery.sap.log.debug("MockServer: incoming request for url: " + oXhr.url);
						var oResponse = jQuery.sap.sjax({
							url : sMetaDataFilePath + "annotation.xml",
							type : "GET"
						});
						if (oResponse.success) {
							oXhr.respondXML(200, {
								"Content-Type" : "application/xml"
							}, jQuery.sap.serializeXML(oResponse.data));
							jQuery.sap.log.debug("MockServer: response sent with: 200, " + jQuery.sap.serializeXML(oResponse.data));
						}
					}
				} ]
			});
			oApplicationAnnotationMockServer.start();
		};
		/**
		* @private
		* @function
		* @name startPersistencyMockServer
		* @description Mock Server for simulating the original request for metadata and 
		* subsequent xso data request                 
		* */
		var startPersistencyMockServer = function() {
			var oPersistecyMockServer = new sap.ui.core.util.MockServer({
				rootUri : sPersistencyOdataPath
			});
			var sPersistecyMatadaPath = sMetaDataFilePath + "persistencyMetadata.xml";
			var sPersistencyJSONFilePath = sJSONfilePath;
			if (window.location.pathname.search("apf-test") >= 0) {
				sPersistencyJSONFilePath += "local/";
			}
			oPersistecyMockServer.simulate(sPersistecyMatadaPath, sPersistencyJSONFilePath);
			oPersistecyMockServer.start();
		};
		/**
		* @private
		* @function
		* @name startPersistencyAnnotationMockServer
		* @description Mock Server for simulating the original request for application annotation.xml file                    
		* */
		var startPersistencyAnnotationMockServer = function() {
			var oPersistencyAnnotationMockServer = new sap.ui.core.util.MockServer({
				rootUri : "/sap/hba/r/apf/core/odata/",
				requests : [ {
					method : "GET",
					path : new RegExp(".*annotation\.xml$"),
					response : function(oXhr) {
						jQuery.sap.require("jquery.sap.xml");
						jQuery.sap.log.debug("MockServer: incoming request for url: " + oXhr.url);
						var oResponse = jQuery.sap.sjax({
							url : sMetaDataFilePath + "persistencyAnnotation.xml",
							type : "GET"
						});
						if (oResponse.success) {
							oXhr.respondXML(200, {
								"Content-Type" : "application/xml"
							}, jQuery.sap.serializeXML(oResponse.data));
							jQuery.sap.log.debug("MockServer: response sent with: 200, " + jQuery.sap.serializeXML(oResponse.data));
						}
					}
				} ]
			});
			oPersistencyAnnotationMockServer.start();
		};
		/**
		* @private
		* @function
		* @name startSmartBusinessMockServer
		* @description Mock Server for simulating the original request for metadata and 
		* subsequent xso data request                 
		* */
		var startSmartBusinessMockServer = function() {
			var oSBMockServer = new sap.ui.core.util.MockServer({
				rootUri : sSmartBusinessOdataPath
			});
			var sSBMatadaPath = sMetaDataFilePath + "smartBusinessMetadata.xml";
			oSBMockServer.simulate(sSBMatadaPath, sJSONfilePath);
			oSBMockServer.start();
		};
		/**
		* @private
		* @function
		* @name startModelerMockServer
		* @description Mock Server for simulating the original request for metadata and 
		* subsequent xso data request                 
		* */
		var startModelerMockServer = function() {
			var oModelerMockServer = new sap.ui.core.util.MockServer({
				rootUri : sModelerOdataPath
			});
			var sModelerMetadaPath = sMetaDataFilePath + "AnalyticalConfiguration.xml";
			oModelerMockServer.simulate(sModelerMetadaPath, sJSONfilePath);
			oModelerMockServer.start();
		};
		return {
			startApplicationMockServer : startApplicationMockServer,
			startPersistencyMockServer : startPersistencyMockServer,
			startSmartBusinessMockServer : startSmartBusinessMockServer,
			startModelerMockServer : startModelerMockServer,
			startApplicationAnnotationMockServer : startApplicationAnnotationMockServer,
			startPersistencyAnnotationMockServer : startPersistencyAnnotationMockServer
		};
	};
	var instance;
	var _static = {
		name : "initializeMockServer",
		getInstance : function() {
			if (instance === undefined) {
				instance = new initializeMockServer();
			}
			return instance;
		},
		destroyInstance : function() {
			instance = undefined;
			restoreApplicationMethods();
		}
	};
	return _static;
})();
