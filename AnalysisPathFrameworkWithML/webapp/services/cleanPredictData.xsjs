$.response.contentType = "text/plain";
var result = "";
var conn=$.db.getConnection();  

function onesql(sql) {
	try {
		var ps = conn.prepareStatement(sql);
		var execrc = ps.execute();
		ps.close();
	} catch (e) {
		result += sql + ":\n" + e.toString() + "\n--------\n\n";
	}
}

onesql('TRUNCATE TABLE "DEV01"."SALES_MAP_PRED_TEMP"');
onesql('TRUNCATE TABLE "DEV01"."PAL_SINGLESMOOTH_RESULT_TBL"');
onesql('TRUNCATE TABLE "DEV01"."PAL_SINGLESMOOTH_STATISTICS_TBL"');

$.response.setBody(result);  
$.response.status = $.net.http.OK;