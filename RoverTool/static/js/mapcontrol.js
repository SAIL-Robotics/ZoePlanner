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
//setTextState - to set the task fields to be disabled/not based on lock/unlock state
function setTextState(state) {

  var taskFieldIds = ["bufValue", 
  "mmrsExposureValue","mmrsAccumulationValue","mmrsNumberValue","sciencePanValue", "scienceTiltValue","imageStartAzimuthValue",
  "imageEndAzimuthValue","imageStartElevationValue","imageEndElevationValue","spectraStartAzimuthValue",
  "spectraEndAzimuthValue","spectraStartElevationValue","spectraEndElevationValue", "spectraAngularValue", "preciseMoveValue",
  "spectraAngularCamera","spectraNavcamRecord","spectraSmartTarget","preciseMove","spectraSmartTargetValue"];

  var drillIterator = $("#drillIterator").val(); //drillIterator value
  drillIterator = parseInt(drillIterator);

   if(state == true) {
    //locked is true    
    $("#saveTaskButton").removeClass("show");
    $("#saveTaskButton").addClass("hide");

    $("#addDrill").removeClass("inlineshow");
    $("#addDrill").addClass("hide");

    for(iterator in taskFieldIds) {
      $("#"+taskFieldIds[iterator]).attr("disabled","");
    }
    for(iterator=1;iterator<=drillIterator;iterator++) {
     $("#drillValue"+iterator).attr("disabled",""); 
     $("#drillSave"+iterator).attr("disabled",""); 
     $("#drillSaveImage"+iterator).attr("disabled",""); 

     $("#drillClose"+iterator).removeClass("visibile");
     $("#drillClose"+iterator).addClass("vishide");
    }
  }
  else if(state == false) {
    //locked is false

    $("#saveTaskButton").removeClass("hide");
    $("#saveTaskButton").addClass("show");

    $("#addDrill").removeClass("hide");
    $("#addDrill").addClass("inlineshow");

    for(iterator in taskFieldIds) {
     
      $("#"+taskFieldIds[iterator]).removeAttr("disabled");
    }
   for(iterator=1;iterator<=drillIterator;iterator++) {
     $("#drillValue"+iterator).removeAttr("disabled"); 
     $("#drillSave"+iterator).removeAttr("disabled"); 
     $("#drillSaveImage"+iterator).removeAttr("disabled"); 

     $("#drillClose"+iterator).removeClass("vishide");
     $("#drillClose"+iterator).addClass("visible");
     }
  }
}//setTextState

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
  google.maps.event.addListener(map, 'click', function(event) {
        if(locked == false)
        {
            latitude = event.latLng.lat();
            longitude = event.latLng.lng();
            mapZoom = map.getZoom();
           setTimeout("placeMarker("+latitude+","+longitude+","+null+")", 600);
         }
         else
        {
          lockToggleButtonBlink();
        }    
  });//function for map click
}//initialize

//******************************************************************************************************
//saveTaskDetails - to save the task information given in the textboxes to json 
//and to toggle appearance of the toggle pane
function saveTaskDetails () {  
  var latitudeValue = document.getElementById("lat").value;
  var longitudeValue = document.getElementById("lng").value;
  for(i=0;i<taskpoints.length;i++)
    {
       if(latitudeValue==taskpoints[i].lat&&longitudeValue==taskpoints[i].lng)
         {
           $('.row-task-offcanvas').removeClass("taskappear");
           $('.row-task-offcanvas').addClass("taskdisappear");
           fillTaskDetails(latitudeValue,longitudeValue); //To fill the task points based on the input field values
         }
     } 
}//saveTaskDetails

