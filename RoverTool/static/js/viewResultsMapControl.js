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
var lines = [];

//******************************************************************************************************
//initialize - the function called on first loading the page - userStory1
function initialize() {
    $("[name='my-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
      locked = state;
      setTextState(state);
    });   
  var mapOptions = {
    zoom: mapZoomConstant,
    center: new google.maps.LatLng(-23.3695439,-69.8597406),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  // google.maps.event.addListener(map, 'click', function(event) {
  //       if(locked == false)
  //       {
  //           latitude = event.latLng.lat();
  //           longitude = event.latLng.lng();
  //           mapZoom = map.getZoom();
  //          setTimeout("placeMarker("+latitude+","+longitude+","+null+")", 600);
  //        }
  //        else
  //       {
  //         lockToggleButtonBlink();
  //       }    
  // });//function for map click
}//initialize
//******************************************************************************************************
//constructMainOperationDiv - to construct the divs for two selects
function constructMainOperationDiv() {

  
}//constructMainOperationDiv

//******************************************************************************************************
//placeMarker - called to place the markers and associate events based on lat lng value
//and also update the json correspondingly
function placeMarker(latitude,longitude,backEndJson) {
  
  console.log("Map zoom "+mapZoom+" map.getZoom "+map.getZoom());
  if(mapZoom == map.getZoom()){
    console.log("placing marker"+latitude+" "+longitude);
       var marker = new google.maps.Marker({
          position: new google.maps.LatLng(latitude,longitude),
          map: map,
          title: "Lat : "+latitude+" Long : "+longitude,
          draggable:true
      });
      // map.panTo(marker.getPosition());
       //console.log("getPos" +marker.getPosition());
       var taskDetails = {};


       if(backEndJson!=null) {
        taskpoints = backEndJson;
       }
       else {
         taskDetails.lat = latitude;
         taskDetails.lng = longitude;
          //taskpoints.push(new google.maps.LatLng(latitude,longitude));
         taskpoints.push(taskDetails);
        } 
          count++;
          if(count>1 ) {
            drawline();
           }

  $("[name='my-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
    marker.setDraggable(!state);
  });

   google.maps.event.addListener(marker,'click',function(event){
          if($('.row-task-offcanvas').hasClass("taskappear")) {
            $('.row-task-offcanvas').removeClass("taskappear");
            $('.row-task-offcanvas').addClass("taskdisappear");
          }
          else if($('.row-task-offcanvas').hasClass("taskdisappear")) {
            $('.row-task-offcanvas').removeClass("taskdisappear");
            $('.row-task-offcanvas').addClass("taskappear");
          }
          $('.task-group-item').attr('tabindex', '');
          
          fillTaskPane(marker); //To open the operation pane and perform tasks using it
          //Check - added as of Nov 29
          constructMainOperationDiv();
  }); //event handler for single click

    google.maps.event.addListener(marker, 'rightclick', function(event) {
      if(locked == false)
      {
          bootbox.dialog({
              message: "Do you want to duplicate or delete the marker?",
              title: "Alert box",
              buttons: {
                success: {
                  label: "Duplicate",
                  className: "btn-success",
                  callback: function() {
                  var location = new google.maps.LatLng(marker.position.lat() + 0.05,marker.position.lng() + 0.05);
                  var marker = new google.maps.Marker({
                  position: location,
                  map: map,
                  title: "Lat : "+marker.position.lat() + 0.05+" Long : "+marker.position.lng() + 0.05,
                  draggable:true,
                  animation:google.maps.Animation.DROP
                  });
                  var taskDetails = {};
                  taskDetails.lat = marker.position.lat() + 0.05;
                  taskDetails.lng = marker.position.lng() + 0.05;
                  taskpoints.push(taskDetails);
                  drawline();
                 
                }
                },
                danger: {
                  label: "Delete",
                  className: "btn-danger",
                  callback: function() {
                    marker.setMap(null);
                    var i=0;
                    for(i=0;i<taskpoints.length;i++)
                      {
                        if(marker.position.lat()==taskpoints[i].lat&&marker.position.lng()==taskpoints[i].lng)
                        {
                          
                          for(j=i;j<taskpoints.length;j++)
                          {
                            taskpoints[j]=taskpoints[j+1];
                          }
                          taskpoints.pop();
                          console.log("Taskpoints "+taskpoints);
                          drawline();

                          toastr.options.positionClass ="toast-bottom-right";
                          toastr.success('Marker deleted!','');
                        }
                      }//for
                  }
                }
              }
            });
      }
      else
      {
        lockToggleButtonBlink();
      }
    });//event handler for right click

    google.maps.event.addListener(marker, 'dragstart', function(event) {
      if(locked == false)
      {
          for(i=0;i<taskpoints.length;i++)
            {
              if(marker.position.lat()==taskpoints[i].lat&&marker.position.lng()==taskpoints[i].lng)
              {
                  markerchanged = i;
              }
            }//for    
      }
      else
      {
        lockToggleButtonBlink();
      }
    });//event handler for drag start

    google.maps.event.addListener(marker, 'drag', function(event) {
      if(locked == false)
      {          
          marker.title = "Lat : "+marker.position.lat()+" Long : "+marker.position.lng();
          var taskDetails1 = {};
                  taskDetails1.lat = marker.position.lat();
                  taskDetails1.lng = marker.position.lng();
                  //taskpoints.push(taskDetails);

          taskpoints[markerchanged]=taskDetails1;
          drawline();
      }
      else
      {
        lockToggleButtonBlink();
      }

    });//event handler for drag

    google.maps.event.addListener(marker, 'dragend', function(event) {
      if(locked == false)
      {
        
         marker.title = "Lat : "+marker.position.lat()+" Long : "+marker.position.lng();
         var taskDetails1 = {};
         taskDetails1.lat = marker.position.lat();
         taskDetails1.lng = marker.position.lng();
         taskpoints[markerchanged]=taskDetails1;
         drawline(); 
      }                  
      else
      {
        lockToggleButtonBlink();
      }
    });//event handler for drag end

  }
 }//place marker

