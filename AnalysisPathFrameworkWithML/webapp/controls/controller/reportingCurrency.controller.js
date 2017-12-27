/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("salesmapAPF1d2.helper.contextMediator");
sap.ui.controller("salesmapAPF1d2.controls.controller.reportingCurrency", {
	onInit : function() {
		// Store the references of view and oApi.
		this.oView = this.getView();
		this.oApi = this.oView.oApi;
		this.sSAPClientValue = this.oView.sSAPClientValue;
		// Prepare dataset and model for select dialog list of currencies.
		this.aDataset = [];
		this.oModel = new sap.ui.model.json.JSONModel(this.aDataset);
		this.oView.oDialog.setModel(this.oModel);
		// Default Currency in case there is no smartBusiness context.
		this.sSelectedCurrency = this.oApi.getApplicationConfigProperties().defaultReportingCurrency;
		// Pass the default currency to the context.
		// Might get overridden by smartBusiness Context if available.
		this._setFilter();
		// Trigger request to populate currency list if P_SAPClient is available as path filter.
		// It will be available in case of Non-Smart Business scenario.
		if (this.sSAPClientValue) {
			this._populateMasterList();
		}
		// Register a listener for 'sap.apf.contextChanged' event.
		var oContextMediator = salesmapAPF1d2.helper.ContextMediator.getInstance(this.oApi);
		oContextMediator.onContextChange(this.contextChanged.bind(this));
	},
	/**
	 * Trigger request to populate currency list.
	 * Creates Data set and update the bindings when data is ready.
	 * */
	_populateMasterList : function() {
		var self = this;
		var oRequestConfiguration = {
				"type" : "request",
				"id" : "requestCurrencyInitialStep",
				"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
				"entityType" : "CurrencyQuery",
				"selectProperties" : [ "Currency", "CurrencyShortName" ]
			};
		var oRequest = this.oApi.createReadRequestByRequiredFilter(oRequestConfiguration);
		oRequest.send(this.oApi.createFilter(), function(aData, oMetadata, oMessage) { // TODO  Check if dummy filter can be avoided.
			if (!oMessage && aData && aData.length) {
				self.aDataset = [];
				aData.forEach(function(oDataRow) {
					self.aDataset.push({
						key : oDataRow.Currency,
						text : oDataRow.CurrencyShortName ? (oDataRow.Currency + " - " + oDataRow.CurrencyShortName) : oDataRow.Currency,
						selected : (oDataRow.Currency === self.sSelectedCurrency)
					});
				});
				self.oModel.setData(self.aDataset);
			} else {
				var oMessageObj = self.oApi.createMessageObject({
					code : "12003",
					aParameters : [self.oApi.getTextNotHtmlEncoded("reportingCurrency")]
				});
				self.oApi.putMessage(oMessageObj);
			}
		});
	},
	/**
	 * Listener for 'sap.apf.contextChanged' event.
	 * Fetches the filter from path Context and updates the binding.
	 * */
	contextChanged : function() {
		var oFilter = this.oApi.getPathFilter('P_DisplayCurrency');
		this.sSelectedCurrency = oFilter.getInternalFilter().getFilterTerms()[0].getValue();
		this._populateMasterList();
		this.oModel.updateBindings();
	},
	/**
	 * Handler for 'Confirm' press on select dialog.
	 * update the currency filter.
	 * */
	onConfirmPress : function(oEvt) {
		var self = this;
		var oSelectedItem = oEvt.getParameter('selectedItem');
		this.sSelectedCurrency = oSelectedItem.getBindingContext().getProperty("key");
		this.aDataset.forEach(function(oDataset) {
			oDataset.selected = false;
			if (oDataset.key === self.sSelectedCurrency) {
				oDataset.selected = true;
			}
		});
		this._setFilter();
		this._applySearchFilters([]);
	},
	/**
	 * Handler for 'liveChange' and 'search' events on select dialog.
	 * */
	doSearchItems : function(oEvt) {
		var sValue = oEvt.getParameter("value");
		var oFilter = new sap.ui.model.Filter("text", sap.ui.model.FilterOperator.Contains, sValue);
		this._applySearchFilters([ oFilter ]);
	},
	/**
	 * Handler for 'cancel' press on select dialog.
	 * */
	onCancelPress : function() {
		this._applySearchFilters([]);
		return;
	},
	/**
	 * update the filter with passed argument.
	 * pass an empty array to clear the filter.
	 * */
	_applySearchFilters : function(aFilters) {
		var oBinding = this.oView.oDialog.getBinding("items");
		oBinding.filter(aFilters, false);
		this.oModel.updateBindings();
	},
	/**
	 * Updates the path context filter with currently selected currency value.
	 * */
	_setFilter : function() {
		var oFilter = this.oApi.createFilter();
		var oFilterOrExp = oFilter.getTopAnd().addOr();
		oFilterOrExp.addExpression({
			name : "P_DisplayCurrency",
			operator : "EQ",
			value : this.sSelectedCurrency
		});
		this.oApi.updatePathFilter("P_DisplayCurrency", oFilter);
		this.oApi.selectionChanged(true);
	}
});