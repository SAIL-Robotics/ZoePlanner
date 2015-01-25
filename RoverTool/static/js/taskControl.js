var operationDrillDefault; 
var operationDrillSaveDefault;
var operationDrillSaveImageDefault;
var operationBufDefault; 
var operationMmrsExposureDefault; 
var operationMmrsAccumulationDefault; 
var operationMmrsNumberDefault; 
var operationSciencePanDefault; 
var operationScienceTiltDefault; 
var operationImageStartAzimuthDefault; 
var operationImageEndAzimuthDefault; 
var operationImageStartElevationDefault; 
var operationImageEndElevationDefault; 
var operationSpectraStartAzimuthDefault; 
var operationSpectraEndAzimuthDefault; 
var operationSpectraStartElevationDefault; 
var operationSpectraEndElevationDefault; 
var operationSpectraAngularDefault; 
var operationPreciseMoveDefault; 
var operationSmartTargetDefault; 
var operationMarkerNameDefault;
var operationDrillImagePanoramaValueDefault;
var operationDrillMmrsValueDefault;


//******************************************************************************************************
//updateDefaultValues - to update the default value for the operations in the operation pane
function updateDefaultValues(defaultValues) {
  
  for(i = 0; i < defaultValues.operationName.length; i++)
    {
      if(defaultValues.operationName[i] == "imagePanoramaConfig1")
      operationImageStartAzimuthDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "imagePanoramaConfig2")
      operationImageEndAzimuthDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "imagePanoramaConfig3")
      operationImageStartElevationDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "imagePanoramaConfig4")
      operationImageEndElevationDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "preciseMoveConfig")
      operationPreciseMoveDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "spectraPanoramaConfig3")
      operationSpectraStartElevationDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "spectraPanoramaConfig2")
      operationSpectraEndAzimuthDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "spectraPanoramaConfig1")
      operationSpectraStartAzimuthDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "smartTargetConfig")
      operationSmartTargetDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "BUFConfig")
      operationBufDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "spectraPanoramaConfig5")
      operationSpectraAngularDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "spectraPanoramaConfig4")
      operationSpectraEndElevationDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "MMRSConfig3")
      operationMmrsNumberDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "scienceImageConfig2")
      operationScienceTiltDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "MMRSConfig1")
      operationMmrsExposureDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "MMRSConfig2")
      operationMmrsAccumulationDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "scienceImageConfig1")
      operationSciencePanDefault = defaultValues.operationValue[i]; 
    if(defaultValues.operationName[i] == "markerNameConfig")
      operationMarkerNameDefault = defaultValues.operationValue[i];
  }
  
}//updateDefaultValues


//******************************************************************************************************
//removeFromTaskDetails - to remove the drill div from the task pane
function removeFromTaskDetails(removedId) {
  for(taskDetailsIterator in taskpoints) {
      var latitudeValue = document.getElementById("lat").value;
      var longitudeValue = document.getElementById("lng").value;
      var drillSplit = removedId.split("DrillDiv"); 
      var drillIndex = drillSplit[1]; //It will give actual number

    if(taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
      var removeTaskDetails = taskpoints[taskDetailsIterator];
      if(removeTaskDetails["drillValue"+drillIndex]) {
        delete removeTaskDetails["drillValue"+drillIndex];
      }
      if(removeTaskDetails["drillSave"+drillIndex]) {
        delete removeTaskDetails["drillSave"+drillIndex];
      }
      if(removeTaskDetails["drillSaveImage"+drillIndex]) {
        delete removeTaskDetails["drillSaveImage"+drillIndex];
      } //To delete the three keys from the json if they exist
    }
  }
}//removeFromTaskDetails

//******************************************************************************************************
//initializeDrill - to initialize for creating new drill tasks in a new task pane that is created/opened
function initializeDrill() {
  removeExistingDrill();
  var drillIterator = 1;
  var drillCount = 1;
  var taskDetails = {};
  var currentTaskpoint = 0;

  for(taskDetailsIterator in taskpoints) {
      var latitudeValue = document.getElementById("lat").value;
      var longitudeValue = document.getElementById("lng").value;  

    if(taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
      taskDetails = taskpoints[taskDetailsIterator];
      currentTaskpoint = taskDetailsIterator;
      if(taskDetails["drillCount"]) {
        drillCount = taskDetails["drillCount"]; 
      }
      if(taskDetails["drillIterator"]) {
        drillIterator = taskDetails["drillIterator"]; 
      }     
    }
  }
  $("#drillIterator").val(drillIterator);
  $("#drillCount").val(drillCount);

  fillDrill(currentTaskpoint,drillIterator,drillCount,taskDetails);
}//initializeDrill

//******************************************************************************************************
//removeExistingDrill - Remove the previous drill operations on opening a new instance of task pane 
function removeExistingDrill() {
  $("#drillDiv").find("div[id*='newDrill']").each(function(){
    this.remove();
  });
}//removeExistingDrill

//******************************************************************************************************
//fillDrill - to fill up values of the fields based on the json from backend/one that is constructed
function fillDrill(currentTaskpoint,drillIterator,drillCount,taskDetails) {
  var occured = 0;
  for(iterator=1;iterator<=drillIterator;iterator++) {
        if(taskDetails!=undefined) {
          if(taskDetails["drillValue"+iterator] && taskDetails["drillValue"+iterator]!=null && taskDetails["drillValue"+iterator]!=undefined) {
          //Construct the new divs accordingly
          //todo 
          var operationDrillValue = "";
          var operationDrillSaveValue = "";
          var operationDrillSaveImageValue = "";
          var operationDrillImagePanoramaValue = "";
          var operationDrillMmrsValue = "";
          operationDrillValue = taskDetails["drillValue"+iterator];
          if(taskDetails["drillSave"+iterator] == "Yes") {
            //keep it selected
            operationDrillSaveValue = taskDetails["drillSave"+iterator];
          }
          if(taskDetails["drillSaveImage"+iterator] == "Yes") {
            //keep it selected
            operationDrillSaveImageValue = taskDetails["drillSaveImage"+iterator];
          }

          if(taskDetails["imagePanorama"+iterator] == "Yes") {
            //keep it selected
            operationDrillImagePanoramaValue = taskDetails["imagePanorama"+iterator];
          }

          if(taskDetails["mmrs"+iterator] == "Yes") {
            //keep it selected
            operationDrillMmrsValue = taskDetails["mmrs"+iterator];
          }
          occured++;
          if(occured ==1) { //This should happen only once
            //todo - operationDrillValue keeps repeating next time one person clicks 'Add' button????
            constructDrillDiv(currentTaskpoint,"Drill",operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue); 
          }       
          makeDrillDivs(currentTaskpoint,iterator,operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue,operationDrillImagePanoramaValue,operationDrillMmrsValue);          
        
        }
      } 
    }
}//fillDrill

