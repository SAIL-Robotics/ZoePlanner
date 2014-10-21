var drillIterator = 1;
var drillCount = 1;


function addDrillDiv() {
	console.log("Calling addDrill");
	// var drillType = $("[name='drillType']:checked").val();
	// if(drillType == 'drillAndSave') {
	// 	addDrillAndSaveDiv(drillIterator);
	// 	drillIterator++;
	// }
	// else if(drillType == 'onlyDrill') {
	// 	 addOnlyDrillDiv(drillIterator);
	// 	 drillIterator++;
	// }


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
			removeParentDiv.remove();
			drillCount--;
			
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

	jQuery('<br/>',{}).appendTo("#drillDiv");

	drillIterator++;
	drillCount++;

}


function saveDrillValueToJson(obj) {
	console.log("the id for this is"+$(obj).attr('id'));
	//TODO - the validation for the text box 
	var buttonId = $(obj).attr('id');
	var textId = buttonId.replace('Button','Value');
	console.log("the text is"+textId);
	var textValue = $('#'+textId).val();
	console.log("the text value is"+textValue);
	//$('#'+textId).attr('readOnly',true);
	
	//Setting the json appropriately
	 var latitudeValue = document.getElementById("lat").value;
	 var longitudeValue = document.getElementById("lng").value;

	for(taskDetailsIterator in taskpoints) {
		console.log("1 "+taskpoints[taskDetailsIterator].lat+" and 2 "+latitudeValue);
        if(taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
        	console.log("Yes they are the same");
        	var taskDetails = taskpoints[taskDetailsIterator];
          	taskDetails[textId] = textValue;    
          	console.log("eee"+taskDetails[textId]);
			}
		}
}