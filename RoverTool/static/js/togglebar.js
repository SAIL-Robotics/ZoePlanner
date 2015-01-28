var planList;
var planTitle;
var eve;

$(document).ready(function () {

$(document).ajaxStart(function () {
  $("#floatingCirclesG").show();
  }).ajaxStop(function () {
    $("#floatingCirclesG").hide();
  });

/****************************************************Get configurationkml file data********************************************************/
$.ajax({
         type:"POST",
         url:'/DBOperation/',
         data: {
                'operation': 'loadSiteCoords',  
                },
         success: function(response){
            lol = response
            if (response!=undefined)
            { 
              kmldata = ""
              for(i=0;i<response.siteName.length;i++)
              {
                kmldata = kmldata + response.siteName[i] + "\n" + response.coords[i]+ "\n";
                  //$(".dropdown-menu").append("<li> <a tabindex='-1' onclick='mapPanTo("+response.coords[i][1].split(",")[0]+","+response.coords[i][1].split(",")[1]+","+response.siteName[i]+");'>"+response.siteName[i]+"</a></li>")
                  $(".dropdown-menu").append("<li> <a tabindex='-1' onclick='mapPanTo("+response.coords[i][1].split(",")[0]+","+response.coords[i][1].split(",")[1]+");'>"+response.siteName[i]+"</a></li>")
              }
              $('#comment').val(kmldata)
            }         
         }
  });

/****************************************************Populate plan pane once the page get loaded********************************************************/
$.ajax({
         type:"POST",
         url:'/',
         data: {
                'operation': 'planPane',
                },
         success: function(response){
               populatePlan(response);
         }
});

/****************************************************Populate operation config once the page get loaded********************************************************/
$.ajax({
         type:"POST",
         url:'/',
         data: {
                'operation': 'operationConfig',  
                },
         success: function(response){
          eve = response
               populateOperationConfig(response);
               updateDefaultValues(response);
         }
});

/****************************************************Hide the rightclick menu********************************************************/
$(document).click(function () {
      $contextMenu.hide();
  });

$(document.body).on('click', 'button', function() {
    //console.log('button ' + this.class + ' clicked');
});

$('body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('destroy');
        }
    });
});

document.getElementById('close').onclick = function(){
        $('.row-task-offcanvas').removeClass("taskappear");
        $('.row-task-offcanvas').addClass("taskdisappear");
        drawline();
        return false;
};


/****************************************************Right Click menu Start********************************************************/
  var $contextMenu = $("#contextMenu");
  
  $("body").on("contextmenu", ".right-click", function(e) {
    $contextMenu.css({
      display: "block",
      left: e.pageX,
      top: e.pageY
    });
    $('#contextMenu').attr("name",e.currentTarget.firstChild.data);
    
    return false;
  });
  
  $contextMenu.on("click", "a", function(e) {
    if(e.currentTarget.firstChild.data == "Delete Plan"){
      console.log($('#contextMenu').attr("name"));
      bootbox.confirm("Are you sure you want to delete " + $('#contextMenu').attr("name") + "?", function(result) {
        if(result == true){
          $.ajax({
             type:"POST",
             url:"/DBOperation/",
             data: {
                    'planName': $('#contextMenu').attr("name"),
                    'operation': 'deletePlan',
                    },
             success: function(response){
                toastr.options.positionClass ="toast-bottom-right";
                toastr.success('Plan Deleted!','');
                populatePlan(response)
             }
          });
        //clearMap();
        }
      });
    }

    if(e.currentTarget.firstChild.data == "Rename Plan"){
      $('#planRename').val('')
      $('#planNameErr').html('')
      $('#myRenameModal').modal('show');
    }

    if(e.currentTarget.firstChild.data == "Duplicate Plan"){
      
      $("#createPlan").attr("name","duplicate");
      $("#myModalLabel").text("Duplicate Plan"); 
      $('#planName').val('')
      $('#planDesc').val('')
      $('#planNameError').html('')
      $('#myModal').modal('show');
    }

    if(e.currentTarget.firstChild.data == "Plan Details"){

      $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'planName': $('#contextMenu').attr("name"),
                'operation': 'getPlanInfo',
                },
         success: function(response){
               
               pName = $('#contextMenu').attr("name")
               response.planDescription==null ? desc = "" : desc = response.planDescription

               dataContent = "<div style='width:500px; word-wrap:break-word'><b>Description:</b>"+desc + "<br/><b>Created Time : </b> " + response.timeStamp+"<br/><b>Execution Date : </b> " + response.planDate+"</div>"
              
              $('.'+pName).attr("data-toggle", "popover")

                $('.'+pName).popover({ 
                  html : true,
                  title : "Plan Details",
                  content: dataContent,
              })

                $('.'+pName).popover('show')
         }
      });
    }

    if(e.currentTarget.firstChild.data == "Download as KML"){

      $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'planName': $('#contextMenu').attr("name"),
                'operation': 'downloadAsKML',
                },
         success: function(response){
                var blob = new Blob([response], {type: "text/plain;charset=utf-8"});
                saveAs(blob, $('#contextMenu').attr("name")+".kml");  // (content, filename) download as a KML file
         }
      });
    }
    $contextMenu.hide();
  });

