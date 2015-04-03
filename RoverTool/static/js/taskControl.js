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
var operationSpectroMapperDefault;
var operationMarkerNameDefault;
var operationDrillImagePanoramaValueDefault;
var operationDrillBufValueDefault;
var operationDrillMmrsValueDefault;
var operationNavcamValueDefault;


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
    if(defaultValues.operationName[i] == "spectroMapperConfig")
      operationSpectroMapperDefault = defaultValues.operationValue[i];
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
    if(defaultValues.operationName[i] == "drillValueConfig")
      operationDrillDefault = defaultValues.operationValue[i];
    if(defaultValues.operationName[i] == "navcamConfig")
      operationNavcamValueDefault = defaultValues.operationValue[i];
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
       if(removeTaskDetails["buf"+drillIndex]) {
        delete removeTaskDetails["buf"+drillIndex];
      } 
      if(removeTaskDetails["mmrs"+drillIndex]) {
        delete removeTaskDetails["mmrs"+drillIndex];
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
          var operationDrillBufValue = "";
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

          if(taskDetails["buf"+iterator] == "Yes") {
            //keep it selected
            operationDrillBufValue = taskDetails["buf"+iterator];
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
          makeDrillDivs(currentTaskpoint,iterator,operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue,operationDrillBufValue,operationDrillMmrsValue);          
        
        }
      } 
    }
}//fillDrill

//******************************************************************************************************
//addDrillDiv - to add a new drill div
function addDrillDiv(currentTaskPoint,drillIterator,drillCount,operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue,operationDrillBufValue,operationDrillMmrsValue) {
  //console.log("Calling add drill div");
  drillIterator++;
  drillCount++;
  $("#drillIterator").val(drillIterator);
  $("#drillCount").val(drillCount);
  makeDrillDivs(currentTaskPoint,drillIterator,operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue,operationDrillBufValue,operationDrillMmrsValue);
  
}//addDrillDiv