//******************************************************************************************************
//clearTaskTextFields - Function to clear radios drillAndSave, onlyDrill, 
//also to clear checkboxes drillImage, spectraAngularCamera, spectraNavcamRecord, spectraSmartTarget , preciseMove 
function clearTaskTextFields() {
  $("#spectraAngularCamera").removeAttr("checked");
  $("#spectraNavcamRecord").removeAttr("checked");
  $("#spectraSmartTarget").removeAttr("checked");
  $("#preciseMove").removeAttr("checked");
  
  var taskTextFieldIds = ["bufValue", 
  "mmrsExposureValue","mmrsAccumulationValue","mmrsNumberValue","sciencePanValue", "scienceTiltValue","imageStartAzimuthValue",
  "imageEndAzimuthValue","imageStartElevationValue","imageEndElevationValue","spectraStartAzimuthValue","spectraSmartTargetValue",
  "spectraEndAzimuthValue","spectraStartElevationValue","spectraEndElevationValue", "spectraAngularValue", "preciseMoveValue"];

  for(iterator in taskTextFieldIds) {
    document.getElementById(taskTextFieldIds[iterator]).value = "";
  }
}//clearTaskTextFields

//******************************************************************************************************
//fillTaskPane - To fill the pane based on values retrieved from back end/json
function fillTaskPane(marker) {
    clearTaskTextFields(); //Clears the text fields initially 
    for(i=0;i<taskpoints.length;i++)
      {
        if(marker.position.lat()==taskpoints[i].lat&&marker.position.lng()==taskpoints[i].lng)
          {
            fillValue(taskpoints[i]); //To fill text fields if already exists
          }
      }  
    initializeDrill(); //For initializing the drill fields
}//fillTaskPane

//******************************************************************************************************
//fillValue - To fill the taskpane text fields based on values from the json
function fillValue(taskDetails){
    for(i in taskDetails){
        var key = i;
        var value = taskDetails[i];
        if(key && key!= undefined && key!= null) {
          var documentNode = $("#"+key);
          var nodeType = $("#"+key).attr("type");
          if(nodeType == "text" || nodeType == "hidden") {
            if(documentNode && documentNode!= undefined && documentNode!= null) {
              $("#"+key).val(value);
            }  
          }
          else if(nodeType == "checkbox") {
            if(documentNode && documentNode!= undefined && documentNode!= null) {
              if(value == "Yes") {
                $("#"+key).prop("checked",true)  
              }
            } 
          }
        }
    }     
}//fillValue

//******************************************************************************************************
//fillTaskDetails - To fill the json based on values from the text fields
function fillTaskDetails(latitudeValue,longitudeValue) {
 
  var taskCheckBoxIds = ["spectraAngularCamera", "spectraNavcamRecord", "spectraSmartTarget" , "preciseMove" ];
  var taskTextFieldIds = ["bufValue", 
  "mmrsExposureValue","mmrsAccumulationValue","mmrsNumberValue","sciencePanValue", "scienceTiltValue","imageStartAzimuthValue",
  "imageEndAzimuthValue","imageStartElevationValue","imageEndElevationValue","spectraStartAzimuthValue","spectraSmartTargetValue",
  "spectraEndAzimuthValue","spectraStartElevationValue","spectraEndElevationValue", "spectraAngularValue", "preciseMoveValue"];

  for(taskDetailsIterator in taskpoints) {
      if(taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
        var taskDetails = taskpoints[taskDetailsIterator];
        var drillCount = $("#drillCount").val();
        var drillIterator = $("#drillIterator").val();

        drillCount = parseInt(drillCount);
        drillIterator = parseInt(drillIterator);

        for(drillCountIterator=1;drillCountIterator<=drillIterator;drillCountIterator++) {
          var drillSaveImageNode = "drillSaveImage"+drillCountIterator;
          var drillSaveNode = "drillSave"+drillCountIterator;
          var drillValueNode = "drillValue"+drillCountIterator;
          var drillValue = $("#"+drillValueNode).val();
          
          if(drillValue!="" && drillValue!=null && drillValue!=undefined ) {
            var drillSaveImageSelection = $("#"+drillSaveImageNode).is(":checked");
            var drillSaveSelection = $("#"+drillSaveNode).is(":checked");
            taskDetails[drillValueNode] = drillValue;
            if(drillSaveSelection) {
              taskDetails[drillSaveNode] = "Yes";  
            }
            else {
              //Remove if it already exists and user has opted no
              delete taskDetails[drillSaveNode];
            }
            if(drillSaveImageSelection) {
              taskDetails[drillSaveImageNode] = "Yes";
            }
            else {
              //Remove if it already exists and user has opted no
              delete taskDetails[drillSaveImageNode];
            }
          }
        }
        taskDetails["drillCount"] = drillCount;
        taskDetails["drillIterator"] = drillIterator;

        for(iterator in taskTextFieldIds) {
          var taskValue = document.getElementById(taskTextFieldIds[iterator]).value;

          if(taskValue!="" && taskValue!=null && taskValue!= undefined) {
            //For text  fields  
            var taskDetails = taskpoints[taskDetailsIterator];
            var keyValue = taskTextFieldIds[iterator];
            taskDetails[keyValue] = taskValue;    
          }
          else if(taskValue == "" || taskValue == null) {
            //Check if the key value for text field already exists , IF so delete it
             var taskDetails = taskpoints[taskDetailsIterator];
             var keyValue = taskTextFieldIds[iterator];
             if(taskDetails[keyValue] && taskDetails[keyValue] != undefined) {
              delete taskDetails[keyValue];
             }
          }
        }
        for(iterator in taskCheckBoxIds) {
          //For checkboxes
          var taskSelection = $("#"+taskCheckBoxIds[iterator]).is(":checked");
          if(taskSelection) {
            var taskDetails = taskpoints[taskDetailsIterator];
            var keyValue = taskCheckBoxIds[iterator];
            taskDetails[keyValue] = "Yes";  
          }
          else {
            //Remove if it already exists in the json
           var taskDetails = taskpoints[taskDetailsIterator];
           var keyValue = taskCheckBoxIds[iterator];
           if(taskDetails[keyValue] == "Yes") {
              delete taskDetails[keyValue];
           }
          }
        }
      }
    }
}//fillTaskDetails

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
} //function drawline   