/******************************************************Right Click menu End*************************************************************/

// Lock/unlock Toggle button
  $("[name='my-checkbox']").bootstrapSwitch();  //applying bootstrapswitch CSS to checkbox
 // $("#save-button").hide();     // hiding save button at start
  $('.row-task-offcanvas').toggleClass('taskdisappear');
  $('[data-toggle=offcanvas]').click(function () {
    if ($('.sidebar-offcanvas').css('background-color') == 'rgb(255, 255, 255)') {
      $('.plan-group-item').attr('tabindex', '-1');
    } else {
      $('.plan-group-item').attr('tabindex', '');
    }
    $('.row-plan-offcanvas').toggleClass('active');
    $('.row-task-offcanvas').toggleClass('taskactive');
  });


/****************************************************Save Plan - Button ********************************************************/

/* AJAX call and save the plan to DB*/
  $("#save-button").click(function(){
    if(taskpoints.length == 0)
    {
      toastr.options.positionClass ="toast-bottom-right";
      toastr.error('No markers placed!','');
    }
    else
    {
      console.log($('#planName').val().trim())
      $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'markers': JSON.stringify(taskpoints),    //constains lat, lon
                'planName': $('#planName').val().trim(),  //plan name
                'planNameUpdate': $('#planNameDisplay').text().trim(),
                'planDesc': $('#planDesc').val().trim(),
                'executionDate': $('#executionDate').val().trim(),
                'operation': 'save',
                },
         success: function(response){
             populatePlan(response)
         }
      });
     // $("#save-button").hide();
      //$('#planNameDisplay').text("");
      $('.row-plan-offcanvas').toggleClass('active');
      $('.row-task-offcanvas').toggleClass('taskactive');
      toastr.options.positionClass ="toast-bottom-right";
      toastr.success('Plan Saved Successfully!','');
    }
  return false;         //for stopping the page from refreshing
  });