//******************************************************************************************************
//makeDrillDivs - to construct html for adding a new drillDiv
function makeDrillDivs(currentTaskPoint,drillIterator,operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue,operationDrillBufValue,operationDrillMmrsValue) {
  
  //console.log("Calling make drill divs with values ");

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
    //console.log("the value is "+isChecked);
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
  // var imagePanoramaCheckBox = jQuery('<input/>', {
  // type:'checkbox',
  //   id: 'imagePanorama'+drillIterator,
  //   value: 'imagePanorama',
  // });
  // imagePanoramaCheckBox.appendTo('#newDrillDiv'+drillIterator);

  // imagePanoramaCheckBox.change(function() { 
  //   var isChecked = imagePanoramaCheckBox.prop('checked');
  //   //console.log("the value is "+isChecked);
  //   if(isChecked == true) {
  //     var taskDetails = taskpoints[currentTaskPoint];
  //     taskDetails["imagePanorama"+drillIterator] = "Yes";
  //   }
  //   else {
  //     var taskDetails = taskpoints[currentTaskPoint];
  //     if(taskDetails["imagePanorama"+drillIterator] && taskDetails["imagePanorama"+drillIterator]!=undefined) {
  //       delete taskDetails["imagePanorama"+drillIterator];
  //     }
  //   }
  // });

  // jQuery('<label/>',{
  // text:'Image Panorama'
  // }).appendTo('#newDrillDiv'+drillIterator);

  // jQuery('<br/>',{}).appendTo("#newDrillDiv"+drillIterator);

  //buf
  var bufCheckBox = jQuery('<input/>', {
  type:'checkbox',
    id: 'buf'+drillIterator,
    value: 'buf',
  });
  bufCheckBox.appendTo('#newDrillDiv'+drillIterator);

  bufCheckBox.change(function() { 
    var isChecked = bufCheckBox.prop('checked');
    //console.log("the value is "+isChecked);
    if(isChecked == true) {
      var taskDetails = taskpoints[currentTaskPoint];
      taskDetails["buf"+drillIterator] = "Yes";
    }
    else {
      var taskDetails = taskpoints[currentTaskPoint];
      if(taskDetails["buf"+drillIterator] && taskDetails["buf"+drillIterator]!=undefined) {
        delete taskDetails["buf"+drillIterator];
      }
    }
  });

  jQuery('<label/>',{
  text:'BUF'
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
    //console.log("the value is "+isChecked);
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
    //console.log("the value is "+isChecked);
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

 if(operationDrillBufValue == "Yes") {
    bufCheckBox.attr('checked','');
  }
  else {
    bufCheckBox.removeAttr('checked');
  }


 if(operationDrillMmrsValue == "Yes") {
    mmrsCheckBox.attr('checked','');
  }
  else {
    mmrsCheckBox.removeAttr('checked');
  }

  //todo - if necessary, add default value setting to buf and panorama in future

  jQuery('<label/>',{
  text:'Save sample'
  }).appendTo('#newDrillDiv'+drillIterator);

  jQuery('<br/>',{}).appendTo("#newDrillDiv"+drillIterator);

  var drillInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Depth(in cms)&nbsp;'
  }));

  drillInputLabel.appendTo('#newDrillDiv'+drillIterator);
  drillInputLabel.show();

  var drillInput = jQuery('<input/>', {
  type:'text',
    id: 'drillValue'+drillIterator,
    value:operationDrillValue,
    class:'form-control taskText',
    onkeypress:'return isNumber(event)',
    placeholder:'In Depth(cm)',
  });
  drillInput.appendTo('#newDrillDiv'+drillIterator);

  drillInput.focusout(function() {
    //console.log("Focusing buf out....");
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
   if(bufCheckBox.attr('checked')) {
    taskDetails["buf"+drillIterator] = "Yes";
   }
   if(mmrsCheckBox.attr('checked')) {
    taskDetails["mmrs"+drillIterator] = "Yes";
   }

   taskDetails['drillCount'] = $("#drillCount").val();
   taskDetails['drillIterator'] = $("#drillIterator").val();

  //jQuery('<br/>',{}).appendTo("#drillDiv");
} //makeDrillDivs

//******************************************************************************************************
//selectOperation - To select a particular operation
function selectOperation(object) {
  //console.log("the object is "+object);
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

  //console.log("the current task point is "+currentTaskpoint);

  if(selectedOption && selectedOption != undefined) {

    if(selectedOption == "Drill") {
      constructDrillDiv(currentTaskpoint,selectedOption,operationDrillDefault,operationDrillSaveDefault,operationDrillSaveImageDefault);
    }
    // else if(selectedOption == "BUF") {
    //   constructBufDiv(currentTaskpoint,selectedOption,operationBufDefault);
    // }//if selection is BUF
    // else if(selectedOption == "MMRS") {
    //   constructMmrsDiv(currentTaskpoint,selectedOption,operationMmrsExposureDefault,operationMmrsAccumulationDefault,operationMmrsNumberDefault);
    // }//if selection is MMRS
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
    else if(selectedOption == "Spectro Mapper") {
      constructSpectroMapperDiv(currentTaskpoint,selectedOption,operationSpectroMapperDefault);
    }
    else if(selectedOption == "Nav Cam") {
      constructNavcamDiv(currentTaskpoint,selectedOption,operationNavcamValueDefault);
    }
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
    onkeypress:'return isNumber(event)',
    placeholder:'LED Intensity',
  }))

  inputDiv.focusout(function(){
    //console.log("Focusing buf out....");
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
//constructNavcamDiv - To construct div for Nav Cam
function constructNavcamDiv(currentTaskpoint,selectedOption,operationNavcamValue) {
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
    if(taskDetails["navcamValue"] && taskDetails["navcamValue"] != undefined) {
      delete taskDetails["navcamValue"];
    }     
    $('<option>').val('Nav Cam').text('Nav Cam').appendTo('#selectOperation');
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"Record Navigation Camera Images"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();

   var navCamLabel = jQuery('<span>', {
     class:'textSpan'
   }).hide().append(jQuery('<label/>',{
     html:'Budget(0-1) &nbsp;'
   }));


  var inputDiv = jQuery('<div></div>').hide().append(navCamLabel,jQuery('<input/>', {
  type:'text',
    id: 'navcamValue',
    value:operationNavcamValue,
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Nav Cam',
  }))

  inputDiv.focusout(function(){
    //console.log("Focusing nav cam out....");
    var currentnavcamValue = $('#navcamValue').val();
    if(taskpoints[currentTaskpoint].navcamValue != currentnavcamValue) {
      taskpoints[currentTaskpoint].navcamValue = currentnavcamValue;
    }
  });

  inputDiv.appendTo(groupSpan);
  inputDiv.show();
  navCamLabel.show();

  var taskDetails = taskpoints[currentTaskpoint];
  taskDetails["navcamValue"] = $('#navcamValue').val(); 
  $("#selectOperation option[value='"+selectedOption+"']").remove();
} //End of constructNavcamDiv function

//******************************************************************************************************
//constructMmrsDiv - To construct div for mmrs
function constructMmrsDiv(currentTaskpoint,selectedOption,operationMmrsExposureValue,operationMmrsAccumulationValue,operationMmrsNumberValue) {
  //console.log("sel "+selectedOption);

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

   var mmrsExposureInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Exposure &nbsp;'
  }));

  mmrsExposureInput = jQuery('<input/>', {
  type:'text',
    id: 'mmrsExposureValue',
    value: operationMmrsExposureValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Exposure',
  });

  mmrsExposureInput.focusout(function(){
    //console.log("Focusing mmrs exposue out....");
    var currentmmrsExposureValue = $('#mmrsExposureValue').val();
    if(taskpoints[currentTaskpoint].mmrsExposureValue != currentmmrsExposureValue) {
      taskpoints[currentTaskpoint].mmrsExposureValue = currentmmrsExposureValue;
    }
  });

  var mmrsAccumulationInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Accumulation &nbsp;'
  }));

  mmrsAccumulationInput = jQuery('<input/>', {
  type:'text',
    id: 'mmrsAccumulationValue',
    value: operationMmrsAccumulationValue,
    onkeypress:'return isNumber(event)', 
    class:'form-control taskText',
    placeholder:'Accumulation',
  });

  mmrsAccumulationInput.focusout(function(){
    //console.log("Focusing  mmrsAccumulationValue out....");
    var currentmmrsAccumulationValue = $('#mmrsAccumulationValue').val();
    if(taskpoints[currentTaskpoint].mmrsAccumulationValue != currentmmrsAccumulationValue) {
      taskpoints[currentTaskpoint].mmrsAccumulationValue = currentmmrsAccumulationValue;
    }
  });

  var mmrsNumberInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Number &nbsp;'
  }));

  mmrsNumberInput = jQuery('<input/>', {
  type:'text',
    id: 'mmrsNumberValue',
    value: operationMmrsNumberValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Number of points',
  });

  mmrsNumberInput.focusout(function(){
    //console.log("Focusing  mmrs number Value out....");
    var currentmmrsNumberValue = $('#mmrsNumberValue').val();
    if(taskpoints[currentTaskpoint].mmrsNumberValue != currentmmrsNumberValue) {
      taskpoints[currentTaskpoint].mmrsNumberValue = currentmmrsNumberValue;
    }
  });

  var inputDiv = jQuery('<div></div>').hide().append(mmrsExposureInputLabel,mmrsExposureInput,mmrsAccumulationInputLabel,mmrsAccumulationInput,mmrsNumberInputLabel,mmrsNumberInput);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();

  $("<br/>").insertAfter(mmrsExposureInput);
  $("<br/>").insertAfter(mmrsAccumulationInput);
  //mmrsExposureInput.after(br);
  //mmrsAccumulationInput.after(br);
  mmrsExposureInputLabel.show();
  mmrsAccumulationInputLabel.show();
  mmrsNumberInputLabel.show();


  var taskDetails = taskpoints[currentTaskpoint];
  taskDetails["mmrsExposureValue"] = $('#mmrsExposureValue').val(); 
  taskDetails["mmrsAccumulationValue"] = $('#mmrsAccumulationValue').val(); 
  taskDetails["mmrsNumberValue"] = $('#mmrsNumberValue').val(); 
  $("#selectOperation option[value='"+selectedOption+"']").remove();
}//End of constructMmrsDiv

