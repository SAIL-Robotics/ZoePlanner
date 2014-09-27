var map;
var taskpoints=[]; 
var count=0;
var lattitude;
var longitude;
var mapZoomConstant = 9;
var mapZoom = mapZoomConstant;
var markerchanged;
var eee;
var locked = false;
function initialize() {
    console.log("#initialize");

    $("[name='my-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
      locked = state;
    });

  var mapOptions = {
    zoom: mapZoomConstant,
    center: new google.maps.LatLng(-23.3695439,-69.8597406),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  google.maps.event.addListener(map, 'click', function(event) {

        if(locked == false)
        {
            latitude = event.latLng.lat();
            longitude = event.latLng.lng();
            mapZoom = map.getZoom();
            /*var marker = new google.maps.Marker({
                position: event.latLng,
                map: map
            });*/
           // placeMarker(latitude,longitude);
           setTimeout("placeMarker("+latitude+","+longitude+")", 600);
         }    
  });//function for map click
}

function placeMarker(latitude,longitude) {
  
  console.log("Map zoom "+mapZoom+" map.getZoom "+map.getZoom());
  if(mapZoom == map.getZoom()){
    console.log("placing marker"+latitude+" "+longitude);
       var marker = new google.maps.Marker({
          position: new google.maps.LatLng(latitude,longitude),
          map: map,
          title: "Lat : "+latitude+" Long : "+longitude,
          draggable:true
      });
       map.panTo(marker.getPosition());
       taskpoints.push(new google.maps.LatLng(latitude,longitude));
          count++;
          if(count>1 ) {
            drawline();
           }

  $("[name='my-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
    marker.setDraggable(!state);
  });

   google.maps.event.addListener(marker,'click',function(event){
    if(locked == false)
      {
          $('.row-task-offcanvas').toggleClass('taskdisappear');
          $('.task-group-item').attr('tabindex', '');
      }
  });

    google.maps.event.addListener(marker, 'rightclick', function(event) {
        
          //map.removeOverlay(marker);
      if(locked == false)
      {
          bootbox.dialog({
              message: "Do you want to delete the marker?",
              title: "Alert box",
              buttons: {
                success: {
                  label: "Yes",
                  className: "btn-success",
                  callback: function() {
                    marker.setMap(null);
                    console.log(taskpoints);
                    var i=0;
                    for(i=0;i<taskpoints.length;i++)
                      {
                        if(marker.position.lat()==taskpoints[i].lat()&&marker.position.lng()==taskpoints[i].lng())
                        {
                          
                          for(j=i;j<taskpoints.length;j++)
                          {
                            taskpoints[j]=taskpoints[j+1];
                          }
                          taskpoints.pop();
                          drawline();

                          toastr.options.positionClass ="toast-bottom-right";
                          toastr.success('Marker deleted!','');
                        }
                      }//for
                  }
                },
                danger: {
                  label: "No!",
                  className: "btn-danger"
                }
              }
            });
      }
    });//function for right click

    google.maps.event.addListener(marker, 'dragstart', function(event) {
      if(locked == false)
      {
          for(i=0;i<taskpoints.length;i++)
            {
              if(marker.position.lat()==taskpoints[i].lat()&&marker.position.lng()==taskpoints[i].lng())
              {
                markerchanged=i;
                           
              }
            }//for    
      }
    });
    google.maps.event.addListener(marker, 'drag', function(event) {
      if(locked == false)
      {
          marker.title = "Lat : "+marker.position.lat()+" Long : "+marker.position.lng();
          taskpoints[markerchanged]=(new google.maps.LatLng(marker.position.lat(),marker.position.lng()));
          drawline();
      }

    });
    google.maps.event.addListener(marker, 'dragend', function(event) {
      if(locked == false)
      {
         marker.title = "Lat : "+marker.position.lat()+" Long : "+marker.position.lng();
         taskpoints[markerchanged] = (new google.maps.LatLng(marker.position.lat(),marker.position.lng()));
         drawline(); 
      }                  
    });

  }

 }//place marker

var lines = [];

function drawline() {
  for(var i = 0;i<lines.length;i++)   {
      lines[i].setMap(null);
  }


  var lineSymbol = {
      path:google.maps.SymbolPath.FORWARD_OPEN_ARROW,
      strokeColor:"#DB0000",
      strokeWeight:3,
      scale:2
  };
  var polylineOptions={
              path:taskpoints,
                strokeColor: '#0026b3',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                geodesic: true,
                icons: [{
                    icon: lineSymbol,
                    repeat: '100px',
                    offset: '50%'
                }],
                zIndex: 10
              };
              //}]};
  var polyline= new google.maps.Polyline(polylineOptions);
  lines.push(polyline);
  polyline.setMap(map);
} //function drawline   

function drawMarker() {
  if(locked == false)
  {
    var latitudeValue = document.getElementById('latValue').value;
    var longitudeValue = document.getElementById('lngValue').value;
    placeMarker(latitudeValue,longitudeValue);
  }
 } //draw marker    
  
 google.maps.event.addDomListener(window, 'load', initialize);