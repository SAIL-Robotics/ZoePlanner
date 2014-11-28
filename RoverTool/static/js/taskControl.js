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

	for(taskDetailsIterator in taskpoints) {
	  	var latitudeValue = document.getElementById("lat").value;
	  	var longitudeValue = document.getElementById("lng").value;	

		if(taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
			taskDetails = taskpoints[taskDetailsIterator];
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

	fillDrill(drillIterator,drillCount,taskDetails);
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
function fillDrill(drillIterator,drillCount,taskDetails) {
	for(iterator=1;iterator<=drillIterator;iterator++) {
				if(taskDetails!=undefined) {
					if(taskDetails["drillValue"+iterator] && taskDetails["drillValue"+iterator]!=null && taskDetails["drillValue"+iterator]!=undefined) {
					//Construct the new divs accordingly
					makeDrillDivs(iterator); 
					$("#drillValue"+iterator).val(taskDetails["drillValue"+iterator]);
					if(taskDetails["drillSave"+iterator] == "Yes") {
						//keep it selected
						$("#drillSave"+iterator).prop("checked",true)  
					}
					if(taskDetails["drillSaveImage"+iterator] == "Yes") {
						//keep it selected
						$("#drillSaveImage"+iterator).prop("checked",true)  
					}
				}
			}	
		}
}//fillDrill

//******************************************************************************************************
//addDrillDiv - to add a new drill div
function addDrillDiv(drillIterator,drillCount) {
	makeDrillDivs(drillIterator);
	drillIterator++;
	drillCount++;
	$("#drillIterator").val(drillIterator);
	$("#drillCount").val(drillCount);
}//addDrillDiv

//******************************************************************************************************
//makeDrillDivs - to construct html for adding a new drillDiv
function makeDrillDivs(drillIterator) {

	jQuery('<div/>', {
    id: 'newDrillDiv'+drillIterator,
    class:'newDrillDiv',
	}).appendTo('#drillDiv');

	jQuery('<input/>', {
	type:'checkbox',
    id: 'drillSaveImage'+drillIterator,
    value: 'drillSaveImage',
	}).appendTo('#newDrillDiv'+drillIterator);

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

	jQuery('<label/>',{
	text:'Take picture'
	}).appendTo('#newDrillDiv'+drillIterator);

	jQuery('<br/>',{}).appendTo("#newDrillDiv"+drillIterator);

	jQuery('<input/>', {
	type:'checkbox',
    id: 'drillSave'+drillIterator,
    value: 'drillSave',
	}).appendTo('#newDrillDiv'+drillIterator);

	jQuery('<label/>',{
	text:'Save sample'
	}).appendTo('#newDrillDiv'+drillIterator);

	jQuery('<br/>',{}).appendTo("#newDrillDiv"+drillIterator);

	jQuery('<input/>', {
	type:'text',
    id: 'drillValue'+drillIterator,
    class:'form-control taskText',
    placeholder:'In Depth(cm)',
	}).appendTo('#newDrillDiv'+drillIterator);

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

	if(selectedOption && selectedOption != undefined) {

		if(selectedOption == "BUF") {
			var groupAnchor = jQuery('<a>', {
	    	class:'list-group-item task-group-item',
			}).appendTo('#operationDiv');

			groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOption+"''>X</span>");

			$("#operationClose"+selectedOption).click(function( event ){
				//To remove the entire parent element
				var removeDiv = event.target;
				var removeParentDiv = removeDiv.parentElement;
				var removedId = removeParentDiv.id;
				removeParentDiv.remove();

				//TODO
				//to remove this from the taskDetails json also				
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
		    class:'form-control taskText',
		    placeholder:'LED Intensity',
			}))//.appendTo(inputDiv);

	     	inputDiv.appendTo(groupSpan);
			inputDiv.show();
		}//if selection is BUF
		else if(selectedOption == "MMRS") {
			console.log("sel "+selectedOption);

			var groupAnchor = jQuery('<a>', {
	    	class:'list-group-item task-group-item',
			}).appendTo('#operationDiv');

			groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOption+"''>X</span>");

			$("#operationClose"+selectedOption).click(function( event ){
				//To remove the entire parent element
				var removeDiv = event.target;
				var removeParentDiv = removeDiv.parentElement;
				var removedId = removeParentDiv.id;
				removeParentDiv.remove();

				//TODO
				//to remove this from the taskDetails json also				
			});

			var groupSpan = jQuery('<span>', {
		    class:'input-group-addon'
			}).hide().append(jQuery('<b>',{
				text:"MMRS"
			}))
			groupSpan.appendTo(groupAnchor);
			groupSpan.show();

			br = jQuery('<br/>');

			mmrsExposureInput = jQuery('<input/>', {
			type:'text',
		    id: 'mmrsExposureValue',
		    class:'form-control taskText',
		    placeholder:'Exposure',
			});

			mmrsAccumulationInput = jQuery('<input/>', {
			type:'text',
		    id: 'mmrsAccumulationValue',
		    class:'form-control taskText',
		    placeholder:'Accumulation',
			});

			mmrsNumberInput = jQuery('<input/>', {
			type:'text',
		    id: 'mmrsNumberValue',
		    class:'form-control taskText',
		    placeholder:'Number of points',
			});

			var inputDiv = jQuery('<div></div>').hide().append(mmrsExposureInput,mmrsAccumulationInput,mmrsNumberInput);

	     	inputDiv.appendTo(groupSpan);
			inputDiv.show();

			mmrsExposureInput.after(br);
			mmrsAccumulationInput.after(br);


		}//if selection is MMRS
		else if(selectedOption == "Science Image") {
			console.log("sel "+selectedOption);

			var groupAnchor = jQuery('<a>', {
	    	class:'list-group-item task-group-item',
			}).appendTo('#operationDiv');

			groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOption+"''>X</span>");

			$("#operationClose"+selectedOption).click(function( event ){
				//To remove the entire parent element
				var removeDiv = event.target;
				var removeParentDiv = removeDiv.parentElement;
				var removedId = removeParentDiv.id;
				removeParentDiv.remove();

				//TODO
				//to remove this from the taskDetails json also				
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
		    class:'form-control taskText',
		    placeholder:'Pan',
			});

			scienceTiltInput = jQuery('<input/>', {
			type:'text',
		    id: 'scienceTiltValue',
		    class:'form-control taskText',
		    placeholder:'Tilt',
			});

			var inputDiv = jQuery('<div></div>').hide().append(sciencePanInput,scienceTiltInput,br);

	     	inputDiv.appendTo(groupSpan);
			inputDiv.show();

			sciencePanInput.after(br);

		} //if selection is science image
		else if(selectedOption == "Image Panorama") {
			console.log("sel "+selectedOption);

			var groupAnchor = jQuery('<a>', {
	    	class:'list-group-item task-group-item',
			}).appendTo('#operationDiv');

			groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOption+"''>X</span>");

			$("#operationClose"+selectedOption).click(function( event ){
				//To remove the entire parent element
				var removeDiv = event.target;
				var removeParentDiv = removeDiv.parentElement;
				var removedId = removeParentDiv.id;
				removeParentDiv.remove();

				//TODO
				//to remove this from the taskDetails json also				
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
		    class:'form-control taskText',
		    placeholder:'Start Azimuth',
			});

			endAzimuthInput = jQuery('<input/>', {
			type:'text',
		    id: 'imageEndAzimuthValue',
		    class:'form-control taskText',
		    placeholder:'End Azimuth',
			});

			startElevationInput = jQuery('<input/>', {
			type:'text',
		    id: 'imageStartElevationValue',
		    class:'form-control taskText',
		    placeholder:'Start Elevation',
			});

			endElevationInput = jQuery('<input/>', {
			type:'text',
		    id: 'imageEndElevationValue',
		    class:'form-control taskText',
		    placeholder:'End Elevation',
			});

			var inputDiv = jQuery('<div></div>').hide().append(startAzimuthInput,endAzimuthInput,startElevationInput,endElevationInput);

	     	inputDiv.appendTo(groupSpan);
			inputDiv.show();

			endAzimuthInput.after(br);

		}// if selection is Image Panorama
		else if(selectedOption == "Spectra Panorama") {
			console.log("sel "+selectedOption);

						var groupAnchor = jQuery('<a>', {
	    	class:'list-group-item task-group-item',
			}).appendTo('#operationDiv');

			groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOption+"''>X</span>");

			$("#operationClose"+selectedOption).click(function( event ){
				//To remove the entire parent element
				var removeDiv = event.target;
				var removeParentDiv = removeDiv.parentElement;
				var removedId = removeParentDiv.id;
				removeParentDiv.remove();

				//TODO
				//to remove this from the taskDetails json also				
			});

			var groupSpan = jQuery('<span>', {
		    class:'input-group-addon'
			}).hide().append(jQuery('<b>',{
				text:"Spectra Panorama"
			}))
			groupSpan.appendTo(groupAnchor);
			groupSpan.show();

			br = jQuery('<br/>');

			startAzimuthInput = jQuery('<input/>', {
			type:'text',
		    id: 'spectraStartAzimuthValue',
		    class:'form-control taskText',
		    placeholder:'Start Azimuth',
			});

			endAzimuthInput = jQuery('<input/>', {
			type:'text',
		    id: 'spectraEndAzimuthValue',
		    class:'form-control taskText',
		    placeholder:'End Azimuth',
			});

			startElevationInput = jQuery('<input/>', {
			type:'text',
		    id: 'spectraStartElevationValue',
		    class:'form-control taskText',
		    placeholder:'Start Elevation',
			});

			endElevationInput = jQuery('<input/>', {
			type:'text',
		    id: 'spectraEndElevationValue',
		    class:'form-control taskText',
		    placeholder:'End Elevation',
			});

			var inputDiv = jQuery('<div></div>').hide().append(startAzimuthInput,endAzimuthInput,startElevationInput,endElevationInput);

	     	inputDiv.appendTo(groupSpan);
			inputDiv.show();

			endAzimuthInput.after(br);


		}// if selection is Spectra Panorama
		else if(selectedOption == "Precise Move") {
			console.log("sel "+selectedOption);

			var groupAnchor = jQuery('<a>', {
	    	class:'list-group-item task-group-item',
			}).appendTo('#operationDiv');

			groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOption+"''>X</span>");

			$("#operationClose"+selectedOption).click(function( event ){
				//To remove the entire parent element
				var removeDiv = event.target;
				var removeParentDiv = removeDiv.parentElement;
				var removedId = removeParentDiv.id;
				removeParentDiv.remove();

				//TODO
				//to remove this from the taskDetails json also				
			});

			var groupSpan = jQuery('<span>', {
		    class:'input-group-addon'
			}).hide().append(jQuery('<b>',{
				text:"Precise Move"
			}))
			groupSpan.appendTo(groupAnchor);
			groupSpan.show();

			var preciseMoveCheckBox = jQuery('<input/>',{
				type:'checkbox',
				id:'preciseMove'
			});
			var preciseMoveLabel = jQuery('<label/>',{
				text:'Precise Move'
			});
			var preciseMoveInput = jQuery('<input/>', {
			type:'text',
		    id: 'preciseMoveValue',
		    class:'form-control taskText',
		    placeholder:'Distance',
			});

			var inputDiv = jQuery('<div></div>').hide().append(preciseMoveCheckBox,preciseMoveLabel,preciseMoveInput);

	     	inputDiv.appendTo(groupSpan);
			inputDiv.show();


		}// if selection is Precise Move
		else if(selectedOption == "Smart Target") {
			console.log("sel "+selectedOption);

			var groupAnchor = jQuery('<a>', {
	    	class:'list-group-item task-group-item',
			}).appendTo('#operationDiv');

			groupAnchor.append("<span class='operationClose' id='operationClose"+selectedOption+"''>X</span>");

			$("#operationClose"+selectedOption).click(function( event ){
				//To remove the entire parent element
				var removeDiv = event.target;
				var removeParentDiv = removeDiv.parentElement;
				var removedId = removeParentDiv.id;
				removeParentDiv.remove();

				//TODO
				//to remove this from the taskDetails json also				
			});

			var groupSpan = jQuery('<span>', {
		    class:'input-group-addon'
			}).hide().append(jQuery('<b>',{
				text:"Smart Target"
			}))
			groupSpan.appendTo(groupAnchor);
			groupSpan.show();

			var smartTargetCheckBox = jQuery('<input/>',{
				type:'checkbox',
				id:'spectraSmartTarget'
			});
			var smartTargetLabel = jQuery('<label/>',{
				text:'Smart Target'
			});
			var smartTargetInput = jQuery('<input/>', {
			type:'text',
		    id: 'spectraSmartTargetValue',
		    class:'form-control taskText',
		    placeholder:'Budget Value',
			});

			var inputDiv = jQuery('<div></div>').hide().append(smartTargetCheckBox,smartTargetLabel,smartTargetInput);

	     	inputDiv.appendTo(groupSpan);
			inputDiv.show();

		}// if selection is smart Target
	}
}
