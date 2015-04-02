var map;
var taskpoints=[]; 
var templateTasks = {}
var count=0;
var lattitude;
var longitude;
var mapZoomConstant = 10;
var mapZoom = mapZoomConstant;
var markerchanged;
var eee;
var locked = false;
var lines = [];
var allMarkers = [];

//******************************************************************************************************
//setTextState - to set the task fields to be disabled/not based on lock/unlock state
function setTextState(state) {

  var taskFieldIds = ["bufValue", 
  "mmrsExposureValue","mmrsAccumulationValue","mmrsNumberValue","sciencePanValue", "scienceTiltValue","imageStartAzimuthValue",
  "imageEndAzimuthValue","imageStartElevationValue","imageEndElevationValue","spectraStartAzimuthValue",
  "spectraEndAzimuthValue","spectraStartElevationValue","spectraEndElevationValue", "spectraAngularValue", "preciseMoveValue",
  "spectraAngularCamera","spectraNavcamRecord","spectraSmartTargetValue","selectTemplate","selectOperation",
  "addOperation","createTemplateButton","navcamValue","markerName"];
  var taskCloseButtons = ["operationCloseBUF", "operationCloseMMRS","operationCloseScienceImage","operationCloseImagePanorama","operationCloseSpectraPanorama","operationClosePreciseMove",
  "operationCloseSmartTarget","operationCloseNavCam","operationCloseDrill"];

  var drillIterator = $("#drillIterator").val(); //drillIterator value
  drillIterator = parseInt(drillIterator);

   if(state == true) {
    // //locked is true    
    // $("#saveTaskButton").removeClass("show");
    // $("#saveTaskButton").addClass("hide");

    $("#addDrill").removeClass("inlineshow");
    $("#addDrill").addClass("hide");

    for(iterator in taskFieldIds) {
      $("#"+taskFieldIds[iterator]).attr("disabled","");
    }
    for(iterator in taskCloseButtons) {
      $("#"+taskCloseButtons[iterator]).removeClass("show");
      $("#"+taskCloseButtons[iterator]).addClass("hide");
    }
    for(iterator=1;iterator<=drillIterator;iterator++) {
     $("#drillValue"+iterator).attr("disabled",""); 
     $("#drillSave"+iterator).attr("disabled",""); 
     $("#drillSaveImage"+iterator).attr("disabled",""); 
     $("#buf"+iterator).attr("disabled",""); 
     $("#mmrs"+iterator).attr("disabled",""); 

     $("#drillClose"+iterator).removeClass("visibile");
     $("#drillClose"+iterator).addClass("vishide");
    }
  }
  else if(state == false) {
    //locked is false

    // $("#saveTaskButton").removeClass("hide");
    // $("#saveTaskButton").addClass("show");

    $("#addDrill").removeClass("hide");
    $("#addDrill").addClass("inlineshow");

    for(iterator in taskFieldIds) {
     
      $("#"+taskFieldIds[iterator]).removeAttr("disabled");
    }
    for(iterator in taskCloseButtons) {
      $("#"+taskCloseButtons[iterator]).addClass("show");
      $("#"+taskCloseButtons[iterator]).removeClass("hide");
    }
   for(iterator=1;iterator<=drillIterator;iterator++) {
     $("#drillValue"+iterator).removeAttr("disabled"); 
     $("#drillSave"+iterator).removeAttr("disabled"); 
     $("#drillSaveImage"+iterator).removeAttr("disabled"); 
     $("#buf"+iterator).removeAttr("disabled"); 
     $("#mmrs"+iterator).removeAttr("disabled",""); 

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
    if($('#planNameDisplay').text() ==""){
    locked = true

    }  
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
  ajaxForLoadingSiteCoords();


}//initialize

function ajaxForLoadingSiteCoords(){
  //console.log("ajax")
  $.ajax({
         type:"POST",
         url:'/DBOperation/',
         data: {
                'operation': 'loadSiteCoords',  
                },
         success: function(response){
            if (response!=undefined)
            {
              data = plotCoords(response);
              $('#comment').val(data)
            }

            
         }
  });
}

function plotCoords(response){

  var data = "";
  var color=['#FF00EE','#FF0000','#FFFF00','#0000FF','#00FF00','#F0F0F0','#0F0F0F','#0FFFF0']
  for(i=0;i<response.siteName.length;i++)
  {
    var siteBoundaries=[]
    data = data + response.siteName[i] + "\n" + response.coords[i]+ "\n";

    for(j=0;j<response.coords[i].length;j++)
    {

       siteBoundaries.push(new google.maps.LatLng(response.coords[i][j].split(",")[0], response.coords[i][j].split(",")[1]));
    }
    preebb = siteBoundaries;
    drawSite(siteBoundaries,color[i%8])
  }
return data;
}

function drawSite(siteBoundaries,color) {
  site = new google.maps.Polygon({
    paths: siteBoundaries,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35
  });

  site.setMap(map);
}

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
     drawline();
}//saveTaskDetails

//******************************************************************************************************
//clearTaskTextFields - Function to clear radios drillAndSave, onlyDrill, 
//also to clear checkboxes drillImage, spectraAngularCamera, spectraNavcamRecord, spectraSmartTarget , preciseMove 
function clearTaskTextFields() {
  $("#spectraAngularCamera").removeAttr("checked");
  $("#spectraNavcamRecord").removeAttr("checked");
  //$("#spectraSmartTarget").removeAttr("checked");
  //$("#preciseMove").removeAttr("checked");
  
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
    //todo - uncomment this.
    //clearTaskTextFields(); //Clears the text fields initially 
    //console.log("Calling fillTaskPane on click of marker");
    for(i=0;i<taskpoints.length;i++)
      {
        //console.log("the marker lat pos "+marker.position.lat()+" and "+taskpoints[i].lat);
        //console.log("the marker lng pos "+marker.position.lng()+" and "+taskpoints[i].lng);
        var markerFixedLat = marker.position.lat().toFixed(11);
        var markerFixedLng = marker.position.lng().toFixed(11);
        var taskFixedLat = taskpoints[i].lat.toFixed(11);
        var taskFixedLng = taskpoints[i].lng.toFixed(11);
        if(markerFixedLat==taskFixedLat&&markerFixedLng==taskFixedLng)
          {
            //console.log("Yes it matches");
            fillValue(taskpoints[i]); //To fill text fields if already exists
          }
      }  
    initializeDrill(); //For initializing the drill fields
}//fillTaskPane

//******************************************************************************************************
//fillValue - To fill the taskpane text fields based on values from the json
function fillValue(taskDetails){
  aish = taskDetails;
    for(i in taskDetails){
        //console.log("Coming to the loop");
        var key = i;
        var value = taskDetails[i];
        if(key && key!= undefined && key!= null) {
          var documentNode = $("#"+key);
          var nodeType = $("#"+key).attr("type");
          if(nodeType == "text" || nodeType == "hidden") {
            if(documentNode && documentNode!= undefined && documentNode!= null) {
              //console.log("in fill value "+key+" and "+value);
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
 
  var taskCheckBoxIds = ["spectraAngularCamera", "spectraNavcamRecord"];//, "spectraSmartTarget" , "preciseMove" ];
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


// Nov 29
//******************************************************************************************************
//initializeOperationDiv - to initalize the divs for two selects
function initializeOperationDiv(taskpoints) {

  $("#operationDiv").children().remove(); 
  $("#mainOperationDiv").children().remove(); 

  var currentTaskPoint;
  var latitudeValue = document.getElementById("lat").value;
  var longitudeValue = document.getElementById("lng").value;

  for(taskDetailsIterator in taskpoints) {
    if(taskpoints[taskDetailsIterator].lat && taskpoints[taskDetailsIterator].lng && taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
      currentTaskPoint = taskDetailsIterator;
      break;
    }
  }

  existingMarkerNames = []; //to validate if the new markers name is unique on changing

  for(taskDetailsIterator in taskpoints) {
    if(taskpoints[taskDetailsIterator].markerName && taskpoints[taskDetailsIterator].markerName != undefined) {
      var markerName = taskpoints[taskDetailsIterator].markerName;
      existingMarkerNames.push(markerName);
    } 
  }
  
  var currentTaskDetails = taskpoints[currentTaskPoint];
  var markerNameValue = currentTaskDetails['markerName']; //The one that is auto generated while creating marker itself

  var markerName = jQuery('<input>',{
    id:'markerName',
    type:'text',    
    class:'form-control taskText',
    placeholder:'Unique Marker Name',
    value:markerNameValue
  }).hide();
 
  markerName.focusout(function() {
    $("#markerName").removeClass("text-error");
    var currentMarkerNameValue = $('#markerName').val();
    var existingFlag = false; //Check for uniqueness with existing marker name values

    if(currentTaskDetails['markerName'] != currentMarkerNameValue) {
      for(existingMarkerName in existingMarkerNames) {    
        if(currentMarkerNameValue == existingMarkerNames[existingMarkerName]) {
          existingFlag = true; //indicates that there is a marker name with the same value as entered
        }  
      }
      
      if(existingFlag == false) {
          currentTaskDetails['markerName'] = currentMarkerNameValue;        
      }
      else {
        //indicates that there is a marker name with the same value as entered
        $("#markerName").addClass("text-error");
        toastr.options.positionClass ="toast-bottom-right";
        toastr.error('Marker name exists already!','');
      }
    }
  });

  var markerNameSpan = jQuery('<span>', {
    class:'list-group-item task-group-item',
    id:'markerNameDiv'
  }).hide().append(markerName);

  var selectTemplate = jQuery('<select>', {
    id:'selectTemplate',
    class:'btn',
    onChange: 'populateTemplate();'
  }).hide().append($("<option>").attr('value','Select Template').text('Select Template'));

  var selectTemplateSpan = jQuery('<span>', {
    class:'list-group-item task-group-item',
    id:'selectTemplateDiv'
  }).hide().append(selectTemplate);

  var selectOperation = jQuery('<select>',{
    id:'selectOperation',
    class:'btn'
  }).hide().append($("<option>").attr('value','Select Operation').text('Select Operation'));

  var operationArray = [
  {val : 'Drill', text: 'Drill'},
  //{val : 'BUF', text: 'BUF'},
  //{val : 'MMRS', text: 'MMRS'},
  {val : 'Science Image', text: 'Science Image'},
  {val : 'Image Panorama', text: 'Image Panorama'},
  {val : 'Spectra Panorama', text: 'Spectral Panorama'},
  {val : 'Precise Move', text: 'Precise Move'},
  {val : 'Smart Target', text: 'Smart Target'},
  {val : 'Nav Cam', text: 'Nav Cam'},
  ];

  $(operationArray).each(function() {
     selectOperation.append($("<option>").attr('value',this.val).text(this.text));
  });

  $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'operation': 'fetchTemplates',

                },
         success: function(data){
              for(i = 0; i < data.templateName.length; i++){
               selectTemplate.append($("<option>").attr('value',data.templateName[i]).text(data.templateName[i])); 
              }
             
         }
      });

  var addButton = jQuery('<input>',{
    type:'button',
    id:'addOperation',
    value:'Add',
    class:'btn btn-primary',
    onClick:'constructDiv();'
  });

  var selectOperationSpan = jQuery('<span>', {
    class:'list-group-item task-group-item',
    id:'selectOperationDiv'
  }).hide().append(selectOperation," &nbsp; ",addButton);

  $("#mainOperationDiv").append(markerNameSpan);
  $("#mainOperationDiv").append(selectTemplateSpan);
  $("#mainOperationDiv").append(selectOperationSpan);

  markerName.show();
  markerNameSpan.show();
  selectTemplate.show();
  selectTemplateSpan.show();
  selectOperation.show();
  selectOperationSpan.show();

}//initializeOperationDiv

// Nov 29
//******************************************************************************************************
//populateOperationDiv - to populate div based on taskpoints (if present)
function populateTemplate(){
var task = []
  $("#operationDiv").children().remove();
  $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'operation': 'getTemplateDetails',
                'template_name': $('#selectTemplate').val()
                },
         success: function(result){
              task.push(result)
               populateTemplateDetails(task)

              }
             
         
      });
}

