function Start() {
  Initmap();
  DrawBezirk();
  Buttons();
  logoCSH();
}

function Initmap() {

  	// set up the map
  	mymap = new L.Map('mapid');

    //create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    //var osmUrl='http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
  	//var osmUrl='http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';

  	var osmAttrib='VDPS, JCS @CSH | Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 13, attribution: osmAttrib});

  	// start the map in Austria
    //mymap.setView(new L.LatLng(47.488, 12.881),7); // whole Austria
    mymap.setView(new L.LatLng(47.1666, 9.9095),10); // Vorarlberg
  	mymap.addLayer(osm);
  	mymap.setMaxZoom(11);

    mymap.doubleClickZoom.disable();
    mymap.boxZoom.disable();

    // how to disable all possible zoom mechanisms //
    // mymap.dragging.disable();
    // mymap.touchZoom.disable();
    // mymap.scrollWheelZoom.disable();
    // mymap.boxZoom.disable();
    // mymap.keyboard.disable();
    // if (mymap.tap) mymap.tap.disable();

}

var bzrkcolor = 1;
function DrawBezirk() {
    var bc;
    $.getJSON("./data/vorarlberg.geojson", function(bc) {

      function style(feature) {
        return {
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.5,
          fillColor: getBezirkColor(bzrkcolor++)
        };
      }

      L.geoJson(bc, {
          style: style
          //onEachFeature: onEachFeature
      }).addTo(mymap);

      DrawDoctors();

    });
}

function DrawDoctors() {

    $("#info").append("- Loading Doc info...");

    var docs;

    $.getJSON("./data/docnet.json", function(docs)
    {
        //averaging doc activity to quarterly - assuming the activity in the data describes a two year period
        for(var i in docs)
        {
            var avg_activity = parseInt(docs[i].activity);
            docs[i].activity = Math.floor(avg_activity / 8);
        }

      var max = 0;
      for(var i in docs)
      {
        var activity = docs[i].activity;
        if(max<activity) max = activity;

        docs[i].links_displayed = false; // useful to know when links are on
        Doc_list[docs[i].docid] = docs[i]; // build dict of docs
        docs[i].initial_patients = activity; // initial nr of patients
      }
      activity_max = max;

      for(var i in docs) {
        var doctor = docs[i];
        var circle = L.circle([doctor.lat, doctor.lng], {
            color: 'black',
            weight: 1,
            fillColor: Acquired2Color(doctor.activity, doctor.initial_patients),
            fillOpacity: 0.8,
            radius: Activity2Radius(doctor.activity)
        }).addTo(mymap);

        circle_list[doctor.docid] = circle;

        circle.doc_id = doctor.docid;

        circle.bindPopup(
            // "<br />BZ:"+doctor.district_name.toString()+
            "Current activity: "+doctor.activity.toString()+
            "<br />patients per quarter",

            {
                className: 'my-popup',
              offset: new L.Point(0,-20)
            }
        );
        circle.on('mouseover', function (e)
        {
              this.setStyle( {
                fillOpacity: 0.5,
                color: 'gray'
              });
              this.openPopup();
          });
        circle.on('mouseout', function (e)
        {
              this.setStyle( {
                fillOpacity: 0.8,
                color: 'black'
              });
              this.closePopup();
        });
        circle.on('mousedown', function (e) {

              var doctor = Doc_list[this.doc_id]; // recalls a global var

            clearTimeout(Window.downTimer);
            Window.downTimer = setTimeout(function () {
                RemoveDoctor(doctor.docid);
            }, 1000);

              if(e.originalEvent.altKey || e.originalEvent.shiftKey)
              {
                RemoveDoctor(this.doc_id);
                return;
              }
              else
              {
                  $('#info').html(
                      //"<p>"+
                      // "Id: " + this.doc_id.toString() + "<br>" +
                      "Bezirk: " + doctor.district_name.toString() + "<br>" +
                      "Activity: " + doctor.activity.toString() + "<br>"
                      //+"</p>"
                  );
                  this.setStyle({
                      fillOpacity: 0.5,
                      color: 'white'
                  });

                    if(functioncount < 1)
                    {
                        clearLinks();

                        if (doctor.links_displayed) { // if links are on already, set them off
                            doctor.links_displayed = false;
                            return;
                        }

                        ShowLinks(this.doc_id);

                        //if the mouse remains clicked for >1sec the doc is removed

                    }
              }
          });
      }
        getTotalPats();

    });

    $("#info").append("<br>- ...done");
}

//used to clear the timer for the long-press doc removal
$(window).mouseup(function(e) {
    clearTimeout(Window.downTimer);
});

// show the links from docid to others
// sets polyline pop-up
function ShowLinks(docid)
{

  var doctor = Doc_list[docid]; // recalls a global var

              for(var j=0; j<doctor.links.length; j+=1) {
                var doc2 = Doc_list[doctor.links[j]];
                var w = doctor.weights[j];
                var lat_from = doctor.lat;
                var lng_from = doctor.lng;
                var lat_to = doc2.lat;
                var lng_to = doc2.lng;

                if(w<1e-2) continue; // do not show links under 1%

                var line_width = 2 + w*60; // transform into line width

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
                polyline.bindPopup(
                      Math.floor(100*w).toString()+"% of the activity"+
                      "<br />will be referred to the linked PCP.",
                    {className: 'my-popup'}
                );

                polyline.on('click', function (e) {
                  clearLinks();
                });

                polyline.on('mouseover', function (e)
                {
                  this.setStyle( {
                    color: 'red'
                  })
                  this.openPopup();
                });

                polyline.on('mouseout', function (e)
                {
                  this.setStyle( {
                    color: 'blue'
                  })
                  this.closePopup();
                });
              }
}
