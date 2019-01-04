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
var fraction_accepted = 0.15; // 15% of accepted patients
var line_anim_steps = 15; //number of interpolation steps for growing the links


//color for circles
var coleur = chroma.scale(['lightgreen', 'red']).mode("lab").domain([0,fraction_accepted]);
//color for links (waves)
// var catcol = chroma.scale(['#14a38f', '#fafa6e' ,'#482777', '#ff9355']).mode('lch').colors(4);
// var catcol = chroma.scale(['#14a38f' ,'#ffffb3','#fb8072','#fdb462','#b3de69','#fccde5']).mode('lch').colors(9);
    // chroma.scale(['#14a38f', '#fafa6e' ,'#fafa6e']).mode('lch').colors(4);
var catcol = chroma.scale(['yellow', 'blue', '#ff164a','#0f0' , 'pink' ]).mode('lch').colors(5);
//chroma.scale(['#14a38f', '#fafa6e' , '#482777', '008ae5']).colors(7);
var bezirkcolors = ['#eff3ff','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#084594'];

//turns logging on and off
var log = false;

//definitions for creating the edge thickness
var line_norm = 1500; //normalize by 5000 patients
var line_scale = 60;  //scale line thickness by

var simrunning = false;
var functioncount = 0; //indicates is > 0 when the simulation is running

var allreferred = 0; //number of patients that were referred by removing doctors


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