(function (document, undefined) {
var table, ids, Ld = function(f,C){var i=document.createElement('script');i.type="text/javascript";i.onload=function(){C()};i.src=f;document.getElementsByTagName("head")[0].appendChild(i)},
Ss = function(str) {
	for (var i = str.indexOf('<'); i != -1; i = str.indexOf('<', i))
	{
		var j = str.indexOf('>',i)+1;
		str = str.slice(0, i)+str.slice(j);
	}
	for (var i = str.indexOf('&'); i != -1; i = str.indexOf('&', i))
	{
		var j = str.indexOf(';',i)+1;
		str = str.slice(0, i)+str.slice(j);
	}
	return str;
},
Fn = function(bkdat) {
	var A='<tr><td>',B='</td><td>',C='</td></tr>',Z=' '+B;
	if (bkdat.flaw) {
		table.innerHTML += A+bkdat.id+B+'An error occurred: '+bkdat.flaw+C;
		return;
	}
	var N = A + '.' + B + '<b>' + bkdat.id + '</b>' + B;
	table.innerHTML += A+bkdat.ref+B+'<b>'+bkdat.id+'</b>'+B+bkdat.issueDate+B+Z+Z+Z+'<b>'+bkdat.leadP+'</b>'+B+Z+'<b>'+bkdat.depDates[0]+'</b>'+C;
	for (var i = 0; i < bkdat.depDates.length; ++ i) {
		table.innerHTML += N+bkdat.depDates[i]+B+bkdat.depTimes[i]+B+bkdat.depTypes[i]+B+Z+Ss(bkdat.depDescs[i])+C;
	}
	for (var i = 0; i < bkdat.myrefs.length; ++ i) {
		table.innerHTML += N+Z+Z+'Your Ref:'+B+Z+bkdat.myrefs[i]+C;
	}
	for (var i = 0; i < bkdat.paxes.length; ++ i) {
		table.innerHTML += N+Z+Z+'Passenger:'+B+Z+bkdat.paxes[i]+C;
	}
	for (var i = 0; i < bkdat.sales.length; ++ i) {
		var row = N;
		for (var j = 0; j < bkdat.sales[i].length-1; ++ j) {
			row += bkdat.sales[i][j]+B;
		}
		row += bkdat.sales[i][j]+C;
		table.innerHTML += row;
	}
	table.innerHTML += N+Z+Z+Z+Z+Z+'<b>Total:</b>'+B+Z+bkdat.total+C;
	for (var i = 0; i < bkdat.receipts.length; ++ i) {
		table.innerHTML += N+bkdat.receipts[i][0]+B+bkdat.receipts[i][1]+B+bkdat.receipts[i][2]+C;
	}
	table.innerHTML += N+Z+'<b>Balance due:</b>'+B+Z+Z+bkdat.owed+C;
	table.innerHTML += '<tr><td> </td></tr><tr><td> </td></tr>';
},
Go = function(idid) {
	if(idid >= ids.length) return;
	var bkdat = {id: ids[idid], depDates: [], depTimes: [], depTypes: [], depDescs: [], myrefs: []},
	$ = jQuery, tnum = 4, F = function(){if(!--tnum){Fn(bkdat);Go(++idid);}}, i, j;
	$.get('/render.php?page=booking_bkLoad&mode=e&id='+bkdat.id, function (data) {
		i = data.indexOf('<td width="90px">Date</td>');
		for (i = data.indexOf('<tr id="', i); i != -1; i = data.indexOf('<tr id="', i))
		{
			i = data.indexOf('<td>', i) + 4;
			j = data.indexOf('<', i);
			bkdat.depDates.push(data.slice(i, j));
			i = data.indexOf('<td>', i) + 4;
			j = data.indexOf('<', i);
			bkdat.depTimes.push(data.slice(i, j));
			i = data.indexOf('<td>', i) + 4;
			j = data.indexOf('<', i);
			bkdat.depTypes.push(data.slice(i, j));
			i = data.indexOf('<td>', i) + 4;
			j = data.indexOf('</td>', i);
			bkdat.depDescs.push(data.slice(i, j));
		}
		i = data.indexOf('<td><b>Tour</b></td>')+24;
		j = data.indexOf('<', i);
		bkdat.tour = data.slice(i, j);
		$.get('/render.php?page=booking_bkBasic', function (data) {
			i = data.indexOf('Booking Administration');
			if (i != -1){bkdat.flaw = '<b style="color:red">unexpected redirection from server</b>';Fn(bkdat);Go(++idid);return}
			i = data.indexOf('id="bkTypeDirect"');
			var J = data.indexOf('checked', i);
			if (J == -1 || J > data.indexOf('>', i))
				i = data.indexOf('id="ar2"', i);
			else i = data.indexOf('id="cr2"', i);
			i = data.indexOf('value', i)+7;
			j = data.indexOf('"', i+1);
			bkdat.ref = data.slice(i, j);
			// -------- Lead Pax -------- //
			i = data.indexOf('<td><a href="#" onclick="passengerPopup');
			var worked = (i != -1);
			if (worked) {
				i = data.indexOf(',', i)+1;i = data.indexOf(',', i)+1;i = data.indexOf(',', i)+2;
				j = data.indexOf('"', i)-2;
				var url = "/render.php?page=booking_p-bkPaxEntry&mode=e&bookingID=" + bkdat.id + "&tourID=" + bkdat.tour +
				"&bookingPaxID=" + data.slice(i, j) + "&depDateID=" + bkdat.depDates[0];
				i = data.indexOf('<div id="bkPaxBlock"');
				var endtab = data.indexOf('</table>', i);
				bkdat.paxes = [];
				i = data.indexOf('<tr>', i+1);
				while (i < endtab && i > 0)
				{
					i = data.indexOf('<td>', i)+4;
					j = data.indexOf('<', i);
					bkdat.paxes.push(data.slice(i, j));
					i = data.indexOf('<tr>', i+1);
				}
			}
			$.get(url, function(data, textStatus) {
				if (worked) {
					i = data.indexOf('name="bkpaxSurname"');
					i = data.indexOf('value', i) + 7;
					bkdat.leadP = data.slice(i, data.indexOf('"', i)) + '/';
					i = data.indexOf('name="bkpaxForename"');
					i = data.indexOf('value', i) + 7;
					bkdat.leadP += data[i] + '/';
					i = data.indexOf('name="bkpaxTitle"');
					i = data.indexOf('selected="selected"', i)+20;
					bkdat.leadP += data.slice(i, data.indexOf('<', i));
				}
				F();
			});
		});
		$.get('/render.php?page=booking_bkSales', function (data) {
			var i = data.indexOf('<table width="95%"'), j, end = data.indexOf('</table>', i);
			bkdat.sales = [];
			for(i = data.indexOf('<tr>', i); i != -1 && i < end; i = data.indexOf('<tr>', i)) {
				var tmp = [];
				i = data.indexOf('>', data.indexOf('<td',i))+1;
				j = data.indexOf('<', i);
				tmp.push(data.slice(i, j));
				i = data.indexOf('>', data.indexOf('<td',i))+1;
				j = data.indexOf('<', i);
				tmp.push(data.slice(i, j));
				tmp.push(' ');
				i = data.indexOf('>', data.indexOf('<td',i))+1;
				j = data.indexOf('<', i);
				tmp.push(data.slice(i, j));
				tmp.push(' ');
				i = data.indexOf('>', data.indexOf('<td',i))+1;
				j = data.indexOf('<', i);
				tmp.push('£'+data.slice(i, j));
				i = data.indexOf('>', data.indexOf('<td',i))+1;
				j = data.indexOf('<', i);
				tmp.push('£'+data.slice(i, j));
				if (parseInt(tmp[6]) !== 0) bkdat.sales.push(tmp);
			}
			j = data.indexOf('</balanceDueDate>');
			i = j-10;
			bkdat.issueDate = data.slice(i, j);
			i = data.indexOf('Total Booking Value:');
			i = data.indexOf('<td', i);
			i = data.indexOf('>', i)+1;
			j = data.indexOf('<', i);
			bkdat.total = '£'+data.slice(i, j);
			i = data.indexOf('Balance Due:', i);
			i = data.indexOf('<td>', i)+4;
			j = data.indexOf('<', i);
			bkdat.owed = '£'+$.trim(data.slice(i,j));
			F();
		});
		$.get('/render.php?page=booking_bkPayments', function(data) {
			var i = data.indexOf('<div class="displayBlock"'), end = data.indexOf('</table>',i);
			bkdat.receipts = [];
			i = data.indexOf('<tr>',i)+4;
			if(data.indexOf('<i>No Payments</i>') > -1)
			{
				bkdat.receipts = [];
				return F();
			}
			for (; i > 3 && i < end; i = data.indexOf('<tr>',i)+4)
			{
				var local = [];
				i += 17;
				var j = data.indexOf('<',i);
				local.push(data.slice(i,j));
				local.push('Received:');
				i = data.indexOf('<td align="right">', i)+18;
				j = data.indexOf('<',i);
				local.push('£'+data.slice(i,j));
				bkdat.receipts.push(local);
			}
			F();
		});
		for (i = data.indexOf('Your Ref:')+11; i != -1+11; i = data.indexOf('Your Ref:', i)+11)
		{
			j = data.indexOf('(', i)-1;
			bkdat.myrefs.push(data.slice(i, j));
		}
		i = data.indexOf('<td><b>Lead:</b></td>')+25;
		j = data.indexOf('<', i);
		bkdat.lead = data.slice(i, j);
		F();
	});
},
St = function() {
	document.body.innerHTML = '<table id="new_tab"></table>';
	table = document.getElementById('new_tab');
	ids = prompt('What IDs would you like to extract? (space-delimited)').split(' ');
	jQuery.get('/render.php?page=booking_bkSelect', function(data){Go(0);});
};
Ld('http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', St);
})(window.document);
