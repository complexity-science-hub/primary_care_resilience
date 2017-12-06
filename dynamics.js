// look at the end of the file for a description of
// the global variable Doc_list[]

RemoveDoctor = function(docid) {
// this function is triggered when a doctor is removed
// i.e. when SHIFT-click or ALT-click is pressed
// docid: the id of the doctor to be removed

    //reset the list of excluded docs & the remaining patients
    excluded = [];
    Remainder = {};

	clearLinks(); 					// remove all links from the map;
    // we have to remove the instances of docid from all neighboring docs
    // and renormalise their weights accordingly
    removeLinkFromDocs(Doc_list[docid].links, docid);

    // SpreadPatients(docid);
    DistributePatients(docid, Doc_list[docid].activity);

    DrawRedirectedLinks(docid, true);
	// setTimeout(SpreadPatients, 1000, docid); 			// spread among his neighbors
};


// SpreadPatients = function(docid) {
// // distributes the patients of the removed docid to his neighbors according to link weights
//
// 	var doc = Doc_list[docid]; // this is the guy we are going to kill
// 	var activity = doc.activity;
// 	var links = doc.links;
// 	var w = doc.weights;
// 	var rest; // nr of patients not accepted by neighbor
//     // var excluded = [docid]; // do not include these doctors in the cascade
// 	// var Remainder = {};
//
// 	//1st wave: move patients to other (linked doctors)
//     for(var i=0; i<links.length; i++)
//     {
// 		var d = Math.round(activity * w[i]); 	// amount of patients to transfer
// 		var to = links[i]; 						// ID of receiving doctor
// 		// Doc_list[to].activity = d + parseInt(Doc_list[to].activity);
//
// 		if(d>0) {
// 			rest  = AssignPatients(to, d);
// 			excluded.push(to);
// 			if(rest>0) {
// 				Remainder[to] = rest;
// 			}
// 		}
// 	}
//
// 	//2nd wave: distribute the patients that were not accepted on the first try
// 	// i=0;
// 	// for(var key in Remainder) {
// 	// 	i+=1000; // small value to show all cascades simultaneously
// 	// 	rest = Remainder[key];
// 	// 	setTimeout(DistributePatients, i, key, rest, excluded);
// 	// }
//
//     // setTimeout(KillCircle, i+1000, circle_list[docid]);
// };


// distributes nrpatients among the neigbors of docid
// excluding those who already got some (not used at the moment)
DistributePatients = function(docid, nrpatients) {

    // DrawRedirectedLinks(docid);

    var doc = Doc_list[docid];
    var l = doc.links;
    var w = doc.weights;
    var rest;
    var localrest = 0;
    var rejected = 0;

    for(var i in l)
    {
        var to  = l[i];
        var d = Math.round(nrpatients * w[i]);
        localrest += d;

        if(d>0) {
            if($.inArray(to,excluded)<0)
            {
                rest = AssignPatients(to, d);

                if(rest>0)
                {
                    if(Remainder[to] != undefined)
                        console.log("overwriting remainder of doc: " + to); //todo: should not happen when using excluded list
                    else Remainder[to] = 0; //init

                    //todo: once excluded list is used adding should not be necessary
                    Remainder[to] += rest;
                    rejected += rest;
                }
                excluded.push(to);
            }
            // else console.log(to + " has already been visited - skipping.");
        }
    }

    //if(localrest > 0)
        console.log("from " + nrpatients + ", " + localrest + " were forwarded. " + rejected + " were rejected & will be again forwarded. " + (nrpatients - localrest) + " were not forwarded @" + docid);

};



AssignPatients = function(docid, nrpatients) {
// nrpatients patients attempt to pass over doctor docid
// not all of them are accepted, though.
//
// returns the number of patients not accepted

    if(nrpatients==0) return;

    //DrawLinks(docid);

    var fraction_accepted = 0.1; // 10% of accepted patients

    var doc = Doc_list[docid];
    var accepted_patients = Math.floor(fraction_accepted * doc.activity); // assume he will accept 10% of current activity
    // console.log(docid + " will accept " + accepted_patients + " of " + nrpatients + " patients");
    var rest = 0; // patients not assigned
    var assigned = 0; // patients assigned


    if(nrpatients < accepted_patients) {
        assigned = nrpatients;
    } else {
        rest = nrpatients - accepted_patients;
        assigned = accepted_patients;
    }
    doc.activity = assigned + parseInt(doc.activity);
    //printInfo("assigned "+assigned+" patients to doc "+docid+" rest "+rest+"<br>");

    // UpdateCircle(circle_list[docid]);

    return rest;
};



function removeLinkFromDocs(links, docid) {
    // we have to remove the instances of docid from all neighboring docs
    // and renormalise their weights accordingly
    for(var i in links) {
        var id = links[i];
        var doc2 = Doc_list[id];
        var l = doc2.links;
        var ww = doc2.weights;
        var index = $.inArray(docid,l); // might not work on IE8, who cares?
        l.splice(index,1);
        ww.splice(index,1);
        var sum = 0;
        for(var j in ww) { sum += ww[j]; }
        for(var j in ww) { ww[j] /= sum; }
    }
}