//******************************************************************************************************
//constructDrillDiv - To construct div for drill
function constructDrillDiv(currentTaskpoint,selectedOption,operationDrillValue,operationDrillSaveValue,operationDrillSaveImageValue) {

  //console.log("constructing drill div");
  //console.log("sel "+selectedOption);

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
    var drillIterator = $("#drillIterator").val();
    for(iterator=0;iterator<=drillIterator;iterator++) {
      if(taskDetails["drillValue"+iterator] && taskDetails["drillValue"+iterator] != undefined) {
        delete taskDetails["drillValue"+iterator];
      }
      if(taskDetails["drillSave"+iterator] && taskDetails["drillSave"+iterator] != undefined) {
        delete taskDetails["drillSave"+iterator];
      }
      if(taskDetails["drillSaveImage"+iterator] && taskDetails["drillSaveImage"+iterator] != undefined) {
        delete taskDetails["drillSaveImage"+iterator];
      }
      if(taskDetails["buf"+iterator] && taskDetails["buf"+iterator] != undefined) {
        delete taskDetails["buf"+iterator];
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
    //console.log("clickkkk");
    drillIterator = $("#drillIterator").val();
    drillCount = $("#drillCount").val();

    //todo - change to default values
    addDrillDiv(currentTaskpoint,drillIterator,drillCount,operationDrillDefault,operationDrillSaveDefault,operationDrillSaveImageDefault,operationDrillBufValueDefault,operationDrillMmrsValueDefault);
  });

  var inputDiv = jQuery('<div></div>').hide().append(addButton);


  // inputDiv.focusout(function(){
  //  //console.log("Focusing buf out....");
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
  //console.log("sel "+selectedOption);

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

  var sciencePanInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Pan &nbsp;'
  }));

  sciencePanInput = jQuery('<input/>', {
  type:'text',
    id: 'sciencePanValue',
    value:operationSciencePanValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Pan'
  });

  sciencePanInput.focusout(function(){
    //console.log("Focusing sciencePanValue out....");
    var currentsciencePanValue = $('#sciencePanValue').val();
    if(taskpoints[currentTaskpoint].sciencePanValue != currentsciencePanValue) {
      taskpoints[currentTaskpoint].sciencePanValue = currentsciencePanValue;
    }
  }); 

  var scienceTiltInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Tilt &nbsp;'
  }));

  scienceTiltInput = jQuery('<input/>', {
  type:'text',
    id: 'scienceTiltValue',
    value:operationScienceTiltValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Tilt',
  });

  scienceTiltInput.focusout(function(){
    //console.log("Focusing scienceTiltValue out....");
    var currentscienceTiltValue = $('#scienceTiltValue').val();
    if(taskpoints[currentTaskpoint].scienceTiltValue != currentscienceTiltValue) {
      taskpoints[currentTaskpoint].scienceTiltValue = currentscienceTiltValue;
    }
  }); 

  var inputDiv = jQuery('<div></div>').hide().append(sciencePanInputLabel,sciencePanInput,scienceTiltInputLabel,scienceTiltInput,br);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();

  sciencePanInput.after(br);
  sciencePanInputLabel.show();
  scienceTiltInputLabel.show();

  var taskDetails = taskpoints[currentTaskpoint];
  taskDetails["sciencePanValue"] = $('#sciencePanValue').val(); 
  taskDetails["scienceTiltValue"] = $('#scienceTiltValue').val(); 
  $("#selectOperation option[value='"+selectedOption+"']").remove();

}//End of constructScienceImageDiv