//******************************************************************************************************
//addDrillDiv - to add a new drill div
function addDrillDiv(currentTaskPoint,drillIterator,drillCount,operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue,operationDrillImagePanoramaValue,operationDrillMmrsValue,operationDrillImagePanoramaValue,operationDrillMmrsValue) {
  console.log("Calling add drill div");
  drillIterator++;
  drillCount++;
  $("#drillIterator").val(drillIterator);
  $("#drillCount").val(drillCount);
  makeDrillDivs(currentTaskPoint,drillIterator,operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue,operationDrillImagePanoramaValue,operationDrillMmrsValue);
  
}//addDrillDiv

//******************************************************************************************************
//makeDrillDivs - to construct html for adding a new drillDiv
function makeDrillDivs(currentTaskPoint,drillIterator,operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue,operationDrillImagePanoramaValue,operationDrillMmrsValue) {
  
  console.log("Calling make drill divs with values ");

  jQuery('<div/>', {
    id: 'newDrillDiv'+drillIterator,
    class:'newDrillDiv',
  }).appendTo('#drillDiv');

  var drillSaveImageCheckBox = jQuery('<input/>', {
  type:'checkbox',
    id: 'drillSaveImage'+drillIterator,
    value: 'drillSaveImage',
  });
  drillSaveImageCheckBox.appendTo('#newDrillDiv'+drillIterator);

  drillSaveImageCheckBox.change(function() { 
    var isChecked = drillSaveImageCheckBox.prop('checked');
    console.log("the value is "+isChecked);
    if(isChecked == true) {
      var taskDetails = taskpoints[currentTaskPoint];
      taskDetails["drillSaveImage"+drillIterator] = "Yes";
    }
    else {
      var taskDetails = taskpoints[currentTaskPoint];
      if(taskDetails["drillSaveImage"+drillIterator] && taskDetails["drillSaveImage"+drillIterator]!=undefined) {
        delete taskDetails["drillSaveImage"+drillIterator];
      }
    }
  });

  jQuery('<label/>',{
  text:'Take picture'
  }).appendTo('#newDrillDiv'+drillIterator);

  jQuery('<br/>',{}).appendTo("#newDrillDiv"+drillIterator);

  //Image panorama
  var imagePanoramaCheckBox = jQuery('<input/>', {
  type:'checkbox',
    id: 'imagePanorama'+drillIterator,
    value: 'imagePanorama',
  });
  imagePanoramaCheckBox.appendTo('#newDrillDiv'+drillIterator);

  imagePanoramaCheckBox.change(function() { 
    var isChecked = imagePanoramaCheckBox.prop('checked');
    console.log("the value is "+isChecked);
    if(isChecked == true) {
      var taskDetails = taskpoints[currentTaskPoint];
      taskDetails["imagePanorama"+drillIterator] = "Yes";
    }
    else {
      var taskDetails = taskpoints[currentTaskPoint];
      if(taskDetails["imagePanorama"+drillIterator] && taskDetails["imagePanorama"+drillIterator]!=undefined) {
        delete taskDetails["imagePanorama"+drillIterator];
      }
    }
  });

  jQuery('<label/>',{
  text:'Image Panorama'
  }).appendTo('#newDrillDiv'+drillIterator);

  jQuery('<br/>',{}).appendTo("#newDrillDiv"+drillIterator);

  //mmrs
  var mmrsCheckBox = jQuery('<input/>', {
  type:'checkbox',
    id: 'mmrs'+drillIterator,
    value: 'mmrs',
  });
  mmrsCheckBox.appendTo('#newDrillDiv'+drillIterator);

  mmrsCheckBox.change(function() { 
    var isChecked = mmrsCheckBox.prop('checked');
    console.log("the value is "+isChecked);
    if(isChecked == true) {
      var taskDetails = taskpoints[currentTaskPoint];
      taskDetails["mmrs"+drillIterator] = "Yes";
    }
    else {
      var taskDetails = taskpoints[currentTaskPoint];
      if(taskDetails["mmrs"+drillIterator] && taskDetails["mmrs"+drillIterator]!=undefined) {
        delete taskDetails["mmrs"+drillIterator];
      }
    }
  });

  jQuery('<label/>',{
  text:'MMRS'
  }).appendTo('#newDrillDiv'+drillIterator);

  jQuery('<br/>',{}).appendTo("#newDrillDiv"+drillIterator);


  $("#newDrillDiv"+drillIterator).append("<span class='drillClose' id='drillClose"+drillIterator+"''>X</span>");

  $("#drillClose"+drillIterator).click(function( event ){
      //To remove the entire parent element
      var removeDiv = event.target;
      var removeParentDiv = removeDiv.parentElement;
      var removedId = removeParentDiv.id;
      removeParentDiv.remove();

      //to remove this from the taskDetails json also
      removeFromTaskDetails(removedId);

      var drillCount = $("#drillCount").val();
      drillCount =parseInt(drillCount);
      drillCount--;
      $("#drillCount").val(drillCount);         
  });

  var drillSaveCheckBox = jQuery('<input/>', {
  type:'checkbox',
    id: 'drillSave'+drillIterator,
    value: 'drillSave',
  });
  drillSaveCheckBox.appendTo('#newDrillDiv'+drillIterator);

  drillSaveCheckBox.change(function() { 
    var isChecked = drillSaveCheckBox.prop('checked');
    console.log("the value is "+isChecked);
    if(isChecked == true) {
      var taskDetails = taskpoints[currentTaskPoint];
      taskDetails["drillSave"+drillIterator] = "Yes";
    }
    else {
      var taskDetails = taskpoints[currentTaskPoint];
      if(taskDetails["drillSave"+drillIterator] && taskDetails["drillSave"+drillIterator]!=undefined) {
        delete taskDetails["drillSave"+drillIterator];
      }
    }
  });

  if(operationDrillSaveValue == "Yes") {
    drillSaveCheckBox.attr('checked','');
  }
  else {
    drillSaveCheckBox.removeAttr('checked');
  }

  if(operationDrillSaveImageValue == "Yes") {
    drillSaveImageCheckBox.attr('checked','');
  }
  else {
    drillSaveImageCheckBox.removeAttr('checked');
  }

  if(operationDrillImagePanoramaValue == "Yes") {
    imagePanoramaCheckBox.attr('checked','');
  }
  else {
    imagePanoramaCheckBox.removeAttr('checked');
  }

 if(operationDrillMmrsValue == "Yes") {
    mmrsCheckBox.attr('checked','');
  }
  else {
    mmrsCheckBox.removeAttr('checked');
  }

  //todo - if necessary, add default value setting to mmrs and panorama in future

  jQuery('<label/>',{
  text:'Save sample'
  }).appendTo('#newDrillDiv'+drillIterator);

  jQuery('<br/>',{}).appendTo("#newDrillDiv"+drillIterator);

  var drillInput = jQuery('<input/>', {
  type:'text',
    id: 'drillValue'+drillIterator,
    value:operationDrillValue,
    class:'form-control taskText',
    placeholder:'In Depth(cm)',
  });
  drillInput.appendTo('#newDrillDiv'+drillIterator);

  drillInput.focusout(function() {
    console.log("Focusing buf out....");
    var currentDrillValue = $('#drillValue'+drillIterator).val();
    var currentTaskDetails = taskpoints[currentTaskPoint];
    if(currentTaskDetails['drillValue'+drillIterator] != currentDrillValue) {
      currentTaskDetails['drillValue'+drillIterator] = currentDrillValue;
    }
  });

  
   var taskDetails = taskpoints[currentTaskPoint];
   taskDetails["drillValue"+drillIterator] = $("#drillValue"+drillIterator).val();

   if(drillSaveCheckBox.attr('checked')) {
    taskDetails["drillSave"+drillIterator] = "Yes";
   }
   if(drillSaveImageCheckBox.attr('checked')) {
    taskDetails["drillSaveImage"+drillIterator] = "Yes";
   }
   if(mmrsCheckBox.attr('checked')) {
    taskDetails["mmrs"+drillIterator] = "Yes";
   }
   if(imagePanoramaCheckBox.attr('checked')) {
    taskDetails["imagePanorama"+drillIterator] = "Yes";
   }
   taskDetails['drillCount'] = $("#drillCount").val();
   taskDetails['drillIterator'] = $("#drillIterator").val();

  //jQuery('<br/>',{}).appendTo("#drillDiv");
} //makeDrillDivs

