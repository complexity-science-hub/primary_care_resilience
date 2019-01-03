function Buttons() {
 	InfoBox();
    BasicInfos();
    // FlowControl();
}   


/////////////////////////////////////////////
InfoBox = function() {
	// here we create the info box at the upper right corner
	// where information of the running processes will 
	// be reported

    var info = L.control();
    info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
          //this.update();
			this._div.id = "info"; // and id="info"
          return this._div;
        };
    info.addTo(mymap);

    $("#info").append("Status:<br>");

	$('#info').hover(function() {
			$(this).css("background", "rgba(250,250,250,0.6)");
	}, function() {
			$(this).css("background", "rgba(167,167,167,0.6)");
	});

	$('#info').click( function() {
		$(this).html("");
	});
}

function BasicInfos() {
	// here we create the static info box at the lower
	// left corner

	// var info = L.control({ position: 'bottomleft' });
	var info = L.control();
	info.setPosition("bottomleft");

	info.onAdd = function () {
    	this._div = L.DomUtil.create('div', 'basic_info'); // create a div with a class "info"
    	this._div.id = "basic_info"; // and same id
    	return this._div;
	};

	info.addTo(mymap);

	$('#basic_info').prepend(
		'Click on a doctor (circle) to display the patient sharing network.'+
		'<br>Click again to hide the links.'+
		'<br>Long-click or SHIFT-click to remove a doctor.'+
		'<br><b>Doctor positions are randomized within a district.</b>'
		);

	$('#basic_info').hover(function() {
			$(this).css("background", "rgba(250,250,250,0.6)");
	}, function() {
			$(this).css("background", "rgba(167,167,167,0.6)");
	});

	///// the following is just to test scrolling.
	///// no utility so far
	///// we can use this to display more info on a pop up
	///// window, called by the alert function
	$("#basic_info").mousedown( function(e) {
    // this will fire when you click it
    	//alert("more extensive info goes here");

    	if(e.which==2) { // middle mouse button
	    	$("#basic_info").fadeOut(100).fadeIn(100);
	    	$('#basic_info').prepend('##########################<br>');
	    	for(var i=0; i<10; i++) {
	    		$('#basic_info').prepend(String(i)+' nice!<br>');
	    	}
	    	//$("#basic_info").animate({ scrollTop: 9999 }, 5000);
    	}
  });
}

function FlowControl() {
	// Creates navigation buttons at the bottom right 
	// and associates both animations and tasks

	// var info = L.control({ position: 'bottomleft' });
	var flowcontrol = L.control();
	flowcontrol.setPosition("bottomright");

	flowcontrol.onAdd = function () {
    	this._div = L.DomUtil.create('div', 'flow_control'); // create a div with a class
    	this._div.id = "flow_control"; // and same id
    	return this._div;
	};

	flowcontrol.addTo(mymap);

	$('#flow_control').append("<table id='flow_tbl'></table>");
	$('#flow_tbl').append("<tr>"+
		"<td id='reset_btn'></td>"+
		"<td id='play_btn'></td>"+
		"<td id='step_btn'></td>"+
		"</tr>"
	);

	$('#reset_btn').html("<img src='img/reset.png' alt='reset' width='42'>");
	$('#play_btn' ).html("<img src='img/play.png'  alt='play'  width='42'>");
	$('#step_btn' ).html("<img src='img/step.png'  alt='step'  width='42'>");

	$('#reset_btn img,#play_btn img,#step_btn img').hover(function() {
				$(this).attr("width", "52");
		}, function() {
				$(this).attr("width", "42");
		});

	$('#reset_btn').click( function() {
		location.reload(true);
	});
	
	$('#play_btn img').click( function() {
		var type = $(this).attr('alt');
		//console.log(type);
		if(type=='play') {
			$(this).attr("src", 'img/pause.png');
			$(this).attr("alt", 'pause');
		} else {
			$(this).attr("src", 'img/play.png');
			$(this).attr("alt", 'play');
		}
	});
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
function logoCSH()
{

    $('.leaflet-top.leaflet-left')
        .append('<img class="csh_logo" width="100px" src="./img/CSH_Logo.png"/></br>');

    $('.leaflet-top.leaflet-left')
        .append('<img class="csh_logo" width="100px" src="./img/LogoSM.png"/>');
}