/****************************************************Proceed button - Create Plan Modal*******************************************************/

   //proceed button in Create Plan Modal
  /* data validation inside createplan modal and display saveplan button*/
  $("#createPlan").click(function(){
    $('#planNameError').html("");
    $('#executionDateError').html("");

     executionDateFlag = false;

    if($('#planName').val().trim().length === 0) {
       $('#planNameError').html("<span class=\"label label-danger\">Plan name cannot be empty!</span>");
    }
      
    else if($('#planName').val().length > 0 )
    {

      if($('#executionDate').val().trim().length != 0) { 

        var dateRegEx = new RegExp("^((0[13578]|1[02])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](18|19|20)[0-9]{2})|((0[469]|11)[\/.](0[1-9]|[12][0-9]|30)[\/.](18|19|20)[0-9]{2})|((02)[\/.](0[1-9]|1[0-9]|2[0-8])[\/.](18|19|20)[0-9]{2})|((02)[\/.]29[\/.](((18|19|20)(04|08|[2468][048]|[13579][26]))|2000))$");
        var executionDateValue = $('#executionDate').val();

        if(!dateRegEx.test(executionDateValue)) {
          $('#executionDateError').html("<span class=\"label label-danger\">Provide valid date in (mm/dd/yyyy) format!</span>");
          //also checks leap years
          var executionDateFlag = false;
        }
        else {
          executionDateFlag = true;
        }
      }
      else if($('#executionDate').val().trim().length === 0) {
        executionDateFlag = true;
      }

      if(executionDateFlag == true) {
         $('#margintop').show();
         $("[name='my-checkbox']").bootstrapSwitch('state', false);
         locked = false;
          $.ajax({                              //ajax call for validating if planname already exist
           type:"POST",
           url:"/DBOperation/",
           data: {
                  'planName': $('#planName').val().trim(),   
                  'operation': 'validatePlanName',
                  },
           success: function(response){
              if(response.count == 0)
              {
                if($("#createPlan").attr("name") === "duplicate")                  //ajax call for duplicate plan
                {
                  console.log($('#planName').val().trim())

                  $.ajax({
                     type:"POST",
                     url:"/DBOperation/",
                     data: {
                            'planName': $('#contextMenu').attr("name"),
                            'newPlanName': $('#planName').val().trim(),
                            'planDesc': $('#planDesc').val().trim(),
                            'operation': 'duplicate',
                            },
                     success: function(response){
                        toastr.options.positionClass ="toast-bottom-right";
                        toastr.success('Plan Duplicated!','');
                        //todo - this
                        var markerCount = parseInt(response.totalMarkers[i])+1;
                        $('#markerCount').val(markerCount);
                        populatePlan(response)
                     }
                  });
                }
                else    //create new plan actions. 
                {
                  //$('#createPlanModal').hide();

                  $("#save-button").show();
                  $('#markerCount').val("1");
                  $('.plan-group-item').attr('tabindex', '-1');
                  $('.row-plan-offcanvas').toggleClass('active');
                  $('.row-task-offcanvas').toggleClass('taskactive');
                }             
                $('#myModal').modal('hide')
                $('#planNameDisplay').text($('#planName').val());
              } 
              else{
                $('#planNameError').html("<span class=\"label label-danger\">There exists a plan by the same name. </span>");
              }
           }
          });
       }
    }
    
  });

/****************************************************Create Plan Modal********************************************************/

   //"Create Plan" button in base1.html
  /* reset the data inside create plan modal*/
  $("#createPlanModal").click(function(){
    $("#createPlan").attr("name","");
    $("#myModalLabel").text("New Plan");
    if($('#planNameDisplay').text() != ""){
        bootbox.confirm("You are currently working on the plan - "+$('#planNameDisplay').text()+". Are you sure you want to create a new plan?", function(result) {
          if(result == true){
            $('#planName').val('');
            $('#planDesc').val('');
            $('#planNameError').html('');
            $('#executionDate').val('');
            $('executionDateError').html('');
            $('#myModal').modal('show');
          }
        });
       }
    else{
      $('#myModal').modal('show');
    }
  });


/****************************************************Right Click - Rename********************************************************/
$("#renamePlan").click(function(){

    if($('#planRename').val().trim().length === 0) {
       $('#planNameErr').html("<span class=\"label label-danger\">Plan name cannot be empty!</span>");
    }
    else if($('#planRename').val().length > 0 )
    {
      $.ajax({                              //ajax call for validating if planname already exist
       type:"POST",
       url:"/DBOperation/",
       data: {
              'planName': $('#planRename').val().trim(),   
              'operation': 'validatePlanName',
              },
       success: function(response){
          if(response.count == 0)
          {
                $.ajax({
               type:"POST",
               url:"/DBOperation/",
               data: {
                      'planName': $('#contextMenu').attr("name"),
                      'newName' : $('#planRename').val(),  
                      'operation': 'renamePlan',
                      },
               success: function(response){
                  toastr.options.positionClass ="toast-bottom-right";
                  toastr.success('Rename Successfull!','');
                  populatePlan(response)
               }
              });          
            $('#myRenameModal').modal('hide')
            $('#planNameDisplay').text($('#planRename').val());
          } 
          else{
            $('#planNameErr').html("<span class=\"label label-danger\">There exists a plan by the same name. </span>");
          }
       }
      });
    }
  });

/************************************* Create New template *******************************************/

