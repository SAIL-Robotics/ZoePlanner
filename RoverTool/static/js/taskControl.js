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

}
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
}

function removeExistingDrill() {


	$("#drillDiv").find("div[id*='newDrill']").each(function(){
		//do something here
		this.remove();

	});
	
}

function fillDrill(drillIterator,drillCount,taskDetails) {

	for(iterator=1;iterator<=drillIterator;iterator++) {

				if(taskDetails!=undefined) {
					if(taskDetails["drillValue"+iterator] && taskDetails["drillValue"+iterator]!=null && taskDetails["drillValue"+iterator]!=undefined) {
					//Construct the new divs accordingly
					makeDrillDivs(iterator); //DRILLCOUNT CONFUSIONNNN!!

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
}

function addDrillDiv(drillIterator,drillCount) {

	makeDrillDivs(drillIterator);

	drillIterator++;
	drillCount++;

	$("#drillIterator").val(drillIterator);
	$("#drillCount").val(drillCount);

}

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
	text:'Save and take picture'
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
}