//******************************************************************************************************
//drawLine - Function to draw the line between the markers that are placed
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
  var polyline= new google.maps.Polyline(polylineOptions);
  lines.push(polyline);
  polyline.setMap(map);

  //To draw green lines for smart Target
  for(iterator=0;iterator<taskpoints.length;iterator++) {  
    var nextIterator = iterator+1;
    if(taskpoints[iterator].spectraSmartTarget && taskpoints[iterator].spectraSmartTarget == "Yes" && taskpoints[nextIterator] && taskpoints[nextIterator]!=undefined) {
      var smartTargetTaskPoints = []; 
      smartTargetTaskPoints.push(taskpoints[iterator]);
      smartTargetTaskPoints.push(taskpoints[nextIterator]);
      var greenPolylineOptions={
              path:smartTargetTaskPoints,
                strokeColor: '#33CC33',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                geodesic: true,
                zIndex: 10
              };  
      var greenPolyline = new google.maps.Polyline(greenPolylineOptions);     
      lines.push(greenPolyline);   
      greenPolyline.setMap(map);
    } 
  }     

} //function drawline   

//******************************************************************************************************
//drawMarker - Function called when the latitude longitutde values are given
//and it is required to pane between them
function drawMarker() {
  
    var latitudeValue = parseFloat(document.getElementById('latValue').value);
    var longitudeValue = parseFloat(document.getElementById('lngValue').value);
    placeMarker(latitudeValue,longitudeValue,null);
  
 } //draw marker    
  
//******************************************************************************************************  
//viewMarkers - function to call placemarker for viewing plan
function viewMarkers(markerJSON, planName){
  var i =0;
  clearMap();
  for(i=0;i<markerJSON.length;i++){
    if(i==0) {
      var ltLg = new google.maps.LatLng(markerJSON[i].lat,markerJSON[i].lng);
      map.panTo(ltLg);
    }
    placeMarker(markerJSON[i].lat,markerJSON[i].lng,markerJSON);
    // fillValue(markerJSON[i]);
  }
  $('#planNameDisplay').text(planName);
}//viewMarkers

//******************************************************************************************************
//clearMap - clears all the markers off the map
function clearMap()
{
  lines = [];
  taskpoints = [];

  $('#planNameDisplay').text('');       //clearing plan name
    var mapOptions = {
    zoom: mapZoomConstant,
    center: new google.maps.LatLng(-23.3695439,-69.8597406),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };

   map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
   google.maps.event.addListener(map, 'click', function(event) {
      if(locked == false) {
          latitude = event.latLng.lat();
          longitude = event.latLng.lng();
          mapZoom = map.getZoom();
         setTimeout("placeMarker("+latitude+","+longitude+","+null+")", 600);
       }
       else {
          lockToggleButtonBlink();
       }    
  });    
} //clearMap

//******************************************************************************************************
 google.maps.event.addDomListener(window, 'load', initialize);