$("#templateNew").click(function(){

    if($('#templateName').val().trim().length === 0) {
       $('#templateNameErr').html("<span class=\"label label-danger\">Template name cannot be empty!</span>");
    }
    else if($('#templateName').val().length > 0 )
    {
      $.ajax({                              //ajax call for validating if planname already exist
       type:"POST",
       url:"/DBOperation/",
       data: {
              'template_name': $('#templateName').val().trim(),   
              'operation': 'validateTemplateName',
              },
       success: function(response){
          if(response.count == 0){
            $.ajax({
             type:"POST",
             url:"/DBOperation/",
             data: {
                    'markers': JSON.stringify(templateTasks),    //constains lat, lon
                    'name':$('#templateName').val().trim(),
                    'operation': 'createTemplate',
                    },
             success: function(data){
                 templateTasks = {}
                 toastr.options.positionClass ="toast-bottom-right";
                 toastr.success('Template Created','');
             }
          });
            $('#templateModal').modal('hide')
          } 
          else{
            $('#templateNameErr').html("<span class=\"label label-danger\">There exists a template by the same name. </span>");
          }
       }
      });
    }
  });
/****************************************************************************************************************/

/****************************************************Plan Reset Icon********************************************************/
//Retrieves all plan names from DB and populate it

  $("#planReset").click(function(){
      $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'operation': 'getPlanList',
                },
         success: function(response){
             populatePlan(response)
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

/****************************************************Click on a Plan to view it********************************************************/

  $('#planMenu').on('click', '.abcd', function (event) {
   var target = event.target || event.srcElement;
   console.log ( event.currentTarget.firstChild.data ); 

  $('.row-task-offcanvas').removeClass("taskappear");
  $('.row-task-offcanvas').addClass("taskdisappear");

   $.ajax({
       type:"POST", 
       url:"/DBOperation/",
       data: {
                'planName': event.currentTarget.firstChild.data,  //plan name
                'operation': 'getMarkerInfo',
              },
       success: function(response){
                $('#createPlanModal').show();
                $("#save-button").show();
                $('#margintop').show();
                $("[name='my-checkbox']").bootstrapSwitch('state', true);
                locked = true;

           console.log(response);
           viewMarkers(response,event.currentTarget.firstChild.data);
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
    console.log("trashhhhhh")
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
              $.ajax({
                 type:"POST",
                 url:"/DBOperation/",
                 data: {
                        'operation': 'getPlanList',
                        },
                 success: function(response){
                     populatePlan(response)
                 }
              });
          }
    });   
   } 
  

  });

/****************************************************Search Plan********************************************************/  
//call this function upon every keystroke in the search textbox. 
  $( "#searchPlan" ).keyup(function() {
    input = $("#searchPlan").val();
    $("#planMenu").empty()
    for(i = 0; i < planList.planName.length; i++)
    {
      if(planList.planName[i].indexOf(input.trim()) != -1)
      {
        $("#planMenu").append('<a href="#" class="list-group-item right-click abcd '+ planList.planName[i] +'">' + planList.planName[i] + '<span class="badge">'+ planList.totalMarkers[i] +'</span> </a>');  
      }
    }
  });

/****************************************************Create Template Button********************************************************/  

  $("#createTemplateButton").click(function(){
    $('#templateName').val('')
    $('#templateNameErr').html('')
    $('#createTemplateModal').modal('show');
  });

/****************************************************Create Template Button in Modal********************************************************/  

  $("#createTemplate").click(function(){
    $.ajax({
       type:"POST",
       url:"/DBOperation/",
       data: {
              'operation': 'createTemplate',
              'templateName': $('#templateName').val(),
              },
       success: function(response){
           
       }
    });
    $('#createTemplateModal').modal('hide');
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
              'Marker Name': $('#markerNameConfig').val()
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

/****************************************************Populate Plan Pane from the 'response'********************************************************/
function populatePlan(response)
{
  $("#planMenu").empty()
  planList = response;
  for(i = 0; i < response.planName.length; i++)
  {
    $("#planMenu").append('<a href="#" class="list-group-item right-click abcd '+ response.planName[i] +'">' + response.planName[i] + '<span class="badge">'+ response.totalMarkers[i] +'</span> </a>');  
  }
}

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