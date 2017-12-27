$.response.contentType = "text/plain";
var result = "";
var output = {};
var entry;
var conn = $.db.getConnection();

var outtable;

function onesql(sql) {
	try {
		var ps = conn.prepareStatement(sql);
		var execrc = ps.execute();
		ps.close();
	} catch (e) {
		result += sql + ":\n" + e.toString() + "\n--------\n\n";
	}
}

//call the procedure with the local data
try {
	var pc = conn.prepareCall('call DEV01.SINGLESMOOTH_TEST_PROC(SALES_MAP_PRED_TEMP, PAL_SM_CONTROL_TBL, ?, ?)');

	if (pc.execute()) {
		var rs = pc.getResultSet();

		output.predYoY = [];

		while(rs.next()) { 
			entry = {};

			entry.year = rs.getString(1);
			entry.amount = rs.getString(2);

			output.predYoY.push(entry);
		} 

		conn.close();

		$.response.setBody(JSON.stringify(output)); 
		$.response.contentType = "application/json";
		$.response.status = $.net.http.OK;
	} else {
		$.response.setBody("failed to retrieve data");
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	}
} catch (e) {
	$.response.setBody(e.toString());
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
