sap.ui.jsview("salesmapAPF1d2.controls.view.reportingCurrency", {
	getControllerName : function() {
		return "salesmapAPF1d2.controls.controller.reportingCurrency";
	},
	createContent : function(oController) {
		var self = this;
		this.oApi = this.getViewData().oApi;
		this.sSAPClientValue = this.getViewData().SAPClient; // SAPClient Value from component.
		/**
		 * Select Dialog to hold list of currencies
		 * */
		this.oDialog = new sap.m.SelectDialog({
			title : this.oApi.getTextNotHtmlEncoded("reportingCurrency"),
			rememberSelections : true,
			growingThreshold : 500,
			items : {
				path : "/",
				template : new sap.m.StandardListItem({
					title : "{text}",
					selected : "{selected}"
				})
			},
			confirm : oController.onConfirmPress.bind(oController),
			search : oController.doSearchItems.bind(oController),
			liveChange : oController.doSearchItems.bind(oController),
			cancel : oController.onCancelPress.bind(oController)
		});
		/**
		 * The Button that gets added to the footer on press of which
		 * the above dialog will open.
		 * */
		this.oButton = new sap.m.Button({
			text : this.oApi.getTextNotHtmlEncoded("reportingCurrency"),
			width : "100%",
			type : "Transparent",
			press : function() {
				self.oDialog.open();
			}
		});
		return this.oButton;
	}
});