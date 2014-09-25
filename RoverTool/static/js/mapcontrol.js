var map;
var taskpoints=[]; 
var count=0;
var lattitude;
var longitude;

function initialize() {
  var mapOptions = {
    zoom: 9,
    center: new google.maps.LatLng(-23.3695439,-69.8597406),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  google.maps.event.addListener(map, 'click', function(event) {

            latitude = event.latLng.lat();
            longitude = event.latLng.lng();
            mapZoom = map.getZoom();
            /*var marker = new google.maps.Marker({
                position: event.latLng,
                map: map
            });*/
           // placeMarker(latitude,longitude);
           setTimeout("placeMarker("+latitude+","+longitude+")", 600);
             
  });//function for map click

 
}

function placeMarker(latitude,longitude) {
    if(mapZoom == map.getZoom()){
      console.log("placing marker"+latitude+" "+longitude);
         var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude,longitude),
            map: map,
            title: "Lat : "+latitude+" Long : "+longitude
        });
         taskpoints.push(new google.maps.LatLng(latitude,longitude));
            count++;
            if(count>1 ) {
              drawline();
             }
       google.maps.event.addListener(marker, 'rightclick', function(event) {
          
            //map.removeOverlay(marker);
            marker.setMap(null);
            console.log(taskpoints);
            var i=0;
            for(i=0;i<taskpoints.length;i++)
              {
                if(marker.position.lat()==taskpoints[i].lat()&&marker.position.lng()==taskpoints[i].lng())
                {
                  
                  for(j=i;j<taskpoints.length;j++)
                  {
                    taskpoints[j]=taskpoints[j+1];
                  }
                  taskpoints.pop();
                  drawline();
                }
              }//for
       });//function for right click
    }
   

 }//place marker

var lines = [];

function drawline() {
  for(var i = 0;i<lines.length;i++)   {
      lines[i].setMap(null);
  }


  var lineSymbol = {
      path:google.maps.SymbolPath.FORWARD_OPEN_ARROW,
      strokeColor:"#DB0000",
      strokeWeight:3,
      scale:1.5
  };
  var polylineOptions={
              path:taskpoints,
           /*   strokeColor:"#DB0000",
              strokeWeight:3,
              icons : [{
                icon:lineSymbol,
                offset:'0',
                repeat:'90px'
*/
                strokeColor: '#0026b3',
                strokeOpacity: 1.0,
                strokeWeight: 1,
                geodesic: true,
                icons: [{
                    icon: lineSymbol,
                    repeat: '100px',
                    offset: '50%'
                }],
                zIndex: 10
              };
              //}]};
  var polyline= new google.maps.Polyline(polylineOptions);
  lines.push(polyline);
  polyline.setMap(map);
} //function drawline   

function drawMarker() {
  var latitudeValue = document.getElementById('latValue').value;
  var longitudeValue = document.getElementById('lngValue').value;
  placeMarker(latitudeValue,longitudeValue);
 } //draw marker    
  
 google.maps.event.addDomListener(window, 'load', initialize);
