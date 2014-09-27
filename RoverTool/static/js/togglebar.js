$(document).ready(function () {
  $("[name='my-checkbox']").bootstrapSwitch();
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
    //alert($('#planName').val() + "   " + taskpoints);

   $.ajax({
         type:"POST",
         url:"/",
         data: {
                'markers': JSON.stringify(taskpoints),
                'planName': $('#planName').val().trim(),
                },
         success: function(){
             console.log("i dont know what to say!");
         }
    });
  }
  return false;
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
});