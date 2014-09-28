$(document).ready(function () {

  $.ajax({
           type:"POST",
           url:'/',
           data: {
                  'planName': 'lol',  //plan name
                  },
           success: function(response){
                 $("#planMenu").empty()

            for(i = 0; i < response.planName.length; i++)
            {
              $("#planMenu").append('<a href="#" class="list-group-item abcd">' + response.planName[i] + '<span class="badge">'+ response.totalMarkers[i] +'</span> </a>');  
            }
           }
    });

/****************************************************Right Click menu Start********************************************************/
  var $contextMenu = $("#contextMenu");
  
  $("body").on("contextmenu", ".list-group-item", function(e) {
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
      $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'planName': $('#contextMenu').attr("name"),
                'operation': 'deletePlan',
                },
         success: function(response){
            toastr.options.positionClass ="toast-top-full-width";
            toastr.success('Plan Deleted!','');
            $("#planMenu").empty()

            for(i = 0; i < response.planName.length; i++)
            {
              $("#planMenu").append('<a href="#" class="list-group-item abcd">' + response.planName[i] + '<span class="badge">'+ response.totalMarkers[i] +'</span> </a>');  
            }
         }
    });
    }
    $contextMenu.hide();
  });

/******************************************************Right Click menu End*************************************************************/

  $("[name='my-checkbox']").bootstrapSwitch();  //applying bootstrapswitch CSS to checkbox
  $("#save-button").hide();     // hiding save button at start
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



/* AJAX call and save the plan to DB*/
  $("#save-button").click(function(){
    if(taskpoints.length == 0)
    {
      toastr.options.positionClass ="toast-bottom-right";
      toastr.error('No markers placed!','');
    }
    else
    {
      $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'markers': JSON.stringify(taskpoints),    //constains lat, lon
                'planName': $('#planName').val().trim(),  //plan name
                'operation': 'save',
                },
         success: function(response){
             console.log("i dont know what to say!");
             $("#planMenu").empty()

            for(i = 0; i < response.planName.length; i++)
            {
              $("#planMenu").append('<a href="#" class="list-group-item abcd">' + response.planName[i] + '<span class="badge">'+ response.totalMarkers[i] +'</span> </a>');  
            }
         }
      });

      toastr.options.positionClass ="toast-bottom-right";
      toastr.success('Plan Saved Successfully!','');
    }
  return false;         //for stopping the page from refreshing
  });


  /* data validation inside createplan modal and display saveplan button*/
  $("#createPlan").click(function(){

    if($('#planName').val().trim().length === 0) {
       $('#planNameError').html("<span class=\"label label-danger\">name cannot be empty!</span>");
    }
    else if($('#planName').val().length > 0 )
    {
      $("#save-button").show();
      $('#myModal').modal('hide')
      $('#planNameDisplay').text($('#planName').val());

        $('.plan-group-item').attr('tabindex', '-1');
      $('.row-plan-offcanvas').toggleClass('active');
      $('.row-task-offcanvas').toggleClass('taskactive');
    }
  });

  /* reset the data inside create plan modal*/
  $("#createPlanModal").click(function(){
    $('#planName').val('')
    $('#planDesc').val('')
    $('#planNameError').html('')
    $('#myModal').modal('show');
  });

  $('#planMenu').on('click', '.abcd', function (event) {
   var target = event.target || event.srcElement;
   console.log ( event.currentTarget.firstChild.data ); 

   $.ajax({
       type:"POST",
       url:"/DBOperation/",
       data: {
                'planName': event.currentTarget.firstChild.data,  //plan name
                'operation': 'getMarkerInfo',
              },
       success: function(response){
           console.log(response);
           viewMarkers(response);
       }
    });

});  


});