function populateTemplateDetails(taskDetails) {

  hh = taskDetails;
  var currentTaskpoint;
  var latitudeValue = document.getElementById("lat").value;
  var longitudeValue = document.getElementById("lng").value;

  for(taskDetailsIterator in taskpoints) {
    if(taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
      currentTaskpoint = taskDetailsIterator;
      break;
    }
  }
  var lat = taskpoints[currentTaskpoint].lat;
  var lng = taskpoints[currentTaskpoint].lng;

  taskpoints[currentTaskpoint] = {};
  taskpoints[currentTaskpoint].markerName = $('#markerName').val();
  taskpoints[currentTaskpoint].lat = lat;
  taskpoints[currentTaskpoint].lng = lng;
  
 for(i =0; i<taskDetails.length;i++){

    //todo
    //if(taskDetails[i]['drillValue'])
    var occured = 0;
    var drillCount = parseInt(taskDetails[i].drillIterator);
    $("#drillIterator").val(taskDetails[i].drillIterator);
    $("#drillCount").val(taskDetails[i].drillCount);
    for(k=0;k<=drillCount;k++) {
      
      var drillValue = taskDetails[i]['drillValue'+k];
      if(drillValue && drillValue!=undefined ) {
        occured++;
        var drillSaveValue = taskDetails[i]['drillSave'+k];
        var drillSaveImageValue = taskDetails[i]['drillSaveImage'+k];
        var drillBufValue = taskDetails[i]['buf'+k];
        var drillMmrsValue = taskDetails[i]['mmrs'+k];

        //console.log("the occured is"+occured);
        if(occured == 1) { //This should happen only once

            constructDrillDiv(currentTaskpoint,"Drill",drillValue,drillSaveValue,drillSaveImageValue); 
          }   
        makeDrillDivs(currentTaskpoint,k,drillValue,drillSaveValue,drillSaveImageValue,drillBufValue,drillMmrsValue);
      }
    }
   
    if(taskDetails[i]['bufValue'] && taskDetails[i]['bufValue']!=undefined) {
      
      constructBufDiv(currentTaskpoint,"BUF",taskDetails[i]['bufValue']);
      // remove this from the select option
      $("#selectOperation option[value='BUF']").remove();
    }
    if(taskDetails[i]['mmrsExposureValue'] && taskDetails[i]['mmrsExposureValue']!=undefined && taskDetails[i]['mmrsAccumulationValue'] && taskDetails[i]['mmrsAccumulationValue']!=undefined && taskDetails[i]['mmrsNumberValue'] && taskDetails[i]['mmrsNumberValue']!=undefined) {
      var mmrsExposureValue = taskDetails[i]['mmrsExposureValue'];
      var mmrsAccumulationValue = taskDetails[i]['mmrsAccumulationValue'];
      var mmrsNumberValue = taskDetails[i]['mmrsNumberValue'];
      constructMmrsDiv(currentTaskpoint,"MMRS",mmrsExposureValue,mmrsAccumulationValue,mmrsNumberValue);
      //remove this from the select option
      $("#selectOperation option[value='MMRS']").remove();
    }
    if(taskDetails[i]['sciencePanValue'] && taskDetails[i]['sciencePanValue']!=undefined && taskDetails[i]['scienceTiltValue'] && taskDetails[i]['scienceTiltValue']!=undefined ) {
      var sciencePanValue = taskDetails[i]['sciencePanValue'];
      var scienceTiltValue = taskDetails[i]['scienceTiltValue'];
      constructScienceImageDiv(currentTaskpoint,"Science Image",sciencePanValue,scienceTiltValue);
      //remove this from the select option
      $("#selectOperation option[value='Science Image']").remove();
    }
    if(taskDetails[i]['imageStartAzimuthValue'] && taskDetails[i]['imageStartAzimuthValue']!=undefined && taskDetails[i]['imageEndAzimuthValue'] && taskDetails[i]['imageEndAzimuthValue']!=undefined && taskDetails[i]['imageStartElevationValue'] && taskDetails[i]['imageStartElevationValue']!=undefined && taskDetails[i]['imageEndElevationValue'] && taskDetails[i]['imageEndElevationValue']!=undefined) {
      var imageStartAzimuthValue = taskDetails[i]['imageStartAzimuthValue'];
      var imageEndAzimuthValue = taskDetails[i]['imageEndAzimuthValue'];
      var imageStartElevationValue = taskDetails[i]['imageStartElevationValue'];
      var imageEndElevationValue = taskDetails[i]['imageEndElevationValue'];
      constructImagePanoramaDiv(currentTaskpoint,"Image Panorama",imageStartAzimuthValue,imageEndAzimuthValue,imageStartElevationValue,imageEndElevationValue);
      //remove this from select option
      $("#selectOperation option[value='Image Panorama']").remove();
    }
    if(taskDetails[i]['spectraStartAzimuthValue'] && taskDetails[i]['spectraStartAzimuthValue']!=undefined && taskDetails[i]['spectraEndAzimuthValue'] && taskDetails[i]['spectraEndAzimuthValue']!=undefined && taskDetails[i]['spectraStartElevationValue'] && taskDetails[i]['spectraStartElevationValue']!=undefined && taskDetails[i]['spectraEndElevationValue'] && taskDetails[i]['spectraEndElevationValue']!=undefined && taskDetails[i]['spectraAngularValue'] && taskDetails[i]['spectraAngularValue']!=undefined) {
     var spectraStartAzimuthValue = taskDetails[i]['spectraStartAzimuthValue'];
     var spectraEndAzimuthValue = taskDetails[i]['spectraEndAzimuthValue'];
     var spectraStartElevationValue = taskDetails[i]['spectraStartElevationValue'];
     var spectraEndElevationValue = taskDetails[i]['spectraEndElevationValue'];
     var spectraAngularValue = taskDetails[i]['spectraAngularValue'];
     var spectraAngularCamera = "no"; 
       var spectraNavcamRecord = "no";
       if(taskDetails[i]['spectraAngularCamera'] && taskDetails[i]['spectraAngularCamera']!=undefined ) {
        var spectraAngularCamera = "Yes"; 
       }
       if(taskDetails[i]['spectraNavcamRecord'] && taskDetails[i]['spectraNavcamRecord']!=undefined ) {
        var spectraNavcamRecord = "Yes"; 
       }
     constructSpectraPanoramaDiv(currentTaskpoint,"Spectra Panorama",spectraStartAzimuthValue,spectraEndAzimuthValue,spectraStartElevationValue,spectraEndElevationValue,spectraAngularValue,spectraAngularCamera,spectraNavcamRecord);
     //remove this from select option
     $("#selectOperation option[value='Spectra Panorama']").remove();
    }
    if(taskDetails[i]['spectraSmartTargetValue'] && taskDetails[i]['spectraSmartTargetValue']!=undefined) {
      var spectraSmartTargetValue = taskDetails[i]['spectraSmartTargetValue'];
      constructSmartTargetDiv(currentTaskpoint,"Smart Target",spectraSmartTargetValue);
      //remove this from select option
      $("#selectOperation option[value='Smart Target']").remove();
    }  
    if(taskDetails[i]['preciseMoveValue'] && taskDetails[i]['preciseMoveValue']!=undefined) {
      var preciseMoveValue = taskDetails[i]['preciseMoveValue'];
      constructPreciseMoveDiv(currentTaskpoint,"Precise Move",preciseMoveValue);
      //remove this from select option
      $("#selectOperation option[value='Precise Move']").remove();
    }
    if(taskDetails[i]['navcamValue'] && taskDetails[i]['navcamValue']!=undefined) {
      var navcamValue = taskDetails[i]['navcamValue'];
      constructNavcamDiv(currentTaskpoint,"Nav Cam",navcamValue);
      //remove this from select option
      $("#selectOperation option[value='Nav Cam']").remove();
    }
  }
  setTextState(locked); //Set the text state accordingly
}//populateOperationDiv

