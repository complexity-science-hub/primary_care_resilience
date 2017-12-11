L_PREFER_CANVAS = true; // this should increase the map update rate by bypassing svg

// var play_pause = true;	// used by the SlowButton
// var play_stop = false;	// used by the StopButton
// var choose_circle = true; // choose between circle and graph dynamics
// var timer_id;			// timer associated to the current setTimeout
// var running_day;		// day number displayed right now
// var runningSim;			// the function that displays things

var circle_list = {};	// list of circles (doctors)
var link_list = [];		// active polyline links on map
var activity_max;       // max activity of a doctor
var Doc_list = {};	// list of doctors indexed by doc_id

var excluded = [];
// var excluded = [docid]; // do not include these doctors in the cascade
var Remainder = {};


var coleur = chroma.scale(['lightgreen', 'red']).mode("lab").domain([0,0.25]);

var catcol = chroma.scale(['#14a38f', '#fafa6e' ,'#fafa6e']).mode('lch').colors(4);


// Doc_list[docid] is a global variable, actually an object with the following properties:
//
// :links_displayed	(a boolean indicating whether doc's links are currently displayed on map)
// :district_name 	(a string with the name of the district the doc belongs to)
// :docid 			(the id of the doctor, which is also the key used in Doc_list[])
// :fg 				(Fachgebiet of the doctor, i.e. his specialisation)
// :group 			(the group the doc belongs to; group=1 coincides with general doctors)
// :lat 			(doc's latitude)
// :lng 			(doc's longitude)
//
// :activity 		(an integer counting the nr of patients)
// :initial_patients (initial nr of patients)
// :links 			(list of doctor IDs this doctor is connected to)
// :weights			(list of weights corresponding to the above links)
//
// these last three properties are very important to build the simulation