//******************************************************************************************************
//constructImagePanoramaDiv - To construct div for BUF
function constructImagePanoramaDiv(currentTaskpoint,selectedOption,operationImageStartAzimuthValue,operationImageEndAzimuthValue,operationImageStartElevationValue,operationImageEndElevationValue) {
  //console.log("sel "+selectedOption);

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

  var startAzimuthInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Start Azimuth &nbsp;'
  }));

  startAzimuthInput = jQuery('<input/>', {
  type:'text',
    id: 'imageStartAzimuthValue',
    value:operationImageStartAzimuthValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Start Azimuth',
  });

  startAzimuthInput.focusout(function(){
    //console.log("Focusing startAzimuthInput out....");
    var currentimageStartAzimuthValue = $('#imageStartAzimuthValue').val();
    if(taskpoints[currentTaskpoint].imageStartAzimuthValue != currentimageStartAzimuthValue) {
      taskpoints[currentTaskpoint].imageStartAzimuthValue = currentimageStartAzimuthValue;
    }
  }); 

  var endAzimuthInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'End Azimuth &nbsp;'
  }));

  endAzimuthInput = jQuery('<input/>', {
  type:'text',
    id: 'imageEndAzimuthValue',
    value:operationImageEndAzimuthValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'End Azimuth',
  });

  endAzimuthInput.focusout(function(){
    //console.log("Focusing imageEndAzimuthValue out....");
    var currentimageEndAzimuthValue = $('#imageEndAzimuthValue').val();
    if(taskpoints[currentTaskpoint].imageEndAzimuthValue != currentimageEndAzimuthValue) {
      taskpoints[currentTaskpoint].imageEndAzimuthValue = currentimageEndAzimuthValue;
    }
  }); 

  var startElevationInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Start Elevation &nbsp;'
  }));

  startElevationInput = jQuery('<input/>', {
  type:'text',
    id: 'imageStartElevationValue',
    value:operationImageStartElevationValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Start Elevation',
  });

  startElevationInput.focusout(function(){
    //console.log("Focusing imageStartElevationValue out....");
    var currentimageStartElevationValue = $('#imageStartElevationValue').val();
    if(taskpoints[currentTaskpoint].imageStartElevationValue != currentimageStartElevationValue) {
      taskpoints[currentTaskpoint].imageStartElevationValue = currentimageStartElevationValue;
    }
  }); 

  var endElevationInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'End Elevation &nbsp;'
  }));

  endElevationInput = jQuery('<input/>', {
  type:'text',
    id: 'imageEndElevationValue',
    value:operationImageEndElevationValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'End Elevation',
  });

  endElevationInput.focusout(function(){
    //console.log("Focusing imageEndElevationValue out....");
    var currentimageEndElevationValue = $('#imageEndElevationValue').val();
    if(taskpoints[currentTaskpoint].imageEndElevationValue != currentimageEndElevationValue) {
      taskpoints[currentTaskpoint].imageEndElevationValue = currentimageEndElevationValue;
    }
  }); 

  var inputDiv = jQuery('<div></div>').hide().append(startAzimuthInputLabel,startAzimuthInput,endAzimuthInputLabel,endAzimuthInput,startElevationInputLabel,startElevationInput,endElevationInputLabel,endElevationInput);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();

  startAzimuthInputLabel.show();
  endAzimuthInputLabel.show();
  startElevationInputLabel.show();
  endElevationInputLabel.show();

  
  $("<br/>").insertAfter(startAzimuthInput);
  $("<br/>").insertAfter(endAzimuthInput);
  $("<br/>").insertAfter(startElevationInput);
  $("<br/>").insertAfter(endElevationInput);

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
  //console.log("sel "+selectedOption);

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
    $('<option>').val('Spectra Panorama').text('Spectral Panorama').appendTo('#selectOperation');
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"Spectral Panorama"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();

  br = document.createElement("br");

  var startAzimuthInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Start Azimuth &nbsp;'
  }));

  startAzimuthInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraStartAzimuthValue',
    value:operationSpectraStartAzimuthValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Start Azimuth',
  });

  startAzimuthInput.focusout(function(){
    //console.log("Focusing spectraStartAzimuthValue out....");
    var currentspectraStartAzimuthValue = $('#spectraStartAzimuthValue').val();
    if(taskpoints[currentTaskpoint].spectraStartAzimuthValue != currentspectraStartAzimuthValue) {
      taskpoints[currentTaskpoint].spectraStartAzimuthValue = currentspectraStartAzimuthValue;
    }
  }); 

  var endAzimuthInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'End Azimuth &nbsp;'
  }));

  endAzimuthInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraEndAzimuthValue',
    value:operationSpectraEndAzimuthValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'End Azimuth',
  });

  endAzimuthInput.focusout(function(){
    //console.log("Focusing spectraEndAzimuthValue out....");
    var currentspectraEndAzimuthValue = $('#spectraEndAzimuthValue').val();
    if(taskpoints[currentTaskpoint].spectraEndAzimuthValue != currentspectraEndAzimuthValue) {
      taskpoints[currentTaskpoint].spectraEndAzimuthValue = currentspectraEndAzimuthValue;
    }
  }); 

  var startElevationInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Start Elevation &nbsp;'
  }));

  startElevationInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraStartElevationValue',
    value:operationSpectraStartElevationValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Start Elevation',
  });

  startElevationInput.focusout(function(){
    //console.log("Focusing spectraStartElevationValue out....");
    var currentspectraStartElevationValue = $('#spectraStartElevationValue').val();
    if(taskpoints[currentTaskpoint].spectraStartElevationValue != currentspectraStartElevationValue) {
      taskpoints[currentTaskpoint].spectraStartElevationValue = currentspectraStartElevationValue;
    }
  }); 

  var endElevationInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'End Elevation &nbsp;'
  }));

  endElevationInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraEndElevationValue',
    value:operationSpectraEndElevationValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'End Elevation',
  });

  endElevationInput.focusout(function(){
    //console.log("Focusing spectraEndElevationValue out....");
    var currentspectraEndElevationValue = $('#spectraEndElevationValue').val();
    if(taskpoints[currentTaskpoint].spectraEndElevationValue != currentspectraEndElevationValue) {
      taskpoints[currentTaskpoint].spectraEndElevationValue = currentspectraEndElevationValue;
    }
  }); 

  var spectraAngularInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Angular Step <br/> (in deg) &nbsp;'
  }));

  spectraAngularInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraAngularValue',
    value:operationSpectraAngularValue, 
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Angular',
  });

  spectraAngularInput.focusout(function(){
    //console.log("Focusing spectraAngularValue out....");
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
    text:'Save Camera Images'
  });

  spectraAngularCameraCheckBox.change(function() { 

  var isChecked = spectraAngularCameraCheckBox.prop('checked');
    //console.log("the value is "+isChecked);
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

  // var spectraNavcamRecordCheckBox = jQuery('<input/>',{
  //   type:'checkbox',
  //   id:'spectraNavcamRecord' 
  // });
  // var spectraNavcamRecordLabel = jQuery('<label/>',{
  //   text:'Navcam Record'
  // });
  // if(operationSpectraNavcamRecordValue == "Yes") {
  //   spectraNavcamRecordCheckBox.attr('checked','');
  // }
  // else {
  //   spectraNavcamRecordCheckBox.removeAttr('checked');
  // }

  // spectraNavcamRecordCheckBox.change(function() { 
  //   var isChecked = spectraNavcamRecordCheckBox.prop('checked');
  //   //console.log("the value is "+isChecked);
  //   if(isChecked == true) {
  //     var taskDetails = taskpoints[currentTaskpoint];
  //     taskDetails["spectraNavcamRecord"] = "Yes";
  //   }
  //   else {
  //     var taskDetails = taskpoints[currentTaskpoint];
  //     if(taskDetails["spectraNavcamRecord"] && taskDetails["spectraNavcamRecord"]!=undefined) {
  //       delete taskDetails["spectraNavcamRecord"];
  //     }
  //   }
  // });

  var inputDiv = jQuery('<div></div>').hide().append(startAzimuthInputLabel,startAzimuthInput,endAzimuthInputLabel,endAzimuthInput,startElevationInputLabel,startElevationInput,endElevationInputLabel,endElevationInput,spectraAngularInputLabel,spectraAngularInput,spectraAngularCameraCheckBox,spectraAngularCameraLabel);//,spectraNavcamRecordCheckBox,spectraNavcamRecordLabel);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();
  startAzimuthInputLabel.show();
  endAzimuthInputLabel.show();
  startElevationInputLabel.show();
  endElevationInputLabel.show();
  spectraAngularInputLabel.show();

  //endAzimuthInput.after(br);
  $("<br/>").insertAfter(startAzimuthInput);
  $("<br/>").insertAfter(endAzimuthInput);
  $("<br/>").insertAfter(startElevationInput);
  $("<br/>").insertAfter(endElevationInput);
  $("<br/>").insertAfter(spectraAngularInput);
  //$("<br/>").insertBefore(spectraNavcamRecordCheckBox);

  var taskDetails = taskpoints[currentTaskpoint];
  taskDetails["spectraStartAzimuthValue"] = $('#spectraStartAzimuthValue').val(); 
  taskDetails["spectraEndAzimuthValue"] = $('#spectraEndAzimuthValue').val(); 
  taskDetails["spectraStartElevationValue"] = $('#spectraStartElevationValue').val(); 
  taskDetails["spectraEndElevationValue"] = $('#spectraEndElevationValue').val(); 
  taskDetails["spectraAngularValue"] = $('#spectraAngularValue').val(); 
  if(spectraAngularCameraCheckBox.attr('checked')) {
    taskDetails["spectraAngularCamera"] = "Yes";
  }
  // if(spectraNavcamRecordCheckBox.attr('checked')) {
  //   taskDetails["spectraNavcamRecord"] = "Yes";
  // }

  $("#selectOperation option[value='"+selectedOption+"']").remove();
}//End of constructSpectraPanoramaDiv

//******************************************************************************************************
//constructPreciseMoveDiv - To construct div for BUF
function constructPreciseMoveDiv(currentTaskpoint,selectedOption,operationPreciseMoveValue) {
  //console.log("sel "+selectedOption);

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
    onkeypress:'return isNumber(event)',
    class:'form-control taskText',
    placeholder:'Distance',
  });

  var preciseMoveInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Distance &nbsp;'
  }));

  preciseMoveInput.focusout(function(){
    //console.log("Focusing preciseMoveValue out....");
    var currentpreciseMoveValue = $('#preciseMoveValue').val();
    if(taskpoints[currentTaskpoint].preciseMoveValue != currentpreciseMoveValue) {
      taskpoints[currentTaskpoint].preciseMoveValue = currentpreciseMoveValue;
    }
  }); 

  var inputDiv = jQuery('<div></div>').hide().append(preciseMoveInputLabel,preciseMoveInput);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();
  preciseMoveInputLabel.show();

  var taskDetails = taskpoints[currentTaskpoint];
  var preciseMoveValue = $('#preciseMoveValue').val();
  if(preciseMoveValue && preciseMoveValue!=undefined) {
    taskDetails["preciseMoveValue"] = $('#preciseMoveValue').val(); 
  }
  

  $("#selectOperation option[value='"+selectedOption+"']").remove(); 

}//End of constructPreciseMoveDiv

