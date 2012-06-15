/* If ctrl+shift+K opens up a console at the top paste ALL of the below into the console and press enter - otherwise see extract-merge.min.js */

(function(document, undefined){
var FINISH = '', dC = '<tr><td>', cB = '</td><td>', bA = '</td></tr>';
function lS(a,b){var c=document;var d=c.getElementsByTagName('head')[0];var e=c.createElement('script');e.type='text/javascript';e.src=a;e.onreadystatechange=b;e.onload=b;d.appendChild(e)}
function dO(b, d) {
	FINISH += dC + b.id + cB + b.dateBooked + cB + b.account + cB + b.A + cB + b.C + cB + b.I + cB + b.dep + cB + b.nts + cB + b.tour + cB + b.leadP + cB + b.sale + cB + b.total + cB + b.rcvd + bA + d;
}
String.prototype.times = function(n) {
    return Array.prototype.join.call({length:n+1}, this);
};
function gO(u) {
	var numdun = 0;
	document.body.innerHTML = '' + I + ' of ' + items.length + '.';
	var $ = jQuery;
	var bookingData = {id:u};
	function dN(){++numdun;if(numdun==4){++I;cS();}}
	$.get('/render.php?page=booking_bkLoad&mode=e&id='+u, function (data) {
		var v = data.indexOf('<td><b>Tour</b></td>')+24, w = data.indexOf('<', v);
		var K = data.slice(v, w);
		v = data.indexOf('<td><b>Lead:</b></td>')+25; w = data.indexOf('<', v);
		var L = data.slice(v, w);
		if (K == '' || !/\S/.test(L))
		{
			FINISH += '<br /><tr style="color:red;font-weight:bold"><td>'+u+'</td><td>DATA MISSING -- possibly no booking.</td></tr>';
			++ I;
			return cS();
		}
		bookingData.tour = K;
		var i = data.indexOf('<b>Pax:</b></td><td>')+20;
		var paxes = data.slice(i, data.indexOf('<', i));
		paxes = paxes.split('/');
		bookingData.A = paxes[0];
		bookingData.C = paxes[1];
		bookingData.I = paxes[2];
		i = data.indexOf('<b>Dep:</b></td><td>', i)+20;
		bookingData.dep = data.slice(i, data.indexOf('<', i));
		i = data.indexOf('<b>Value:</b></td><td>')+22;
		bookingData.sale = data.slice(i, data.indexOf('<', i));
		$.get('/render.php?page=booking_bkBasic', function E(data) {
			i = data.indexOf('Booking Administration');
			if (i != -1)
			{
				FINISH += '<br /><tr style="color:red;font-weight:bold"><td>'+u+'</td><td>DATA LOCKED -- possibly try again?</td></tr>';
				++ I;
				return cS();
			}
			i = data.indexOf('id="bkBookingDate"');
			i = data.indexOf('value', i)+7;
			var j = data.indexOf('"', i);
			bookingData.dateBooked = data.slice(i, j);
			i = data.indexOf('id="bkTypeDirect"');
			var J = data.indexOf('checked', i);
			if (J == -1 || J > data.indexOf('>', i))
				i = data.indexOf('id="ar2"', i);
			else i = data.indexOf('id="cr2"', i);
			i = data.indexOf('value', i)+7;
			j = data.indexOf('"', i+1);
			bookingData.account = data.slice(i, j);
			i = data.indexOf('Duration (Nts)');
			i = data.indexOf('value', i) + 7;
			j = data.indexOf('"', i);
			bookingData.nts = data.slice(i, j);
			i = data.indexOf('<td><a href="#" onclick="passengerPopup');
			var worked = true;
			if (i == -1) worked = false;
			if (worked) {
				i = data.indexOf(',', i)+1;i = data.indexOf(',', i)+1;i = data.indexOf(',', i)+2;
				j = data.indexOf('"', i)-2;
				var url = "/render.php?page=booking_p-bkPaxEntry&mode=e&bookingID=" + u + "&tourID=" + bookingData.tour +
				"&bookingPaxID=" + data.slice(i, j) + "&depDateID=" + bookingData.dep;
			} else {
				i = data.indexOf('<b>Lead:</b></td><td>')+21;
				bookingData.leadP = '<font style="color:red;font-weight:bold">Booking cancelled (' +
				data.slice(i, data.indexOf('<', i)) + ')</font>';
			}
			$.get(url, function(data, textStatus) {
				if (worked) {
					i = data.indexOf('name="bkpaxSurname"');
					i = data.indexOf('value', i) + 7;
					bookingData.leadP = data.slice(i, data.indexOf('"', i)) + '/';
					i = data.indexOf('name="bkpaxForename"');
					i = data.indexOf('value', i) + 7;
					bookingData.leadP += data.slice(i, data.indexOf('"', i)) + '/';
					i = data.indexOf('name="bkpaxTitle"');
					i = data.indexOf('selected="selected"', i)+20;
					bookingData.leadP += data.slice(i, data.indexOf('<', i));
				}
				$.get('/render.php?page=booking_bkSales', function (data) {
					i = data.indexOf('<b>Total Cost:</b>') + 30;
					i = data.indexOf('>', i) + 1;
					bookingData.total = data.slice(i, data.indexOf('<', i));
					i = data.indexOf('Received:</b></td>') + 22;
					bookingData.rcvd = data.slice(i, data.indexOf('<', i));
					var beg = data.indexOf('<table width="100%" class')+19, end = data.indexOf('</table></div><div style="mar');
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
					for (i = data.indexOf('<tr'); i != -1; i = data.indexOf('<tr', i))
					{
						i = data.indexOf('<td', i);
						i = data.indexOf('<td', i+4);
						data = data.slice(0, i) + '<td> </td>'.times(7) + data.slice(i);
						i += 70;
						i = data.indexOf('<td', i+4);
						i = data.indexOf('<td', i+4);
						data = data.slice(0, i) + '<td> </td>'.times(3) + data.slice(i);
					}
					dO(bookingData, data);
				}).done (dN);
			}).done (dN);
		}).done (dN);
	}).done (dN);
}
var I = 0;
var items = prompt("What numbers? (space-delimited)").split(' ');
function cS()
{
	if (I == 0)
		FINISH += '<table width=95%><tr class="bkSegListHeader"><td><b>Booking ID</b></td>\
		<td width="100px"><b>Booking date</b></td><td><b>Account</b></td><td width="15px"><b>A</b></td>\
		<td width="15px"><b>C</b></td><td width="15px"><b>I</b></td><td><b>Dep</b></td>\
		<td width="30px"><b>Nts</b></td><td width="100px"><b>Tour</b></td><td width="200px"><b>Lead</b></td>\
		<td width="60px"><b>Sale</b></td><td width="80px"><b>Cost</b></td><td width="70px"><b>Received</b></td>\
		<td width="25px"><b>Qty</b></td><td width="70px"><b>Each</b></td><td width="70px"><b>Sale</b></td>\
		<td width="100px"><b>Supplier</b></td><td width="70px"><b>Cost</b></td></tr>';
	FINISH += '<br />'
	if (I < items.length && items[I].length)
		gO(items[I]);
	else
		document.body.innerHTML = FINISH + '</table>';
}
lS('http://code.jquery.com/jquery-1.7.1.min.js', cS);
})(window.document);