function populateOperationDiv(taskpoints) {

  var currentTaskpoint;
  var latitudeValue = document.getElementById("lat").value;
  var longitudeValue = document.getElementById("lng").value;

  for(taskDetailsIterator in taskpoints) {
    if(taskpoints[taskDetailsIterator].lat && taskpoints[taskDetailsIterator].lng && taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
      currentTaskpoint = taskDetailsIterator;
      break;
    }
  }
  if(taskpoints[taskDetailsIterator].lat && taskpoints[taskDetailsIterator].lng) {

    //value exists, need to populate based on currentTaskPoint
     var taskDetails = taskpoints[currentTaskpoint];
    //todo - do for drill also
    initializeDrill();
    // if(taskDetails['bufValue'] && taskDetails['bufValue']!=undefined) {
    //   var bufValue = taskDetails['bufValue'];
    //   constructBufDiv(currentTaskpoint,"BUF",bufValue);
    //   // remove this from the select option
    //   $("#selectOperation option[value='BUF']").remove();
    // }
    if(taskDetails['mmrsExposureValue'] && taskDetails['mmrsExposureValue']!=undefined && taskDetails['mmrsAccumulationValue'] && taskDetails['mmrsAccumulationValue']!=undefined && taskDetails['mmrsNumberValue'] && taskDetails['mmrsNumberValue']!=undefined) {
      var mmrsExposureValue = taskDetails['mmrsExposureValue'];
      var mmrsAccumulationValue = taskDetails['mmrsAccumulationValue'];
      var mmrsNumberValue = taskDetails['mmrsNumberValue'];
      constructMmrsDiv(currentTaskpoint,"MMRS",mmrsExposureValue,mmrsAccumulationValue,mmrsNumberValue);
      //remove this from the select option
      $("#selectOperation option[value='MMRS']").remove();
    }
    if(taskDetails['sciencePanValue'] && taskDetails['sciencePanValue']!=undefined && taskDetails['scienceTiltValue'] && taskDetails['scienceTiltValue']!=undefined ) {
      var sciencePanValue = taskDetails['sciencePanValue'];
      var scienceTiltValue = taskDetails['scienceTiltValue'];
      constructScienceImageDiv(currentTaskpoint,"Science Image",sciencePanValue,scienceTiltValue);
      //remove this from the select option
      $("#selectOperation option[value='Science Image']").remove();
    }
    if(taskDetails['imageStartAzimuthValue'] && taskDetails['imageStartAzimuthValue']!=undefined && taskDetails['imageEndAzimuthValue'] && taskDetails['imageEndAzimuthValue']!=undefined && taskDetails['imageStartElevationValue'] && taskDetails['imageStartElevationValue']!=undefined && taskDetails['imageEndElevationValue'] && taskDetails['imageEndElevationValue']!=undefined) {
      var imageStartAzimuthValue = taskDetails['imageStartAzimuthValue'];
      var imageEndAzimuthValue = taskDetails['imageEndAzimuthValue'];
      var imageStartElevationValue = taskDetails['imageStartElevationValue'];
      var imageEndElevationValue = taskDetails['imageEndElevationValue'];
      constructImagePanoramaDiv(currentTaskpoint,"Image Panorama",imageStartAzimuthValue,imageEndAzimuthValue,imageStartElevationValue,imageEndElevationValue);
      //remove this from select option
      $("#selectOperation option[value='Image Panorama']").remove();
    }
    if(taskDetails['spectraStartAzimuthValue'] && taskDetails['spectraStartAzimuthValue']!=undefined && taskDetails['spectraEndAzimuthValue'] && taskDetails['spectraEndAzimuthValue']!=undefined && taskDetails['spectraStartElevationValue'] && taskDetails['spectraStartElevationValue']!=undefined && taskDetails['spectraEndElevationValue'] && taskDetails['spectraEndElevationValue']!=undefined && taskDetails['spectraAngularValue'] && taskDetails['spectraAngularValue']!=undefined) {
     var spectraStartAzimuthValue = taskDetails['spectraStartAzimuthValue'];
     var spectraEndAzimuthValue = taskDetails['spectraEndAzimuthValue'];
     var spectraStartElevationValue = taskDetails['spectraStartElevationValue'];
     var spectraEndElevationValue = taskDetails['spectraEndElevationValue'];
     var spectraAngularValue = taskDetails['spectraAngularValue'];
     var spectraAngularCamera = "no"; 
       var spectraNavcamRecord = "no";
       if(taskDetails['spectraAngularCamera'] && taskDetails['spectraAngularCamera']!=undefined ) {
        var spectraAngularCamera = "Yes"; 
       }
       if(taskDetails['spectraNavcamRecord'] && taskDetails['spectraNavcamRecord']!=undefined ) {
        var spectraNavcamRecord = "Yes"; 
       }
     constructSpectraPanoramaDiv(currentTaskpoint,"Spectra Panorama",spectraStartAzimuthValue,spectraEndAzimuthValue,spectraStartElevationValue,spectraEndElevationValue,spectraAngularValue,spectraAngularCamera,spectraNavcamRecord);
     //remove this from select option
     $("#selectOperation option[value='Spectra Panorama']").remove();
    }
    if(taskDetails['spectraSmartTargetValue'] && taskDetails['spectraSmartTargetValue']!=undefined) {
      var spectraSmartTargetValue = taskDetails['spectraSmartTargetValue'];
      constructSmartTargetDiv(currentTaskpoint,"Smart Target",spectraSmartTargetValue);
      //remove this from select option
      $("#selectOperation option[value='Smart Target']").remove();
    }  
    if(taskDetails['preciseMoveValue'] && taskDetails['preciseMoveValue']!=undefined) {
      var preciseMoveValue = taskDetails['preciseMoveValue'];
      constructPreciseMoveDiv(currentTaskpoint,"Precise Move",preciseMoveValue);
      //remove this from select option
      $("#selectOperation option[value='Precise Move']").remove();
    }
    if(taskDetails['navcamValue'] && taskDetails['navcamValue']!=undefined) {
      var navcamValue = taskDetails['navcamValue'];
      constructNavcamDiv(currentTaskpoint,"Nav Cam",navcamValue);
      //remove this from select option
      $("#selectOperation option[value='Nav Cam']").remove();
    }
  }   
  setTextState(locked); //Set the text state accordingly
}//populateOperationDiv