//******************************************************************************************************
//selectOperation - To select a particular operation
function selectOperation(object) {
  console.log("the object is "+object);
  var text = object.text;
  constructDiv(text);
}

//******************************************************************************************************
//constructDiv - To construct div based on selected option
function constructDiv() {

  var selectedOption = $('#selectOperation').val();
  var currentTaskpoint;
  var latitudeValue = document.getElementById("lat").value;
  var longitudeValue = document.getElementById("lng").value;

  for(taskDetailsIterator in taskpoints) {
    if(taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
      currentTaskpoint = taskDetailsIterator;
      break;
    }
  }

  console.log("the current task point is "+currentTaskpoint);

  if(selectedOption && selectedOption != undefined) {

    if(selectedOption == "Drill") {
      constructDrillDiv(currentTaskpoint,selectedOption,operationDrillDefault,operationDrillSaveDefault,operationDrillSaveImageDefault);
    }
    else if(selectedOption == "BUF") {
      constructBufDiv(currentTaskpoint,selectedOption,operationBufDefault);
    }//if selection is BUF
    else if(selectedOption == "MMRS") {
      constructMmrsDiv(currentTaskpoint,selectedOption,operationMmrsExposureDefault,operationMmrsAccumulationDefault,operationMmrsNumberDefault);
    }//if selection is MMRS
    else if(selectedOption == "Science Image") {
      constructScienceImageDiv(currentTaskpoint,selectedOption,operationSciencePanDefault,operationScienceTiltDefault);
    } //if selection is science image
    else if(selectedOption == "Image Panorama") {
      constructImagePanoramaDiv(currentTaskpoint,selectedOption,operationImageStartAzimuthDefault,operationImageEndAzimuthDefault,operationImageStartElevationDefault,operationImageEndElevationDefault);
    }// if selection is Image Panorama
    else if(selectedOption == "Spectra Panorama") {
      constructSpectraPanoramaDiv(currentTaskpoint,selectedOption,operationSpectraStartAzimuthDefault,operationSpectraEndAzimuthDefault,operationSpectraStartElevationDefault,operationSpectraEndElevationDefault,operationSpectraAngularDefault,"Yes","Yes");
    }// if selection is Spectra Panorama
    else if(selectedOption == "Precise Move") {
      constructPreciseMoveDiv(currentTaskpoint,selectedOption,operationPreciseMoveDefault);
    }// if selection is Precise Move
    else if(selectedOption == "Smart Target") {
      constructSmartTargetDiv(currentTaskpoint,selectedOption,operationSmartTargetDefault);
    }// if selection is smart Target
  }
}//end of construct div function

