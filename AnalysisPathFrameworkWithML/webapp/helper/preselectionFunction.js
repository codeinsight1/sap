jQuery.sap.declare('salesmapAPF1d2.helper.preselectionFunction');
salesmapAPF1d2.helper.preselectionFunction = (function() {
	var fromDate;
	var toDate;
	var date = new Date();
	var preselectedFromDate = function() {
		var fromDateArr = [];
		var lastYear = (date.getFullYear() - 1).toString();
		var currentMonth = (date.getMonth() + 1).toString();
		if (currentMonth / 10 < 1) {
			fromDate = lastYear + "0" + currentMonth + "01";
		} else {
			fromDate = lastYear + currentMonth + "01";
		}
		fromDateArr.push(fromDate);
		return fromDateArr;
	};
	var preselectedToDate = function() {
		var toDateArr = [];
		var currentYear = date.getFullYear().toString();
		var month = date.getMonth();
		var day = (daysInMonth(month, currentYear)).toString();
		var currentMonth = (date.getMonth() + 1).toString();
		if (currentMonth / 10 < 1) {
			toDate = currentYear + "0" + currentMonth + day;
		} else {
			toDate = currentYear + currentMonth + day;
		}
		toDateArr.push(toDate);
		return toDateArr;
	};
	var daysInMonth = function(month, year) {
		var noOfDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
		if (month !== 1) {//All months except for february
			return noOfDays[month];
		} else {//leap year check
			if (year % 4 === 0) {
				if (year % 100 === 0) { // check for century year
					if (year % 400 === 0) {
						return noOfDays[1] + 1;
					} else {
						return noOfDays[1];
					}
				} else {
					return noOfDays[1] + 1;
				}
			} else {
				return noOfDays[1];
			}
		}
	};
	return {
		preselectedFromDate : preselectedFromDate,
		preselectedToDate : preselectedToDate
	};
})();