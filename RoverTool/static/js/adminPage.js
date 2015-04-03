var planList;
var planTitle;
var eve;

$(document).ready(function () {
toastr.options.closeButton = "true";
toastr.options.tapToDismiss = "true";


/****************************************************Get configurationkml file data********************************************************/
$.ajax({
         type:"POST",
         url:'/config/',
         data: {
                'operation': 'getFileContent',  
                },
         success: function(response){
            if (response!=undefined)
            { 
              $('#comment').val(response.file)
            }         
         }
  });


/****************************************************remove configurationkml file data********************************************************/
 $("#remove_sites").click(function(){
    bootbox.confirm("Are you sure you want to remove all the sites from the map?", function(result) {
      if(result == true){
          $.ajax({
         type:"POST",
         url:'/config/',
         data: {
                'operation': 'removeContent',  
                },
         success: function(response){
            if (response!=undefined)
            { 
              $('#comment').val('')
            }         
         }
        });
      }
    });
  });

/****************************************************Plan Trash bin Icon********************************************************/
  $('#planTrash').click(function(){
    $('#planTrashModal').modal('show');
      $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'operation': 'getDeletedPlanList',
                },
         success: function(response){
            populatePlanTrash(response)
         }
      });
  });

/****************************************************Click on a Plan in trash to recover it and delete it forever :'( **********************************************/

  $('#planTrashDiv').on('click', '.planTrashClass', function (event) {
   var target = event.target || event.srcElement;
   console.log(event.target);
   console.log ( event.currentTarget.firstChild.data ); 
   //eve = event;

   if (event.target.className.search("trash") > 0)
   {
       $.ajax({
       type:"POST",
       url:"/DBOperation/",
       data: {
                'planName': event.currentTarget.firstChild.data,  //plan name
                'operation': 'deletePlanForever',
              },
       success: function(response){
              populatePlanTrash(response)
          }
    });   
   }
   else if (event.target.className.search("recover") > 0)
   {
       $.ajax({
       type:"POST",
       url:"/DBOperation/",
       data: {
                'planName': event.currentTarget.firstChild.data,  //plan name
                'operation': 'recoverPlan',
              },
       success: function(response){
              populatePlanTrash(response)
          }
    });   
   } 
  

  });

/****************************************************Config Button********************************************************/  

  $("#operationPaneConfig").click(function(){
    
    $.ajax({
       type:"POST",
       url:"/DBOperation/",
       data: {
              'operation': 'getOperationList',
              },
       success: function(response){
           populateOperationConfig(response)
           //eve = response;
           updateDefaultValues(response);
       }
    });
    $('#operationConfigModal').modal('show');
  });

/****************************************************Operation Pane Default value Config Modal********************************************************/  

  $('#saveConfig').click(function(){
    $.ajax({
       type:"POST",
       url:"/DBOperation/",
       data: {
              'operation': 'operationConfig',
              'BUF': $('#BUFConfig').val(),
              'MMRS1': $('#MMRSConfig1').val(),
              'MMRS2': $('#MMRSConfig2').val(),
              'MMRS3': $('#MMRSConfig3').val(),
              'Science Image1': $('#scienceImageConfig1').val(),
              'Science Image2': $('#scienceImageConfig2').val(),
              'Image Panorama1': $('#imagePanoramaConfig1').val(),
              'Image Panorama2': $('#imagePanoramaConfig2').val(),
              'Image Panorama3': $('#imagePanoramaConfig3').val(),
              'Image Panorama4': $('#imagePanoramaConfig4').val(),
              'Spectra Panorama1': $('#spectraPanoramaConfig1').val(),
              'Spectra Panorama2': $('#spectraPanoramaConfig2').val(),
              'Spectra Panorama3': $('#spectraPanoramaConfig3').val(),
              'Spectra Panorama4': $('#spectraPanoramaConfig4').val(),
              'Spectra Panorama5': $('#spectraPanoramaConfig5').val(),
              'Precise Move': $('#preciseMoveConfig').val(),
              'Smart Target': $('#smartTargetConfig').val(),
              'Marker Name': $('#markerNameConfig').val(),
              'Nav Cam' : $('#navcamConfig').val(),
              'Drill' : $('#drillValueConfig').val(),
              'Spectro Mapper':$('#spectroMapperConfig').val()

              },
       success: function(response){
           //eve = response;

           toastr.options.positionClass ="toast-bottom-right";
           toastr.success('Configuration values are saved!','');
           updateDefaultValues(response);
       },
       error: function(jqXHR,errorThrown){
          toastr.options.positionClass ="toast-bottom-right";
          toastr.error('Error in saving Configuration values!','');
       }

    });
    $('#operationConfigModal').modal('hide');
  });

  $('#TrashPop').click(function(){
    $('#operationConfigModal').modal('show');

  });

});

/****************************************************Populate Operation Config from the 'response'********************************************************/

function populateOperationConfig(response)
{
  for(i = 0; i < response.operationName.length; i++)
  {
    $('#'+response.operationName[i]).val(response.operationValue[i]);
  }
}

/****************************************************Populate Plan Trash from the 'response'********************************************************/

function populatePlanTrash(response)
{

  $("#planTrashDiv").empty()
  for(i = 0; i < response.planName.length; i++)
  {
    $("#planTrashDiv").append('<div href="#" class="list-group-item clearfix planTrashClass">'+ response.planName[i] +'<span class="pull-right">  <button class="btn btn-xs btn-info trash" data-toggle="tooltip" data-placement="bottom" title="Delete permanently" id='+response.planName[i]+'> <span class="glyphicon glyphicon-trash trash"></span> </button>  <button class="btn btn-xs btn-info recover" data-toggle="tooltip" data-placement="bottom" title="Restore plan " id='+response.planName[i]+'> <span class="glyphicon glyphicon-log-in recover"></span> </button> </span> </span></div>'); 
  }
}