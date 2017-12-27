var year = encodeURI($.request.parameters.get('year'));
var amount = encodeURI($.request.parameters.get('amount'));

try {

	var conn = $.db.getConnection();
	var pstmt = conn
			.prepareStatement('insert into "DEV01"."SALES_MAP_PRED_TEMP" values(?,?)');

	pstmt.setInt(1, parseInt(year));
	pstmt.setInt(2, parseFloat(amount));

	var rs = pstmt.execute();

	pstmt.close();

	conn.commit();
	conn.close();

	$.response.status = $.net.http.OK;
} catch (e) {
	$.response.setBody(e.toString());
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}
