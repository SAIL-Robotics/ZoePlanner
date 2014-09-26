	$(document).ready(function () {
		$("[name='my-checkbox']").bootstrapSwitch();
	  $('[data-toggle=offcanvas]').click(function () {
	    if ($('.sidebar-offcanvas').css('background-color') == 'rgb(255, 255, 255)') {
	      $('.list-group-item').attr('tabindex', '-1');
	    } else {
	      $('.list-group-item').attr('tabindex', '');
	    }
	    $('.row-offcanvas').toggleClass('active');
	    
	  });

	 //  $("[name='my-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
		//   console.log(state); // true | false
		//   alert(state);
		// });

	});

	function createPlan() {
	  $('#myModal').modal('toggle')
	  document.getElementById('displayName').innerHTML = document.getElementById('planName').value;
	  var element = document.createElement("input");
	  element.setAttribute("type","button");
	  element.setAttribute("value","Save Plan");
	  element.setAttribute("onclick","savePlan();");
	  element.style.marginLeft = "20px";
	  element.style.marginTop = "20px";
	  document.getElementById('displayName').appendChild(element);
	}

	function savePlan(){
	  alert(taskpoints);
	}