//******************************************************************************************************
//drawMarker - Function called when the latitude longitutde values are given
//and it is required to pane between them
function drawMarker() {
  if(locked == false)
  {
    var latitudeValue = parseFloat(document.getElementById('latValue').value);
    var longitudeValue = parseFloat(document.getElementById('lngValue').value);
    placeMarker(latitudeValue,longitudeValue,null);
  }
  else
  {
    lockToggleButtonBlink();
  }
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
    fillValue(markerJSON[i]);
  }
  locked = true;
  $("[name='my-checkbox']").bootstrapSwitch('state', true); //applying bootstrapswitch CSS to checkbox
  $('#planNameDisplay').text(planName);
}//viewMarkers

//******************************************************************************************************
//clearMap - clears all the markers off the map
function clearMap()
{
  lines = [];
  taskpoints = [];

  locked = false;  
  $("[name='my-checkbox']").bootstrapSwitch('state', false);
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
//mapPanToAtacama - Function to pan the map to Atacama
function mapPanToAtacama()
{
  var ltLg = new google.maps.LatLng(-23.3695439,-69.8597406);
  map.panTo(ltLg);
  map.setZoom(mapZoomConstant);
}//mapPanToAtacama

//******************************************************************************************************
//mapPanToPittsburgh - Function to pan the map to Pittsburgh
function mapPanToPittsburgh()
{
  var ltLg = new google.maps.LatLng(40.440104, -79.946101);
  map.panTo(ltLg);
  map.setZoom(mapZoomConstant);
}//mapPanToPittsburgh

//******************************************************************************************************
//lockToggleButtonBlink - Function that is called every time the lock button
// is required to blink
function lockToggleButtonBlink()
{
  var timer=0;
  var timerObject = setInterval(function(){
  $(".bootstrap-switch-handle-on").toggleClass("red");
  timer++;
  if(timer==4) {
    clearInterval(timerObject);
    }
   },400);
  $('.bootstrap-switch-handle-on').removeClass("red");
}//lockToggleButtonBlink

//******************************************************************************************************
 google.maps.event.addDomListener(window, 'load', initialize);