//******************************************************************************************************
//constructBufDiv - To construct div for BUF
function constructBufDiv(currentTaskpoint,selectedOption,operationBufValue) {
  var groupAnchor = jQuery('<a>', {
  class:'list-group-item task-group-item',
  }).appendTo('#operationDiv');

  var selectedOptionNew = selectedOption.replace(" ","");
  groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOptionNew+"'>X</span>");

  $("#operationClose"+selectedOptionNew).click(function( event ){
    //To remove the entire parent element
    var removeDiv = event.target;
    var removeParentDiv = removeDiv.parentElement;
    var removedId = removeParentDiv.id;
    removeParentDiv.remove();

    //to remove this from the taskDetails json also 
    var taskDetails = taskpoints[currentTaskpoint];
    if(taskDetails["bufValue"] && taskDetails["bufValue"] != undefined) {
      delete taskDetails["bufValue"];
    }     
    $('<option>').val('BUF').text('BUF').appendTo('#selectOperation');
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"BUF"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();

  var inputDiv = jQuery('<div></div>').hide().append(jQuery('<input/>', {
  type:'text',
    id: 'bufValue',
    value:operationBufValue,
    class:'form-control taskText',
    placeholder:'LED Intensity',
  }))

  inputDiv.focusout(function(){
    console.log("Focusing buf out....");
    var currentBufValue = $('#bufValue').val();
    if(taskpoints[currentTaskpoint].bufValue != currentBufValue) {
      taskpoints[currentTaskpoint].bufValue = currentBufValue;
    }
  });

  inputDiv.appendTo(groupSpan);
  inputDiv.show();

  var taskDetails = taskpoints[currentTaskpoint];
  taskDetails["bufValue"] = $('#bufValue').val(); 
  $("#selectOperation option[value='"+selectedOption+"']").remove();
} //End of constructBufDiv function


//******************************************************************************************************
//constructMmrsDiv - To construct div for BUF
function constructMmrsDiv(currentTaskpoint,selectedOption,operationMmrsExposureValue,operationMmrsAccumulationValue,operationMmrsNumberValue) {
  console.log("sel "+selectedOption);

  var groupAnchor = jQuery('<a>', {
  class:'list-group-item task-group-item',
  }).appendTo('#operationDiv');

  var selectedOptionNew = selectedOption.replace(" ","");
  groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOptionNew+"'>X</span>");

  $("#operationClose"+selectedOptionNew).click(function( event ){
    //To remove the entire parent element
    var removeDiv = event.target;
    var removeParentDiv = removeDiv.parentElement;
    var removedId = removeParentDiv.id;
    removeParentDiv.remove();

    //to remove this from the taskDetails json also     
    var taskDetails = taskpoints[currentTaskpoint];
    if(taskDetails["mmrsExposureValue"] && taskDetails["mmrsExposureValue"] != undefined) {
      delete taskDetails["mmrsExposureValue"];
    }
    if(taskDetails["mmrsAccumulationValue"] && taskDetails["mmrsAccumulationValue"] != undefined) {
      delete taskDetails["mmrsAccumulationValue"];
    }
    if(taskDetails["mmrsNumberValue"] && taskDetails["mmrsNumberValue"] != undefined) {
      delete taskDetails["mmrsNumberValue"];
    }   
    $('<option>').val('MMRS').text('MMRS').appendTo('#selectOperation');
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"MMRS"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();


  mmrsExposureInput = jQuery('<input/>', {
  type:'text',
    id: 'mmrsExposureValue',
    value: operationMmrsExposureValue, 
    class:'form-control taskText',
    placeholder:'Exposure',
  });

  mmrsExposureInput.focusout(function(){
    console.log("Focusing mmrs exposue out....");
    var currentmmrsExposureValue = $('#mmrsExposureValue').val();
    if(taskpoints[currentTaskpoint].mmrsExposureValue != currentmmrsExposureValue) {
      taskpoints[currentTaskpoint].mmrsExposureValue = currentmmrsExposureValue;
    }
  });

  mmrsAccumulationInput = jQuery('<input/>', {
  type:'text',
    id: 'mmrsAccumulationValue',
    value: operationMmrsAccumulationValue, 
    class:'form-control taskText',
    placeholder:'Accumulation',
  });

  mmrsAccumulationInput.focusout(function(){
    console.log("Focusing  mmrsAccumulationValue out....");
    var currentmmrsAccumulationValue = $('#mmrsAccumulationValue').val();
    if(taskpoints[currentTaskpoint].mmrsAccumulationValue != currentmmrsAccumulationValue) {
      taskpoints[currentTaskpoint].mmrsAccumulationValue = currentmmrsAccumulationValue;
    }
  });

  mmrsNumberInput = jQuery('<input/>', {
  type:'text',
    id: 'mmrsNumberValue',
    value: operationMmrsNumberValue, 
    class:'form-control taskText',
    placeholder:'Number of points',
  });

  mmrsNumberInput.focusout(function(){
    console.log("Focusing  mmrs number Value out....");
    var currentmmrsNumberValue = $('#mmrsNumberValue').val();
    if(taskpoints[currentTaskpoint].mmrsNumberValue != currentmmrsNumberValue) {
      taskpoints[currentTaskpoint].mmrsNumberValue = currentmmrsNumberValue;
    }
  });

  var inputDiv = jQuery('<div></div>').hide().append(mmrsExposureInput,mmrsAccumulationInput,mmrsNumberInput);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();

  $("<br/>").insertAfter(mmrsExposureInput);
  $("<br/>").insertAfter(mmrsAccumulationInput);
  //mmrsExposureInput.after(br);
  //mmrsAccumulationInput.after(br);


  var taskDetails = taskpoints[currentTaskpoint];
  taskDetails["mmrsExposureValue"] = $('#mmrsExposureValue').val(); 
  taskDetails["mmrsAccumulationValue"] = $('#mmrsAccumulationValue').val(); 
  taskDetails["mmrsNumberValue"] = $('#mmrsNumberValue').val(); 
  $("#selectOperation option[value='"+selectedOption+"']").remove();
}//End of constructMmrsDiv

//******************************************************************************************************
//constructDrillDiv - To construct div for drill
function constructDrillDiv(currentTaskpoint,selectedOption,operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue) {

  console.log("constructing drill div");
  console.log("sel "+selectedOption);

  var groupAnchor = jQuery('<a>', {
  class:'list-group-item task-group-item',
  }).appendTo('#operationDiv');

  var selectedOptionNew = selectedOption.replace(" ","");
  groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOptionNew+"'>X</span>");

  $("#operationClose"+selectedOptionNew).click(function( event ){
    //To remove the entire parent element
    var removeDiv = event.target;
    var removeParentDiv = removeDiv.parentElement;
    var removedId = removeParentDiv.id;
    removeParentDiv.remove();

    //to remove this from the taskDetails json also 
    var taskDetails = taskpoints[currentTaskpoint];
    var drillCount = $("#drillCount").val();
    for(drillIterator=0;drillIterator<=drillCount;drillIterator++) {
      if(taskDetails["drillValue"+drillIterator] && taskDetails["drillValue"+drillIterator] != undefined) {
        delete taskDetails["drillValue"+drillIterator];
      }
      if(taskDetails["drillSave"+drillIterator] && taskDetails["drillSave"+drillIterator] != undefined) {
        delete taskDetails["drillSave"+drillIterator];
      }
      if(taskDetails["drillSaveImage"+drillIterator] && taskDetails["drillSaveImage"+drillIterator] != undefined) {
        delete taskDetails["drillSaveImage"+drillIterator];
      }

      if(taskDetails["imagePanorama"+drillIterator] && taskDetails["imagePanorama"+drillIterator] != undefined) {
        delete taskDetails["imagePanorama"+drillIterator];
      }
      if(taskDetails["mmrs"+drillIterator] && taskDetails["mmrs"+drillIterator] != undefined) {
        delete taskDetails["mmrs"+drillIterator];
      }
    }
    
    $('<option>').val('Drill').text('Drill').appendTo('#selectOperation');
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon',
    id:'drillDiv'
  }).hide().append(jQuery('<b>',{
    text:"Drill"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();

  var addButton = jQuery('<input/>', {
  type:'button',
    id: 'addDrill',
    value:'Add',
    class:'btn btn-primary'
  });

  addButton.click(function(){
    console.log("clickkkk");
    drillIterator = $("#drillIterator").val();
    drillCount = $("#drillCount").val();

    //todo - change to default values
    addDrillDiv(currentTaskpoint,drillIterator,drillCount,operationDrillDefault,operationDrillSaveDefault,operationDrillSaveImageDefault,operationDrillImagePanoramaValueDefault,operationDrillMmrsValueDefault);
  });

  var inputDiv = jQuery('<div></div>').hide().append(addButton);


  // inputDiv.focusout(function(){
  //  console.log("Focusing buf out....");
  //  var currentBufValue = $('#bufValue').val();
  //  if(taskpoints[currentTaskpoint].bufValue != currentBufValue) {
  //    taskpoints[currentTaskpoint].bufValue = currentBufValue;
  //  }
  // });

  inputDiv.appendTo(groupSpan);
  $("<br/>").insertAfter(inputDiv);$("<br/>").insertAfter(inputDiv);$("<br/>").insertAfter(inputDiv);
  inputDiv.show();


  /*
  The following is done as every drill is added
  */

  // var drillIterator = $("#drillIterator").val();
  // var drillCount = $("#drillCount").val();

  // var taskDetails = taskpoints[currentTaskpoint];
  // var drillValueInput = $("drillValue"+drillIterator);
  // taskDetails["drillValue"+drillIterator] = drillValueInput.val(); 

  // var drillSaveImageCheckBox = $("#drillSaveImage"+drillIterator);
  // var drillSaveCheckBox = $("#drillSave"+drillIterator);

  // if(drillSaveCheckBox.attr('checked')) {
  //  taskDetails["drillSave"+drillIterator] = "Yes";
  // }
  // if(drillSaveImageCheckBox.attr('checked')) {
  //  taskDetails["drillSaveImage"+drillIterator] = "Yes";
  // }
  $("#selectOperation option[value='"+selectedOption+"']").remove();

}//End of constructDrillDiv

//******************************************************************************************************
//constructScienceImageDiv - To construct div for BUF
function constructScienceImageDiv(currentTaskpoint,selectedOption,operationSciencePanValue,operationScienceTiltValue) {
  console.log("sel "+selectedOption);

  var groupAnchor = jQuery('<a>', {
  class:'list-group-item task-group-item',
  }).appendTo('#operationDiv');

  var selectedOptionNew = selectedOption.replace(" ","");
  groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOptionNew+"'>X</span>");

  $("#operationClose"+selectedOptionNew).click(function( event ){
    //To remove the entire parent element
    var removeDiv = event.target;
    var removeParentDiv = removeDiv.parentElement;
    var removedId = removeParentDiv.id;
    removeParentDiv.remove();

    
    //to remove this from the taskDetails json also   
    var taskDetails = taskpoints[currentTaskpoint];
    if(taskDetails["sciencePanValue"] && taskDetails["sciencePanValue"] != undefined) {
      delete taskDetails["sciencePanValue"];
    }
    if(taskDetails["scienceTiltValue"] && taskDetails["scienceTiltValue"] != undefined) {
      delete taskDetails["scienceTiltValue"];
    }   
    $('<option>').val('Science Image').text('Science Image').appendTo('#selectOperation');
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"Science Image"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();

  br = jQuery('<br/>');

  sciencePanInput = jQuery('<input/>', {
  type:'text',
    id: 'sciencePanValue',
    value:operationSciencePanValue, 
    class:'form-control taskText',
    placeholder:'Pan',
  });

  sciencePanInput.focusout(function(){
    console.log("Focusing sciencePanValue out....");
    var currentsciencePanValue = $('#sciencePanValue').val();
    if(taskpoints[currentTaskpoint].sciencePanValue != currentsciencePanValue) {
      taskpoints[currentTaskpoint].sciencePanValue = currentsciencePanValue;
    }
  }); 

  scienceTiltInput = jQuery('<input/>', {
  type:'text',
    id: 'scienceTiltValue',
    value:operationScienceTiltValue, 
    class:'form-control taskText',
    placeholder:'Tilt',
  });

  scienceTiltInput.focusout(function(){
    console.log("Focusing scienceTiltValue out....");
    var currentscienceTiltValue = $('#scienceTiltValue').val();
    if(taskpoints[currentTaskpoint].scienceTiltValue != currentscienceTiltValue) {
      taskpoints[currentTaskpoint].scienceTiltValue = currentscienceTiltValue;
    }
  }); 

  var inputDiv = jQuery('<div></div>').hide().append(sciencePanInput,scienceTiltInput,br);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();

  sciencePanInput.after(br);

  var taskDetails = taskpoints[currentTaskpoint];
  taskDetails["sciencePanValue"] = $('#sciencePanValue').val(); 
  taskDetails["scienceTiltValue"] = $('#scienceTiltValue').val(); 
  $("#selectOperation option[value='"+selectedOption+"']").remove();

}//End of constructScienceImageDiv

//******************************************************************************************************
//constructImagePanoramaDiv - To construct div for BUF
function constructImagePanoramaDiv(currentTaskpoint,selectedOption,operationImageStartAzimuthValue,operationImageEndAzimuthValue,operationImageStartElevationValue,operationImageEndElevationValue) {
  console.log("sel "+selectedOption);

  var groupAnchor = jQuery('<a>', {
  class:'list-group-item task-group-item',
  }).appendTo('#operationDiv');

  var selectedOptionNew = selectedOption.replace(" ","");
  groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOptionNew+"'>X</span>");

  $("#operationClose"+selectedOptionNew).click(function( event ){
    //To remove the entire parent element
    var removeDiv = event.target;
    var removeParentDiv = removeDiv.parentElement;
    var removedId = removeParentDiv.id;
    removeParentDiv.remove();

    //to remove this from the taskDetails json also 
    var taskDetails = taskpoints[currentTaskpoint];
    if(taskDetails["imageStartAzimuthValue"] && taskDetails["imageStartAzimuthValue"] != undefined) {
      delete taskDetails["imageStartAzimuthValue"];
    }
    if(taskDetails["imageEndAzimuthValue"] && taskDetails["imageEndAzimuthValue"] != undefined) {
      delete taskDetails["imageEndAzimuthValue"];
    }
    if(taskDetails["imageStartElevationValue"] && taskDetails["imageStartElevationValue"] != undefined) {
      delete taskDetails["imageStartElevationValue"];
    }
    if(taskDetails["imageEndElevationValue"] && taskDetails["imageEndElevationValue"] != undefined) {
      delete taskDetails["imageEndElevationValue"];
    }   
    $('<option>').val('Image Panorama').text('Image Panorama').appendTo('#selectOperation');  
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"Image Panorama"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();

  br = jQuery('<br/>');

  startAzimuthInput = jQuery('<input/>', {
  type:'text',
    id: 'imageStartAzimuthValue',
    value:operationImageStartAzimuthValue, 
    class:'form-control taskText',
    placeholder:'Start Azimuth',
  });

  startAzimuthInput.focusout(function(){
    console.log("Focusing startAzimuthInput out....");
    var currentimageStartAzimuthValue = $('#imageStartAzimuthValue').val();
    if(taskpoints[currentTaskpoint].imageStartAzimuthValue != currentimageStartAzimuthValue) {
      taskpoints[currentTaskpoint].imageStartAzimuthValue = currentimageStartAzimuthValue;
    }
  }); 

  endAzimuthInput = jQuery('<input/>', {
  type:'text',
    id: 'imageEndAzimuthValue',
    value:operationImageEndAzimuthValue, 
    class:'form-control taskText',
    placeholder:'End Azimuth',
  });

  endAzimuthInput.focusout(function(){
    console.log("Focusing imageEndAzimuthValue out....");
    var currentimageEndAzimuthValue = $('#imageEndAzimuthValue').val();
    if(taskpoints[currentTaskpoint].imageEndAzimuthValue != currentimageEndAzimuthValue) {
      taskpoints[currentTaskpoint].imageEndAzimuthValue = currentimageEndAzimuthValue;
    }
  }); 

  startElevationInput = jQuery('<input/>', {
  type:'text',
    id: 'imageStartElevationValue',
    value:operationImageStartElevationValue, 
    class:'form-control taskText',
    placeholder:'Start Elevation',
  });

  startElevationInput.focusout(function(){
    console.log("Focusing imageStartElevationValue out....");
    var currentimageStartElevationValue = $('#imageStartElevationValue').val();
    if(taskpoints[currentTaskpoint].imageStartElevationValue != currentimageStartElevationValue) {
      taskpoints[currentTaskpoint].imageStartElevationValue = currentimageStartElevationValue;
    }
  }); 

  endElevationInput = jQuery('<input/>', {
  type:'text',
    id: 'imageEndElevationValue',
    value:operationImageEndElevationValue, 
    class:'form-control taskText',
    placeholder:'End Elevation',
  });

  endElevationInput.focusout(function(){
    console.log("Focusing imageEndElevationValue out....");
    var currentimageEndElevationValue = $('#imageEndElevationValue').val();
    if(taskpoints[currentTaskpoint].imageEndElevationValue != currentimageEndElevationValue) {
      taskpoints[currentTaskpoint].imageEndElevationValue = currentimageEndElevationValue;
    }
  }); 

  var inputDiv = jQuery('<div></div>').hide().append(startAzimuthInput,endAzimuthInput,startElevationInput,endElevationInput);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();

  endAzimuthInput.after(br);

  var taskDetails = taskpoints[currentTaskpoint];
  taskDetails["imageStartAzimuthValue"] = $('#imageStartAzimuthValue').val(); 
  taskDetails["imageEndAzimuthValue"] = $('#imageEndAzimuthValue').val(); 
  taskDetails["imageStartElevationValue"] = $('#imageStartElevationValue').val(); 
  taskDetails["imageEndElevationValue"] = $('#imageEndElevationValue').val(); 
  $("#selectOperation option[value='"+selectedOption+"']").remove();
}//End of constructImagePanoramaDiv

//******************************************************************************************************
//constructSpectraPanoramaDiv - To construct div for BUF
function constructSpectraPanoramaDiv(currentTaskpoint,selectedOption,operationSpectraStartAzimuthValue,operationSpectraEndAzimuthValue,operationSpectraStartElevationValue,operationSpectraEndElevationValue,operationSpectraAngularValue,operationSpectraNavcamRecordValue,operationSpectraAngularCameraValue) {
  console.log("sel "+selectedOption);

  var groupAnchor = jQuery('<a>', {
  class:'list-group-item task-group-item',
  }).appendTo('#operationDiv');

  var selectedOptionNew = selectedOption.replace(" ","");
  groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOptionNew+"'>X</span>");

  $("#operationClose"+selectedOptionNew).click(function( event ){
    //To remove the entire parent element
    var removeDiv = event.target;
    var removeParentDiv = removeDiv.parentElement;
    var removedId = removeParentDiv.id;
    removeParentDiv.remove();

    //to remove this from the taskDetails json also       
    var taskDetails = taskpoints[currentTaskpoint];
    if(taskDetails["spectraStartAzimuthValue"] && taskDetails["spectraStartAzimuthValue"] != undefined) {
      delete taskDetails["spectraStartAzimuthValue"];
    }
    if(taskDetails["spectraEndAzimuthValue"] && taskDetails["spectraEndAzimuthValue"] != undefined) {
      delete taskDetails["spectraEndAzimuthValue"];
    }
    if(taskDetails["spectraStartElevationValue"] && taskDetails["spectraStartElevationValue"] != undefined) {
      delete taskDetails["spectraStartElevationValue"];
    }
    if(taskDetails["spectraEndElevationValue"] && taskDetails["spectraEndElevationValue"] != undefined) {
      delete taskDetails["spectraEndElevationValue"];
    }   
    if(taskDetails["spectraAngularValue"] && taskDetails["spectraAngularValue"] != undefined) {
      delete taskDetails["spectraAngularValue"];
    }
    if(taskDetails["spectraAngularCamera"] && taskDetails["spectraAngularCamera"] != undefined) {
      delete taskDetails["spectraAngularCamera"];
    }
    if(taskDetails["spectraNavcamRecord"] && taskDetails["spectraNavcamRecord"] != undefined) {
      delete taskDetails["spectraNavcamRecord"];
    }   
    $('<option>').val('Spectra Panorama').text('Spectra Panorama').appendTo('#selectOperation');
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"Spectra Panorama"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();

  br = document.createElement("br");

  startAzimuthInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraStartAzimuthValue',
    value:operationSpectraStartAzimuthValue, 
    class:'form-control taskText',
    placeholder:'Start Azimuth',
  });

  startAzimuthInput.focusout(function(){
    console.log("Focusing spectraStartAzimuthValue out....");
    var currentspectraStartAzimuthValue = $('#spectraStartAzimuthValue').val();
    if(taskpoints[currentTaskpoint].spectraStartAzimuthValue != currentspectraStartAzimuthValue) {
      taskpoints[currentTaskpoint].spectraStartAzimuthValue = currentspectraStartAzimuthValue;
    }
  }); 

  endAzimuthInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraEndAzimuthValue',
    value:operationSpectraEndAzimuthValue, 
    class:'form-control taskText',
    placeholder:'End Azimuth',
  });

  endAzimuthInput.focusout(function(){
    console.log("Focusing spectraEndAzimuthValue out....");
    var currentspectraEndAzimuthValue = $('#spectraEndAzimuthValue').val();
    if(taskpoints[currentTaskpoint].spectraEndAzimuthValue != currentspectraEndAzimuthValue) {
      taskpoints[currentTaskpoint].spectraEndAzimuthValue = currentspectraEndAzimuthValue;
    }
  }); 

  startElevationInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraStartElevationValue',
    value:operationSpectraStartElevationValue, 
    class:'form-control taskText',
    placeholder:'Start Elevation',
  });

  startElevationInput.focusout(function(){
    console.log("Focusing spectraStartElevationValue out....");
    var currentspectraStartElevationValue = $('#spectraStartElevationValue').val();
    if(taskpoints[currentTaskpoint].spectraStartElevationValue != currentspectraStartElevationValue) {
      taskpoints[currentTaskpoint].spectraStartElevationValue = currentspectraStartElevationValue;
    }
  }); 

  endElevationInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraEndElevationValue',
    value:operationSpectraEndElevationValue, 
    class:'form-control taskText',
    placeholder:'End Elevation',
  });

  endElevationInput.focusout(function(){
    console.log("Focusing spectraEndElevationValue out....");
    var currentspectraEndElevationValue = $('#spectraEndElevationValue').val();
    if(taskpoints[currentTaskpoint].spectraEndElevationValue != currentspectraEndElevationValue) {
      taskpoints[currentTaskpoint].spectraEndElevationValue = currentspectraEndElevationValue;
    }
  }); 

  spectraAngularInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraAngularValue',
    value:operationSpectraAngularValue, 
    class:'form-control taskText',
    placeholder:'Angular',
  });

  spectraAngularInput.focusout(function(){
    console.log("Focusing spectraAngularValue out....");
    var currentspectraAngularValue = $('#spectraAngularValue').val();
    if(taskpoints[currentTaskpoint].spectraAngularValue != currentspectraAngularValue) {
      taskpoints[currentTaskpoint].spectraAngularValue = currentspectraAngularValue;
    }
  }); 

  var spectraAngularCameraCheckBox = jQuery('<input/>',{
    type:'checkbox',
    id:'spectraAngularCamera' 
  });
  if(operationSpectraAngularCameraValue == "Yes") {
    spectraAngularCameraCheckBox.attr('checked','');
  }
  else {
    spectraAngularCameraCheckBox.removeAttr('checked');
  }
  var spectraAngularCameraLabel = jQuery('<label/>',{
    text:'With Camera'
  });

  spectraAngularCameraCheckBox.change(function() { 

  var isChecked = spectraAngularCameraCheckBox.prop('checked');
    console.log("the value is "+isChecked);
    if(isChecked == true) {
      var taskDetails = taskpoints[currentTaskpoint];
      taskDetails["spectraAngularCamera"] = "Yes";
    }
    else {
      var taskDetails = taskpoints[currentTaskpoint];
      if(taskDetails["spectraAngularCamera"] && taskDetails["spectraAngularCamera"]!=undefined) {
        delete taskDetails["spectraAngularCamera"];
      }
    }
  });

  var spectraNavcamRecordCheckBox = jQuery('<input/>',{
    type:'checkbox',
    id:'spectraNavcamRecord' 
  });
  var spectraNavcamRecordLabel = jQuery('<label/>',{
    text:'Navcam Record'
  });
  if(operationSpectraNavcamRecordValue == "Yes") {
    spectraNavcamRecordCheckBox.attr('checked','');
  }
  else {
    spectraNavcamRecordCheckBox.removeAttr('checked');
  }

  spectraNavcamRecordCheckBox.change(function() { 
    var isChecked = spectraNavcamRecordCheckBox.prop('checked');
    console.log("the value is "+isChecked);
    if(isChecked == true) {
      var taskDetails = taskpoints[currentTaskpoint];
      taskDetails["spectraNavcamRecord"] = "Yes";
    }
    else {
      var taskDetails = taskpoints[currentTaskpoint];
      if(taskDetails["spectraNavcamRecord"] && taskDetails["spectraNavcamRecord"]!=undefined) {
        delete taskDetails["spectraNavcamRecord"];
      }
    }
  });

  var inputDiv = jQuery('<div></div>').hide().append(startAzimuthInput,endAzimuthInput,startElevationInput,endElevationInput,spectraAngularInput,spectraAngularCameraCheckBox,spectraAngularCameraLabel,spectraNavcamRecordCheckBox,spectraNavcamRecordLabel);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();

  //endAzimuthInput.after(br);
  $("<br/>").insertAfter(endAzimuthInput);
  $("<br/>").insertBefore(spectraAngularInput);
  $("<br/>").insertBefore(spectraNavcamRecordCheckBox);

  var taskDetails = taskpoints[currentTaskpoint];
  taskDetails["spectraStartAzimuthValue"] = $('#spectraStartAzimuthValue').val(); 
  taskDetails["spectraEndAzimuthValue"] = $('#spectraEndAzimuthValue').val(); 
  taskDetails["spectraStartElevationValue"] = $('#spectraStartElevationValue').val(); 
  taskDetails["spectraEndElevationValue"] = $('#spectraEndElevationValue').val(); 
  taskDetails["spectraAngularValue"] = $('#spectraAngularValue').val(); 
  if(spectraAngularCameraCheckBox.attr('checked')) {
    taskDetails["spectraAngularCamera"] = "Yes";
  }
  if(spectraNavcamRecordCheckBox.attr('checked')) {
    taskDetails["spectraNavcamRecord"] = "Yes";
  }

  $("#selectOperation option[value='"+selectedOption+"']").remove();
}//End of constructSpectraPanoramaDiv

