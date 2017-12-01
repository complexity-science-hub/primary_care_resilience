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