// Nov 29
//******************************************************************************************************
//constructMainOperationDiv - to construct the divs for two selects
function constructMainOperationDiv() {

  initializeOperationDiv(taskpoints); //construct the basic divs for select operations first
  //todo - the code/function for templates
  populateOperationDiv(taskpoints);

}//constructMainOperationDiv

//******************************************************************************************************
//ajaxForConfigUpdate - to make ajax calls to update the dedault config values in the home page
function ajaxForConfigUpdate() {
  $.ajax({
         type:"POST",
         url:'/',
         data: {
                'operation': 'operationConfig',  
                },
         success: function(response){
          eve = response
              // populateOperationConfig(response);
               updateDefaultValues(response);
         }
  });
}

//******************************************************************************************************
//placeMarker - called to place the markers and associate events based on lat lng value
//and also update the json correspondingly
function placeMarker(latitude,longitude,backEndJson,duplicateFlag,index) {
  
  //console.log("Map zoom "+mapZoom+" map.getZoom "+map.getZoom());
  //console.log("Place marker");
  if(mapZoom == map.getZoom()){
    //console.log("placing marker"+latitude+" "+longitude+" duplicate position "+index);
          var marker = new google.maps.Marker({
          position: new google.maps.LatLng(latitude,longitude),
          map: map,
          title: "Lat : "+latitude+" Long : "+longitude,
          draggable:true
      });
      allMarkers.push(marker);
      //console.log("marker is "+marker);
      eeeee = marker;
      // map.panTo(marker.getPosition());
       ////console.log("getPos" +marker.getPosition());
       var taskDetails = {};


       if(duplicateFlag == true ) {
            //todo - marker name
            //console.log("duplicate flag marker123333");
            taskpoints = backEndJson;
            
            newLatitude = marker.position.lat();
           newLongitude = marker.position.lng();
           newOpr = {};
            var backUpLat, backUpLng;
            var lastMarker = {};

                  if(index > -1)
                  {
                    for(j = index; j <= taskpoints.length ; j++)
                    {
                      if(j == taskpoints.length)
                      {
                        var lastMarker = newOpr;
                        lastMarker.lat = newLatitude;
                        lastMarker.lng = newLongitude;
                        //lastMarker.markerName = taskpoints[j-1].markerName + "-01";
                        
                        taskpoints.push(lastMarker)
                        break;
                      }
                      else
                      {
                        backUpOpr = $.extend({}, taskpoints[j]);
                        backUpLat = taskpoints[j].lat;
                        backUpLng = taskpoints[j].lng;  

                        taskpoints[j] = newOpr;
                        taskpoints[j].lat = newLatitude;
                        taskpoints[j].lng = newLongitude;


                        newLatitude = backUpLat;
                        newLongitude = backUpLng;
                        newOpr = backUpOpr;
                      }
                    }


                    //console.log("*************"+index)
                    var tempLat = taskpoints[index].lat;
                    var tempLng = taskpoints[index].lng;
                    taskpoints[index] = $.extend({}, taskpoints[index-1]);
                    taskpoints[index].lat = tempLat;
                    taskpoints[index].lng = tempLng;
                    oldMarkerName = "";
                    oldMarkerName = taskpoints[index -1].markerName;

                    var origMarker = oldMarkerName.split("-dup")[0];
                    var hiddenDupFieldName = origMarker+"dupCount";
                    var numDup = $("#"+hiddenDupFieldName).val();

                    if(numDup != undefined)
                    {
                      var newDupCount = numDup.split("-dup")[1];
                      var newDupName = oldMarkerName.split("-dup")[0] + "-dup" + (parseInt(newDupCount)+1);
                      taskpoints[index].markerName = newDupName;
                      $("#"+hiddenDupFieldName).val(newDupName);
                    }
                    else
                    {
                     taskpoints[index].markerName = oldMarkerName + "-dup1";
                     $('<input>').attr({
                        type: 'hidden',
                        id: oldMarkerName+"dupCount",
                        value:oldMarkerName+"-dup1",
                    }).insertAfter('#drillIterator');
                    }
                      
                  }
         }
         else {
              //console.log("Duplicate flag false or null : "+duplicateFlag);
             if(backEndJson!=null) {
              var maxNumber = 0;
              taskpoints = backEndJson;
              for(markerIterator in taskpoints) { 
                //console.log(taskpoints[markerIterator].markerName);
                var tempMarkerName = taskpoints[markerIterator].markerName;
                var tempMaxNumber = tempMarkerName.split("-")[tempMarkerName.split("-").length-1];
                //console.log(tempMaxNumber);
                maxNumber = parseInt(maxNumber);
                tempMaxNumber = parseInt(tempMaxNumber);
                //console.log("max n "+maxNumber+"temp max n"+tempMaxNumber);
                if(tempMaxNumber>maxNumber) {
                  maxNumber = tempMaxNumber;
                }
              }
              //console.log(" max no "+maxNumber);
              
              var markerCount = parseInt(maxNumber)+1;
              $('#markerCount').val(markerCount);
             }
             else {
              //Check - added as of 30 March
             taskDetails.lat = marker.position.lat();
             taskDetails.lng = marker.position.lng();
             var markerCount = $('#markerCount').val();
             var markerNameValue;
             if(operationMarkerNameDefault == undefined || operationMarkerNameDefault.trim() == "") {           
               markerNameValue = "Location"+"-"+markerCount; 
             } else {
               markerNameValue = operationMarkerNameDefault+"-"+markerCount;          

             }
             // taskDetails.markerName = markerNameValue;       
             // markerCount = parseInt(markerCount)+1;
             // $('#markerCount').val(markerCount);


             //////////////////////////////todo - check /////////////////////////////////////////////
             ////////////////////////////////////////////////////////////////////////////////////////
             
             var iteratorFlag = false;
              for(taskDetailsIterator in taskpoints) {
                  if(taskpoints[taskDetailsIterator].markerName && taskpoints[taskDetailsIterator].markerName != undefined) {
                    var markerName = taskpoints[taskDetailsIterator].markerName;
                    if(markerName == markerNameValue) {
                      //not unique
                      while(markerName == markerNameValue) {
                          var markerCount = $('#markerCount').val();
                           if(operationMarkerNameDefault == undefined || operationMarkerNameDefault.trim() == "") {           
                             markerNameValue = "Location"+"-"+markerCount; 
                           } else {
                             markerNameValue = operationMarkerNameDefault+"-"+markerCount;          
                           }   
                           //console.log("*** inside while loop"+markerCount);
                           markerCount = parseInt(markerCount)+1;
                           $('#markerCount').val(markerCount);
                           iteratorFlag = true;
                        }
                      }
                  } 
                }
                
                taskDetails.markerName = markerNameValue;  
                if(iteratorFlag == false) {
                  markerCount = parseInt(markerCount)+1;
                  $('#markerCount').val(markerCount);   
                }                

             ////////////////////////////////////////////////////////////////////////////////////////

             taskpoints.push(taskDetails);
            }
         }

          count++;
          if(count>1 ) {
            drawline();
           }

  $("[name='my-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
    marker.setDraggable(!state);
  });


  //////////////////////////////////////////////////////////////////////////////////

  // google.maps.event.addListener(marker,'mouseover',function(event){
  //         var marker_lat = marker.position.lat();
  //         var marker_lng = marker.position.lng();
  //         var latitude_name = "Latitude: ";
  //         var longitude_name = "Longitude: ";
  //         var comma = " , ";
  //         var toast_msg = latitude_name + marker_lat + comma +longitude_name + marker_lng;
  //         toastr.options.positionClass ="toast-bottom-right";
  //         toastr.options.showDuration = 300;
  //         toastr.options.timeOut = 2000;
  //         toastr.options.extendedTimeOut = 500;
  //         toastr.info(toast_msg);

  // }); //event handler for marker hover

  google.maps.event.addListener(map, 'mousemove', function (event) {
              displayCoordinates(event.latLng);               
  }); // event handler for updating latitude and longitude values at the footer

  function displayCoordinates(point) {

          var lat = point.lat();
          lat = lat.toFixed(8);
          var lng = point.lng();
          lng = lng.toFixed(8);
          document.getElementById("latitude-value").innerHTML = lat;
          document.getElementById("longitude-value").innerHTML = lng;
          //console.log("Latitude: " + lat + "  Longitude: " + lng);
      }

  /////////////////////////////////////////////////////////////////////////////////////

   google.maps.event.addListener(marker,'click',function(event){
          drawline(); //to re-draw the lines
          ajaxForConfigUpdate(); // for the ajax call to update the default values
          if($('.row-task-offcanvas').hasClass("taskappear")) {
            $('.row-task-offcanvas').removeClass("taskappear");
            $('.row-task-offcanvas').addClass("taskdisappear");
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
          }
          else if($('.row-task-offcanvas').hasClass("taskdisappear")) {
            $('.row-task-offcanvas').removeClass("taskdisappear");
            $('.row-task-offcanvas').addClass("taskappear");
             marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
          }
          $('.task-group-item').attr('tabindex', '');
          
          fillTaskPane(marker); //To open the operation pane and perform tasks using it
          //Check - added as of Nov 29
          constructMainOperationDiv();

  }); //event handler for single click

    google.maps.event.addListener(marker, 'rightclick', function(event) {
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
      if(locked == false)
      {
          bootbox.dialog({
              message: "Do you want to duplicate or delete the marker?",
              title: "Duplicate/Delete",
              buttons: {
                success: {
                  label: "Duplicate",
                  className: "btn-success",
                  callback: function() {
                    //console.log("blikkkkkkkkkk");
                    //console.log("old lat "+marker.position.lat()+" old lng "+marker.position.lng());
                    var newLatitude = marker.position.lat() + parseFloat(0.05);
                    var newLongitude = marker.position.lng() + parseFloat(0.05);
                    //console.log("new lat "+newLatitude+ " new long "+newLongitude);
                  var selectedMarker={};
                  selectedMarker.lat=marker.position.lat();
                  selectedMarker.lng=marker.position.lng();
                  //var taskDetails = {};
                  //taskDetails.lat = newMarker.position.lat();
                  //taskDetails.lng = newMarker.position.lng();
                  index=-1;
                  for(i=0;i<taskpoints.length;i++)
                  {
                    if(taskpoints[i].lat==selectedMarker.lat && taskpoints[i].lng==selectedMarker.lng)
                    {
                      index=i;
                      break;
                    }
                  }
                   placeMarker(newLatitude,newLongitude,taskpoints,true,index+1);

                 // var backUpLat, backUpLng;

                 //  if(index > -1)
                 //  {
                 //    for(j = index+1; j <= taskpoints.length ; j++)
                 //    {
                 //      if(j == taskpoints.length)
                 //      {
                 //        var taskTemp = {};
                 //        taskTemp.lat = newLatitude;
                 //        taskTemp.lng = newLongitude;
                 //        taskpoints.push(taskTemp)
                 //        break;
                 //      }
                 //      else
                 //      {
                 //        backUpLat = taskpoints[j].lat;
                 //        backUpLng = taskpoints[j].lng;  

                 //        taskpoints[j].lat = newLatitude;
                 //        taskpoints[j].lng = newLongitude;

                 //        newLatitude = backUpLat;
                 //        newLongitude = backUpLng;
                 //      }
                 //    }
                 //  }
                  //taskpoints.pop();
                  
                  //placeMarker(taskpoints[index+1].lat,taskpoints[index+1].lng,taskpoints,true,index+1);
                  //taskpoints.push(taskDetails);
                  //drawLine();

                 
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
                          //console.log("Taskpoints "+taskpoints);
                          drawline();

                          $('.row-task-offcanvas').removeClass("taskappear");
                          $('.row-task-offcanvas').addClass("taskdisappear");

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
      pb = marker;
      he = taskpoints;
      if(locked == false)
      {
          for(i=0;i<taskpoints.length;i++)
            {
              if(marker.position.lat()==taskpoints[i].lat&&marker.position.lng()==taskpoints[i].lng)
              {
                  markerchanged = i;
              }
            }//for 
            //console.log("---->"+markerchanged);
            //markerchanged+=1;
     
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');

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

          //console.log("the marker changed in drag is -------"+markerchanged);

          var oldLatitude = taskpoints[markerchanged].lat;
          var oldLongitude = taskpoints[markerchanged].lng;


          var latitudeValue = $("#lat").val();
          var longitudeValue = $("#lng").val();

          if(oldLatitude == latitudeValue && oldLongitude == longitudeValue) {
            $("#lat").val(marker.position.lat());
            $("#lng").val(marker.position.lng());
          }
          //taskpoints[markerchanged]=taskDetails1;
          taskpoints[markerchanged].lat = marker.position.lat();
          taskpoints[markerchanged].lng = marker.position.lng();
          marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');       
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
         //taskpoints[markerchanged]=taskDetails1;

            //console.log("the marker changed in drag end is -------"+markerchanged);

          var oldLatitude = taskpoints[markerchanged].lat;
          var oldLongitude = taskpoints[markerchanged].lng;

          var latitudeValue = $("#lat").val();
          var longitudeValue = $("#lng").val();

          if(oldLatitude == latitudeValue && oldLongitude == longitudeValue) {
            $("#lat").val(marker.position.lat());
            $("#lng").val(marker.position.lng());
          }
          taskpoints[markerchanged].lat = marker.position.lat();
          taskpoints[markerchanged].lng = marker.position.lng();
         marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
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
  for(var i=0;i<allMarkers.length;i++) {
     allMarkers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
  }
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
    if(taskpoints[iterator].spectraSmartTargetValue && taskpoints[iterator].spectraSmartTargetValue != undefined && taskpoints[nextIterator] && taskpoints[nextIterator]!=undefined) {
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
  if(locked == false)
  {
    var location = (document.getElementById('latLngValue').value).split(',');
    placeMarker(parseFloat(location[0]),parseFloat(location[1]),null);
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
  //$('#planNameDisplay').text('');       //clearing plan name
    var mapOptions = {
    zoom: mapZoomConstant,
    center: new google.maps.LatLng(-23.3695439,-69.8597406),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };


   $('.row-task-offcanvas').removeClass("taskappear");
   $('.row-task-offcanvas').addClass("taskdisappear");  
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
function mapPanTo(lat, lon)
{
  var ltLg = new google.maps.LatLng(parseFloat(lat), parseFloat(lon))
  map.panTo(ltLg);
  map.setZoom(mapZoomConstant);
  //$(".selectedSite").text(name)
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

//************************************Create Template Validations**********************************************
 google.maps.event.addDomListener(window, 'load', initialize);
 
function createTemplate(){
  var flag = false;
    var latitudeValue = document.getElementById("lat").value;
      var longitudeValue = document.getElementById("lng").value;  
    for(taskDetailsIterator in taskpoints) {  
    if(taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
      templateTasks = taskpoints[taskDetailsIterator];
      }
    }
    if(Object.keys(templateTasks).length <= 3){ // tasks should have other than the three keys (lat,lng,markername) to create a template
   
       toastr.options.positionClass ="toast-bottom-right";                                        
       toastr.error('Please add operations to create a template',''); 
               
    }
    else{
      flag = true
    }

    if(flag == true){
       $('#templateModal').modal('show');
//       bootbox.prompt("Template Name:", function(result) {                
//   if (result == "" || result == " " ) {     
//     toastr.options.positionClass ="toast-bottom-right";                                        
//     toastr.error('Please provide a template name','');  
//     flag = false;                            
//   }

//   else if(result != null)  {
//     $.ajax({                              //ajax call for validating if template already exist
//        type:"POST",
//        url:"/DBOperation/",
//        data: {
//               'template_name': result,   
//               'operation': 'validateTemplateName',
//               },
//        success: function(response){
//           if(response.count == 0)
//           {
//            saveTemplate(result,tasks)    
//           } 
//           else{
//             toastr.options.positionClass ="toast-bottom-right";                                        
//             toastr.error('Template name already exists','');           
//           }
//        }
//       });
//   } 
// });

    }

    
   
    //saveTemplate(result,tasks)
                              
  //}
//});

}
 
function saveTemplate(result,tasks){
  $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'markers': JSON.stringify(tasks),    //constains lat, lon
                'name':result,
                'operation': 'createTemplate',
                },
         success: function(data){
             //populatePlan(response)
             toastr.options.positionClass ="toast-bottom-right";
             toastr.success('Template Created','');
         }
      });
  } 
 