//******************************************************************************************************
//constructPreciseMoveDiv - To construct div for BUF
function constructPreciseMoveDiv(currentTaskpoint,selectedOption,operationPreciseMoveValue) {
  console.log("sel "+selectedOption);

  var groupAnchor = jQuery('<a>', {
  class:'list-group-item task-group-item',
  }).appendTo('#operationDiv');
  
  var selectedOptionNew = selectedOption.replace(" ","");
  groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOptionNew+"'>X</span>");

  $("#operationClose"+selectedOptionNew).click(function( event ){
    //To remove the entire parent element
    var removeDiv = event.target;
    var removeParentDiv = removeDiv.parentElement;
    var removedId = removeParentDiv.id;
    removeParentDiv.remove();

    //to remove this from the taskDetails json also 
    var taskDetails = taskpoints[currentTaskpoint];
    if(taskDetails["preciseMoveValue"] && taskDetails["preciseMoveValue"] != undefined) {
      delete taskDetails["preciseMoveValue"];
    }
    $('<option>').val('Precise Move').text('Precise Move').appendTo('#selectOperation');      
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"Precise Move"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();

  // var preciseMoveCheckBox = jQuery('<input/>',{
  //  type:'checkbox',
  //  id:'preciseMove'
  // });
  var preciseMoveLabel = jQuery('<label/>',{
    text:'Precise Move'
  });
  var preciseMoveInput = jQuery('<input/>', {
  type:'text',
    id: 'preciseMoveValue',
    value:operationPreciseMoveValue, 
    class:'form-control taskText',
    placeholder:'Distance',
  });

  preciseMoveInput.focusout(function(){
    console.log("Focusing preciseMoveValue out....");
    var currentpreciseMoveValue = $('#preciseMoveValue').val();
    if(taskpoints[currentTaskpoint].preciseMoveValue != currentpreciseMoveValue) {
      taskpoints[currentTaskpoint].preciseMoveValue = currentpreciseMoveValue;
    }
  }); 

  var inputDiv = jQuery('<div></div>').hide().append(preciseMoveInput);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();

  var taskDetails = taskpoints[currentTaskpoint];
  var preciseMoveValue = $('#preciseMoveValue').val();
  if(preciseMoveValue && preciseMoveValue!=undefined) {
    taskDetails["preciseMoveValue"] = $('#preciseMoveValue').val(); 
  }
  

  $("#selectOperation option[value='"+selectedOption+"']").remove(); 

}//End of constructPreciseMoveDiv

//******************************************************************************************************
//constructSmartTargetDiv - To construct div for BUF
function constructSmartTargetDiv(currentTaskpoint,selectedOption,operationSmartTargetValue) {
  console.log("sel "+selectedOption);

  var groupAnchor = jQuery('<a>', {
  class:'list-group-item task-group-item',
  }).appendTo('#operationDiv');

  var selectedOptionNew = selectedOption.replace(" ","");
  groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOptionNew+"'>X</span>");

  $("#operationClose"+selectedOptionNew).click(function( event ){
    //To remove the entire parent element
    var removeDiv = event.target;
    var removeParentDiv = removeDiv.parentElement;
    var removedId = removeParentDiv.id;
    removeParentDiv.remove();

    //to remove this from the taskDetails json also     
    var taskDetails = taskpoints[currentTaskpoint];
    if(taskDetails["spectraSmartTargetValue"] && taskDetails["spectraSmartTargetValue"] != undefined) {
      delete taskDetails["spectraSmartTargetValue"];
    }   
    $('<option>').val('Smart Target').text('Smart Target').appendTo('#selectOperation');
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"Smart Target"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();

  // var smartTargetCheckBox = jQuery('<input/>',{
  //  type:'checkbox',
  //  id:'spectraSmartTarget'
  // });

  // if(smartTargetCheckBox.attr('checked')) {
  //    taskDetails["spectraSmartTarget"] = "Yes";
  // }

  // smartTargetCheckBox.change(function() { 

  // var isChecked = smartTargetCheckBox.prop('checked');
  //  console.log("the value is "+isChecked);
  //  if(isChecked == true) {
  //    var taskDetails = taskpoints[currentTaskpoint];
  //    taskDetails["spectraSmartTarget"] = "Yes";
  //  }
  //  else {
  //    var taskDetails = taskpoints[currentTaskpoint];
  //    if(taskDetails["spectraSmartTarget"] && taskDetails["spectraSmartTarget"]!=undefined) {
  //      delete taskDetails["spectraSmartTarget"];
  //    }
  //  }
  // });
  
  var smartTargetLabel = jQuery('<label/>',{
    text:'Smart Target'
  });
  var smartTargetInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraSmartTargetValue',
    class:'form-control taskText',
    placeholder:'Budget Value',
    value:operationSmartTargetValue 
  });

  smartTargetInput.focusout(function(){
    console.log("Focusing spectraSmartTargetValue out....");
    var currentspectraSmartTargetValue= $('#spectraSmartTargetValue').val();
    if(taskpoints[currentTaskpoint].spectraSmartTargetValue != currentspectraSmartTargetValue) {
      taskpoints[currentTaskpoint].spectraSmartTargetValue = currentspectraSmartTargetValue;
    }
  }); 

  var inputDiv = jQuery('<div></div>').hide().append(smartTargetInput);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();

  var taskDetails = taskpoints[currentTaskpoint];
  var spectraSmartTargetValue = $('#spectraSmartTargetValue').val();
  if(spectraSmartTargetValue && spectraSmartTargetValue!=undefined) {
    taskDetails["spectraSmartTargetValue"] = $('#spectraSmartTargetValue').val();   
  }
  

  $("#selectOperation option[value='"+selectedOption+"']").remove();
}//End of constructSmartTargetDiv