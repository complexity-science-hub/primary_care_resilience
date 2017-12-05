// "small" Utility functions

function printInfo(text) {
  $('#info').prepend(text);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Activity2Radius(a) {
// from activity a determines circle radius 

  var rmin = 500; 
  var rmax = 3000;

  return rmin + (rmax-rmin)*a/activity_max;

} 

function Activity2Color(a) {
// from activity a determines circle radius 

  var huemax = 120;
  var huemin = 0;

  var hue = Math.floor(huemin+(huemax-huemin)*(1.0-a/activity_max));

  return "hsl("+hue+",100%,50%)";

}

function Acquired2Color(a, i) {

// from acquired nr of patients determines circle radius 
// a = current nr of patients
// i = initial nr of patients

  var huemax = 120;
  var huemin = 0;
  var f = (a-i)/i;

  var hue = Math.floor(huemin+(huemax-huemin)*(1.0-f));

  return "hsl("+hue+",100%,50%)";

} 

function KillCircle(circle) {

  //clearLinks();

  printInfo(
      //"<p>"+
      "Removing doctor with "+
      "Id="+circle.doc_id.toString()+"<br>"
      //+"</p>"
  );
  
  delete circle_list[circle.doc_id];
  mymap.removeLayer(circle);

}

function UpdateCircle(circle) {

    var activity = Doc_list[circle.doc_id].activity;
    var initial = Doc_list[circle.doc_id].initial_patients;

    var oldradius = circle.getRadius();
    var radius = Activity2Radius(activity);
    // console.log("radius: " + oldradius + ", " + radius);

   //circle.setRadius(radius); //Activity2Radius(activity)
    circle.setStyle({fillColor: Acquired2Color(activity, initial)});
    growCircle(circle, radius, oldradius, 1, 0, true);
}

var duration = 500;
function growCircle(circ, maxradius, curradius, increase, tstep, first) {

    var span, numsteps;
    if(first)
    {
        span = maxradius - curradius;
        numsteps = span / increase;
        tstep = duration / numsteps;
        first = false;
    }

    curradius += increase;
    circ.setRadius(curradius);

    if(curradius <= maxradius)
        setTimeout(growCircle, tstep, circ, maxradius, curradius, increase, tstep, first);
}

function clearLinks() {
  if(link_list.length>0) {
    for(i in link_list) {
        mymap.removeLayer(link_list[i]);
    }
  }
  link_list = [];
}

function DrawLinks(docid) {
// show the links from docid to others
// used in static situations to show weights

  var doctor = Doc_list[docid]; // recalls a global var

              for(var j=0; j<doctor.links.length; j+=1) {
                var doc2 = Doc_list[doctor.links[j]];
                var w = doctor.weights[j];
                var lat_from = doctor.lat;
                var lng_from = doctor.lng;
                var lat_to = doc2.lat;
                var lng_to = doc2.lng;

                if(w<1e-2) continue; // do not show links under 1%

                var line_width = w*100; // transform into line width
                var polyline = L.polyline([
                    [lat_from, lng_from],
                    [lat_to, lng_to]
                    ],
                    {
                        color: "blue",
                        weight: line_width,
                        opacity: .7,
                        lineJoin: 'round'
                    }
                    ).addTo(mymap);

                link_list.push(polyline);

                doctor.links_displayed = true;
              }
}

function DrawRedirectedLinks(docid) {
// show the links from docid to others
// used when patients aredirected

  var doctor = Doc_list[docid]; //recalls a global var

              for(var j=0; j<doctor.links.length; j+=1)
              {

                var doc2 = Doc_list[doctor.links[j]];
                var w = doctor.weights[j];
                var lat_from = doctor.lat;
                var lng_from = doctor.lng;
                var lat_to = doc2.lat;
                var lng_to = doc2.lng;

                if(w<1e-2) continue; // do not show links under 1%

                var line_width = w*100; // transform into line width
                var polyline = L.polyline([
                    [lat_from, lng_from],
                    [lat_from, lng_from]
                    ],
                    {
                        color: "blue",
                        weight: line_width,
                        opacity: 0.5,
                        lineJoin: 'round'
                    }
                    ).addTo(mymap);

                var p0 = new geo_point(lat_from, lng_from);
                var p1 = new geo_point(lat_to, lng_to);

                var direction = {};

                animateLink(polyline, p0, p1, 50, 0, direction, true, 1000);
                link_list.push(polyline);

                doctor.links_displayed = true;
              }


    function geo_point(lat, lng) {
        this.lat = parseFloat(lat);
        this.lng = parseFloat(lng);
    }

    function animateLink(pline, p_start, p_end, max_step, cur_step, stepdir, first, duration)
    {
        cur_step++;

        if(first)
        {
            var deltalat, deltalng, steplat, steplng;
            deltalat = p_end.lat - p_start.lat;
            deltalng = p_end.lng - p_start.lng;
            steplat = deltalat/max_step;
            steplng = deltalng/max_step;
            stepdir = new geo_point(steplat, steplng);

            first = false;
        }

        var currentlat = p_start.lat + cur_step*stepdir.lat;
        var currentlng = p_start.lng + cur_step*stepdir.lng;

        var latlng= [];
        var l0 = L.latLng(p_start.lat, p_start.lng);
        var l1 = L.latLng(currentlat, currentlng);
        latlng.push(l0);
        latlng.push(l1);

        //set updated line
        pline.setLatLngs(latlng);

        if(cur_step <= max_step)
            setTimeout(animateLink, 100, pline, p_start, p_end, max_step, cur_step, stepdir, first, duration)

    }
}
