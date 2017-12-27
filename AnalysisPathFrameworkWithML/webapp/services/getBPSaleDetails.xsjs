$.response.contentType = "application/json";
var output = {
    entry: []
};
//encodeURI to avoud injection attacks
var bpId = encodeURI($.request.parameters.get('bpId'));

var conn = $.hdb.getConnection();
// get data from BP_ADDRESS_DETAILS.attributeview
// model location : SHINE/spatial/models
var query = 
    'select "GROSSAMOUNT", "CURRENCY", "HISTORY_CREATEDAT" FROM ' 
    + '"_SYS_BIC"."salesmapAPF1d2.webapp.models/REGION_SALES_BP"'
    + 'where "PARTNERID" = ? ORDER BY  "GROSSAMOUNT" DESC';
var rs = conn.executeQuery(query, bpId);
var bpEntry = {};

if (rs.length < 1) {
    $.response.setBody("Failed to retieve data");
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
} else {
	var row;
    for (row = 0; row < rs.length; row++) {
        bpEntry = {};
        bpEntry.orderAmount = rs[row].GROSSAMOUNT;
        bpEntry.currency = rs[row].CURRENCY;
        bpEntry.orderDate = rs[row].HISTORY_CREATEDAT;

        output.entry.push(bpEntry);
    } 
    
    $.response.setBody(JSON.stringify(output));
    $.response.status = $.net.http.OK;
}

conn.close();