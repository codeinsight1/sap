jQuery.sap.declare('salesmapAPF1d2.representation.barChart');
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");
/**
 * @class barChart constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
salesmapAPF1d2.representation.barChart = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = "BarChart";
	this.chartType = "Bar";
};
salesmapAPF1d2.representation.barChart.prototype = Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);
//Set the "constructor" property to refer to barChart
salesmapAPF1d2.representation.barChart.prototype.constructor = salesmapAPF1d2.representation.barChart;
/**
 * @method handleCustomFormattingOnChart
 * @description sets the custom format string
 */
salesmapAPF1d2.representation.barChart.prototype.handleCustomFormattingOnChart = function() {
	var superClass = this;
	var aMeasure = superClass.getMeasures();
	var sFormatString = superClass.getFormatStringForMeasure(aMeasure[0]); //get the format string from base class
	superClass.setFormatString("xAxis", sFormatString);
};
