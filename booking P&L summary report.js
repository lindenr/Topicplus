(function(document, undefined){
var FINISH = '';
function lS(a,b){var c=document;var d=c.getElementsByTagName('head')[0];var e=c.createElement('script');e.type='text/javascript';e.src=a;e.onreadystatechange=b;e.onload=b;d.appendChild(e)}
function gO(u) {
	document.body.innerHTML = '' + I + ' of ' + items.length + '.';
	var $ = jQuery; /* local - topicplus uses $ for something else*/
	$.get('/render.php?page=booking_bkLoad&mode=e&id='+u, function (data) {
		var v = data.indexOf('<td><b>Tour</b></td>')+24;
		if (data.slice(v, v+2) == '</')
		{
			FINISH += '<br /><tr style="color:red;font-weight:bold"><td>'+u+'</td><td>NO TOUR DATA -- possibly no booking.</td></tr>';
			++ I;
			return cS();
		}
		$.get('/render.php?page=booking_bkSales', function (data) {
			var beg = data.indexOf('<table width="95%">')+19, end = data.indexOf('</table></div><div style="mar');
			if (end == -1) end = data.indexOf('</table></div></div><div class="boxFooter"></div><br />');
			data = data.slice(beg, end);
			// cut out the first <tr>
			beg = 0; end = data.indexOf('</tr>') + 5;
			var dbeg = data.slice(0, beg), dend = data.slice(end);
			data = dbeg + dend;
			for(var i = data.indexOf('<tr>')+4; i != -1 + 4; i = data.indexOf('<tr>', i+1)+4)
			{
				dbeg = data.slice(0, i); dend = data.slice(i);
				data = dbeg + '<td>' + u + '</td>' + dend;
			}
			if (data == dbeg + dend) // nothing in loop
			{
				data = dbeg + '<tr style="color:red;font-weight:bold"><td>'+u+'</td><td>NO SALES DATA</td></tr>' + dend;
			}
			for (i = data.indexOf('</tr>'); i != -1; i = data.indexOf('</tr>', i))
			{
				var j = data.lastIndexOf('<td', i);
				data = data.slice(0, j) + data.slice(i);
			}
			FINISH += data + '<tr><td>.</td></tr>';
			++ I;
			cS();
			//alert(data);
			//var elem = document.createElement('div');
			//elem.innerHTML = data;
		});
	});
}
var I = 0;
var items = prompt("What numbers? (space-delimited)").split(' ');
function cS()
{
	if (I == 0)
		FINISH += '<table width=95%><tr class="bkSegListHeader"><td><b>Booking ID</b></td>\
		<td width="100px"><b>Supplement</b></td><td><b>Description</b></td>\
		<td width="50px"><b>Qty</b></td><td width="80px"><b>Each</b></td>\
		<td width="80px"><b>Sale</b></td><td width="90px"><b>Supplier</b></td>\
		<td width="80px"><b>Cost</b></td></tr>';
	FINISH += '<br />'
	if (I < items.length && items[I].length)
		gO(items[I]);
	else
		document.body.innerHTML = FINISH + '</table>';
}
lS('http://code.jquery.com/jquery-1.7.1.min.js', cS);
})(window.document);