//******************************************************************************************************
//constructSmartTargetDiv - To construct div for Smart Target
function constructSmartTargetDiv(currentTaskpoint,selectedOption,operationSmartTargetValue) {
  //console.log("sel "+selectedOption);

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
    $('<option>').val('Smart Target').text('Smart Targetting').appendTo('#selectOperation');
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"Smart Targetting"
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
  //  //console.log("the value is "+isChecked);
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
    text:'Smart Targetting'
  });

  var smartTargetInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Angular Step &nbsp;'
  }));

  var smartTargetInput = jQuery('<input/>', {
  type:'text',
    id: 'spectraSmartTargetValue',
    class:'form-control taskText',
    placeholder:'In deg',
    onkeypress:'return isNumber(event)',
    value:operationSmartTargetValue 
  });

  smartTargetInput.focusout(function(){
    //console.log("Focusing spectraSmartTargetValue out....");
    var currentspectraSmartTargetValue= $('#spectraSmartTargetValue').val();
    if(taskpoints[currentTaskpoint].spectraSmartTargetValue != currentspectraSmartTargetValue) {
      taskpoints[currentTaskpoint].spectraSmartTargetValue = currentspectraSmartTargetValue;
    }
  }); 

  var inputDiv = jQuery('<div></div>').hide().append(smartTargetInputLabel,smartTargetInput);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();
  smartTargetInputLabel.show();

  var taskDetails = taskpoints[currentTaskpoint];
  var spectraSmartTargetValue = $('#spectraSmartTargetValue').val();
  if(spectraSmartTargetValue && spectraSmartTargetValue!=undefined) {
    taskDetails["spectraSmartTargetValue"] = $('#spectraSmartTargetValue').val();   
  }
  

  $("#selectOperation option[value='"+selectedOption+"']").remove();
}//End of constructSmartTargetDiv


