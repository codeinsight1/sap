jQuery.sap.declare("salesmapAPF1d2.Component");
sap.ui.getCore().loadLibrary("sap.apf");
jQuery.sap.require("sap.apf.Component");
jQuery.sap.require('salesmapAPF1d2.helper.contextMediator');
jQuery.sap.require('salesmapAPF1d2.helper.formatter');
jQuery.sap.require('salesmapAPF1d2.helper.preselectionFunction');
jQuery.sap.require('salesmapAPF1d2.representation.barChart');
jQuery.sap.require('salesmapAPF1d2.representation.stackedBarChart');
sap.apf.Component.extend("salesmapAPF1d2.Component", {
	oApi : null,
	metadata : {
		"config" : {
			"fullWidth" : true
		},
		"name" : "Component",
		"version" : "1.3.0",
		"dependencies" : {
			"libs" : [ "sap.m", "sap.ui.layout" ]
		}
	},
	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	init : function() {
		var modPath = jQuery.sap.getModulePath('salesmapAPF1d2');
		this.filePath = modPath + "/config/applicationConfiguration.json";
		// Load application css file
		jQuery.sap.includeStyleSheet(modPath + "/resources/css/app.css");
		var self = this;
		this.oComponentData = {};
		this.oComponentData.startupParameters = {
			"evaluationId" : [ "com.sap.apf.receivables.america" ]
		};
		jQuery.sap.require('salesmapAPF1d2.model.initializeMockServer');
		var oMockServerHelper = salesmapAPF1d2.model.initializeMockServer.getInstance();
		oMockServerHelper.startApplicationMockServer();
		oMockServerHelper.startPersistencyMockServer();
		oMockServerHelper.startSmartBusinessMockServer();
		oMockServerHelper.startModelerMockServer();
		oMockServerHelper.startApplicationAnnotationMockServer();
		oMockServerHelper.startPersistencyAnnotationMockServer();
		sap.apf.Component.prototype.init.apply(this, arguments);
	},
	/**
	 * Creates the application layout and returns the outer layout of APF 
	 * @returns
	 */
	createContent : function() {
		this.oApi = this.getApi();
		var self = this;
		this.oApi.loadApplicationConfig(this.filePath);
		var layoutView = this.oApi.createApplicationLayout();
		var exchangeRateContent = sap.ui.view({
			viewName : "salesmapAPF1d2.controls.view.exchangeRate",
			type : sap.ui.core.mvc.ViewType.JS,
			viewData : {
				oApi : this.oApi
			},
			width : "70%"
		});
		var currencyContent = sap.ui.view({
			viewName : "salesmapAPF1d2.controls.view.reportingCurrency",
			type : sap.ui.core.mvc.ViewType.JS,
			viewData : {
				oApi : this.oApi
			}
		});
		this.oApi.addMasterFooterContent(currencyContent);
		this.oApi.addMasterFooterContent(exchangeRateContent);
		salesmapAPF1d2.helper.formatter.getInstance(this.oApi);
		// Calling paret Component's createContent method.
		sap.apf.Component.prototype.createContent.apply(this, arguments);
		return layoutView;
	},
	destroy : function() {
		salesmapAPF1d2.helper.ContextMediator.destroyInstance();
		salesmapAPF1d2.helper.formatter.destroyInstance();
		salesmapAPF1d2.model.initializeMockServer.destroyInstance();
		sap.apf.Component.prototype.destroy.apply(this, arguments);
	}
});
