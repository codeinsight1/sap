jQuery.sap.require("salesmapAPF1d2.helper.contextMediator");
sap.ui.controller("salesmapAPF1d2.controls.controller.exchangeRate", {
	onInit : function() {
		// Store references of view and oApi.
		this.oView = this.getView();
		this.oApi = this.oView.oApi;
		this.sSAPClientValue = this.oView.sSAPClientValue;
		// A map of all data sets used. 
		this.mDatasets = {
			oExchangeRateDataset : {
				aExchangeRateTypes : [],
				sSelectedExchangeRateKey : this.oApi.getApplicationConfigProperties().defaultExchangeRateType
			// Default Value.
			},
			oDateTypeDataset : {
				aDateTypes : [ {
					text : this.oApi.getTextNotHtmlEncoded("postingDate"),
					key : "postingDate"
				}, {
					text : this.oApi.getTextNotHtmlEncoded("keyDateKey"),
					key : "keyDate"
				} ],
				sSelectedDateType : "postingDate" // Default Value.
			},
			oDateDataset : {
				sSelectedDate : this.oApi.getTextNotHtmlEncoded("enterDate")
			}
		};
		// A map of all models used.
		this.mModels = {
			oExchangeRateModel : new sap.ui.model.json.JSONModel(this.mDatasets.oExchangeRateDataset),
			oDateTypeModel : new sap.ui.model.json.JSONModel(this.mDatasets.oDateTypeDataset),
			oDateModel : new sap.ui.model.json.JSONModel(this.mDatasets.oDateDataset)
		};
		// Set models on respective controllers.
		this.oView.oExchangeRateDropdown.setModel(this.mModels.oExchangeRateModel);
		this.oView.oDateTypeDropdown.setModel(this.mModels.oDateTypeModel);
		this.oView.oDatePicker.setModel(this.mModels.oDateModel);
		// Pass the default filters to the context.
		// Might get overridden by smartBusiness Context if available.
		this._setFilters();
		// Trigger request to populate exchange rate type list if P_SAPClient is available as path filter.
		// It will be available in case of Non-Smart Business scenario.
		if (this.sSAPClientValue) {
			this._populateMasterContent();
		}
		// Attach a listener to 'sap.apf.contextChanged' event.
		var oContextMediator = salesmapAPF1d2.helper.ContextMediator.getInstance(this.oApi);
		oContextMediator.onContextChange(this.contextChanged.bind(this));
	},
	/**
	 * Trigger request to fetch exchange Rate Type list.
	 * Creates the data set and update the bindings.
	 * */
	_populateMasterContent : function() {
		var self = this;
		var oRequestConfiguration = {
				"type" : "request",
				"id" : "requestExchangeRateInitialStep",
				"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
				"entityType" : "ExchangeRateQuery",
				"selectProperties" : [ "ExchangeRateType", "ExchangeRateTypeName" ]
			};
		var oRequest = this.oApi.createReadRequestByRequiredFilter(oRequestConfiguration);
		oRequest.send(this.oApi.createFilter(), function(aData, oMetadata, oMessage) { // TODO  Check if dummy filter can be avoided.
			if (!oMessage && aData && aData.length) {
				self.mDatasets.oExchangeRateDataset.aExchangeRateTypes = [];
				aData.forEach(function(oDataRow) {
					self.mDatasets.oExchangeRateDataset.aExchangeRateTypes.push({
						key : oDataRow.ExchangeRateType,
						text : oDataRow.ExchangeRateTypeName ? (oDataRow.ExchangeRateType + " - " + oDataRow.ExchangeRateTypeName) : oDataRow.ExchangeRateType
					});
				});
				self.mModels.oExchangeRateModel.updateBindings();
			} else {
				var oMessageObj = self.oApi.createMessageObject({
					code : "12003",
					aParameters : [ self.oApi.getTextNotHtmlEncoded("P_ExchangeRateType") ]
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
		var oFilter = this.oApi.getPathFilter('P_ExchangeRateType');
		var sSelectedExchangeRateKey = oFilter.getInternalFilter().getFilterTerms()[0].getValue();
		this._populateMasterContent();
		this.mDatasets.oExchangeRateDataset.sSelectedExchangeRateKey = sSelectedExchangeRateKey;
		this.mModels.oExchangeRateModel.updateBindings();
		oFilter = this.oApi.getPathFilter('P_ExchangeRateDate');
		var sSelectedDate = oFilter.getInternalFilter().getFilterTerms()[0].getValue();
		switch (sSelectedDate) {
			case "00000000":
				this._selectPostingDate();
				break;
			default:
				this._selectKeyDate();
				this.mDatasets.oDateDataset.sSelectedDate = this._convertToUIDateFormat(sSelectedDate);
				this.mModels.oDateModel.updateBindings();
		}
	},
	/**
	 * Handler for 'OK' press on dialog.
	 * Updates the filters and closes the dialog.
	 * */
	handleOkPress : function() {
		this._setFilters();
		this.oView.oDialog.close();
	},
	/**
	 * Update the filters with selected values.
	 * */
	_setFilters : function() {
		this._updateExchangeRateFilter();
		this._updateDateFilter();
		this.oApi.selectionChanged(true);
	},
	/**
	 * Updates Exchange Rate Filter with selected type.
	 * */
	_updateExchangeRateFilter : function() {
		var oFilter = this.oApi.createFilter();
		var orExpression = oFilter.getTopAnd().addOr();
		orExpression.addExpression({
			name : "P_ExchangeRateType",
			operator : "EQ",
			value : this.mDatasets.oExchangeRateDataset.sSelectedExchangeRateKey
		});
		this.oApi.updatePathFilter("P_ExchangeRateType", oFilter);
	},
	/**
	 * Updates Exchange Rate Date Filter with selecte date value.
	 * */
	_updateDateFilter : function() {
		var sSelectedDateTypeKey = this.mDatasets.oDateTypeDataset.sSelectedDateType;
		var sSelectedDate = null;
		if (sSelectedDateTypeKey === "postingDate") {
			sSelectedDate = "00000000";
		} else {
			sSelectedDate = this._convertToFilterDateFormat(this.mDatasets.oDateDataset.sSelectedDate);
		}
		var oFilter = this.oApi.createFilter();
		var orExpression = oFilter.getTopAnd().addOr();
		orExpression.addExpression({
			name : "P_ExchangeRateDate",
			operator : "EQ",
			value : sSelectedDate
		});
		this.oApi.updatePathFilter("P_ExchangeRateDate", oFilter);
	},
	/**
	 * Handler for 'cancel' press on dialog.
	 * Restore the initial state of the dialog.
	 * */
	handleCancelPress : function() {
		this._restoreInitialState();
		this.oView.oDialog.close();
	},
	/**
	 * Listener for 'beforeOpen' event of dialog.
	 * Saves the initial state of the dialog which will be restored at the time of 'cancel' press.
	 * */
	handleDialogOpen : function() {
		this._saveInitialState();
		if (this.mModels.oDateTypeModel.getData().sSelectedDateType === "postingDate") {
			this.oView.hideDatePicker();
		} else {
			this.oView.showDatePicker();
		}
	},
	/**
	 * Utility function to convert date to UI format
	 * 20140101 --> Jan 01, 2014
	 * */
	_convertToUIDateFormat : function(sDate) {
		var sYear = sDate.slice(0, 4);
		var sMonth = sDate.slice(4, 6);
		var sDay = sDate.slice(6, 8);
		return sYear + "." + sMonth + "." + sDay;
	},
	/**
	 * Utility function to convert date to filter format.
	 * 20140101 --> 2014.01.01
	 * */
	_convertToFilterDateFormat : function(sDate) {
		var oDate = new Date(sDate);
		var sYear = oDate.getFullYear().toString();
		var sMonth = (oDate.getMonth() + 1).toString();
		if (sMonth.length === 1) {
			sMonth = "0" + sMonth;
		}
		var sDay = oDate.getDate().toString();
		if (sDay.length === 1) {
			sDay = "0" + sDay;
		}
		var sFormattedDate = sYear + sMonth + sDay;
		return sFormattedDate;
	},
	/**
	 * Set 'Posting Date' as date type.
	 * Hides the date picker.
	 * */
	_selectPostingDate : function() {
		this.mDatasets.oDateTypeDataset.sSelectedDateType = "postingDate";
		this.mModels.oDateTypeModel.updateBindings();
		this.oView.hideDatePicker();
	},
	/**
	 * Set 'Key Date/Dynamic Date' as date type.
	 * Shows the date picker.
	 * */
	_selectKeyDate : function() {
		this.mDatasets.oDateTypeDataset.sSelectedDateType = "keyDate";
		this.mModels.oDateTypeModel.updateBindings();
		this.oView.showDatePicker();
	},
	/**
	 * Stores the state of dialog (data set) in an instance variable.
	 * */
	_saveInitialState : function() {
		this.aInitialDatasets = [];
		var i = null;
		for(i in this.mModels) {
			if (this.mModels.hasOwnProperty(i)) {
				var oDataset = jQuery.extend(true, {}, this.mModels[i].getData());
				this.aInitialDatasets.push(oDataset);
			}
		}
	},
	/**
	 * Restore the data sets value from the initial state instance variable.
	 * */
	_restoreInitialState : function() {
		var i = null, j = 0;
		for(i in this.mDatasets) {
			if (this.mDatasets.hasOwnProperty(i)) {
				this.mDatasets[i] = this.aInitialDatasets[j++];
			}
		}
		j = 0;
		for(i in this.mModels) {
			if (this.mModels.hasOwnProperty(i)) {
				this.mModels[i].setData(this.aInitialDatasets[j++]);
			}
		}
	}
});