//******************************************************************************************************
//constructSpectroMapperDiv - To construct div for Spectro Mapper
function constructSpectroMapperDiv(currentTaskpoint,selectedOption,operationSpectroMapperDiv) {
  //console.log("sel "+selectedOption);

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
    if(taskDetails["spectroMapperValue"] && taskDetails["spectroMapperValue"] != undefined) {
      delete taskDetails["spectroMapperValue"];
    }   
    $('<option>').val('Spectro Mapper').text('Spectro Mapper').appendTo('#selectOperation');
  });

  var groupSpan = jQuery('<span>', {
    class:'input-group-addon'
  }).hide().append(jQuery('<b>',{
    text:"Autonomous Science Navigation"
  }))
  groupSpan.appendTo(groupAnchor);
  groupSpan.show();
  
  var spectroMapperLabel = jQuery('<label/>',{
    text:'Autonomous Science Navigation'
  });

  var spectroMapperInputLabel = jQuery('<span>', {
    class:'textSpan'
  }).hide().append(jQuery('<label/>',{
    html:'Budget(%) &nbsp;'
  }));

  var spectroMapperInput = jQuery('<input/>', {
  type:'text',
    id: 'spectroMapperValue',
    class:'form-control taskText',
    placeholder:'Budget Value',
    onkeypress:'return isNumber(event)',
    value:operationSpectroMapperDiv 
  });

  spectroMapperInput.focusout(function(){
    var currentspectraoMapperValue= $('#spectroMapperValue').val();
    if(taskpoints[currentTaskpoint].spectroMapperValue != currentspectraoMapperValue) {
      taskpoints[currentTaskpoint].spectroMapperValue = currentspectraoMapperValue;
    }
  }); 

  var inputDiv = jQuery('<div></div>').hide().append(spectroMapperInputLabel,spectroMapperInput);

  inputDiv.appendTo(groupSpan);
  inputDiv.show();
  spectroMapperInputLabel.show();

  var taskDetails = taskpoints[currentTaskpoint];
  var spectroMapperValue = $('#spectroMapperValue').val();
  if(spectroMapperValue && spectroMapperValue!=undefined) {
    taskDetails["spectroMapperValue"] = $('#spectroMapperValue').val();   
  }
  

  $("#selectOperation option[value='"+selectedOption+"']").remove();
}//End of constructSpectroMapperDiv