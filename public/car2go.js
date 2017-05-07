$(document).ready(function(){
     initMap();

     getVehicles();
     setTimeout(function(){
     	generateRequests();
     }, 15000);
     setTimeout(function(){
     	generateOtherRequests();
     }, 13000);
    var map
    var bounds 
    var id = 0;

      var drawingManager;
	  var selectedShape;
	  var drawingManager;
	  var priceInput;

	  var numRequests = 0;
	  var requests = []
	  var setLat
	  var setLon
	  function generateRequests(){
	  	if (numRequests < 8){
	  	var randomLat = getRandomArbitrary(30.390476, 30.404864)
		var randomLon = getRandomArbitrary(-97.730591, -97.715659)
		var marker = new google.maps.Marker({
	            position: {lat:randomLat,lng:randomLon},
	            icon:'/caution.png'
	          });
		marker.setMap(map);
		requests.push(marker);
		if (numRequests === 2){
			setLat = randomLat;
			setLon = randomLon;
		}
		
		if (numRequests > 1){
			$("#alerts").append("<p class='alertRow'>"+ parseInt(numRequests+1) + " unfilled vehicle requests near " + parseFloat(setLat).toFixed(4) + "N, " + Math.abs(parseFloat(setLon).toFixed(4)) + "W -- <a href='#' class='takeAction'>Take action</a></p>")

		}
		numRequests++;

		setTimeout(function(){
			generateRequests();
		}, (Math.random()*(20000-12000))+12000)
		}
	  }
	  var numOtherRequests = 0;
	  function generateOtherRequests(){
	  	if (numOtherRequests < 8){
	  	var randomLat = getRandomArbitrary(30.230047, 30.308205)
		var randomLon = getRandomArbitrary(-97.783020, -97.712193)
		var marker = new google.maps.Marker({
	            position: {lat:randomLat,lng:randomLon},
	            icon:'/caution.png'
	          });
		marker.setMap(map);
		numOtherRequests++;
		setTimeout(function(){
			generateOtherRequests();
		}, (Math.random()*(30000-20000))+20000)
	}
	  }

	  $(document).on("click", ".takeAction", function(){
	  	map.setCenter({lat:30.395, lng:-97.72});
		map.setZoom(14);
	  })

	  function clearSelection() {
	    if (selectedShape) {
	      selectedShape.setEditable(false);
	      selectedShape = null;
	    }
	    priceInput.value = '';
	     nameInput.value = '';
	    priceInput.disabled = true;
	  }

	  function setSelection(shape) {
	    clearSelection();
	    selectedShape = shape;
	    shape.setEditable(true);
	    nameInput.value = shape.name;
	    priceInput.disabled = false;
	    priceInput.value = shape.price;
			adjustShapeColor(shape);
	  }

	  function toDelete(id){
	  	for (var i = 0; i < zoneList.length; i++){
	  		if (zoneList[i].id == id){
	  			console.log("deleting " + id)
	  			zoneList = zoneList.splice(i,1)
  			}
	  	}
	  	console.log(zoneList);
	  	$("#zones").empty();
	  	for (var i = 0; i < zoneList.length; i++){
	  		$("#zones").append("<p class='zoneRow' id='"+zoneList[i].id+"'>"+zoneList[i].name+" - "+ zoneList[i].price+ "</p>")

	  	}
	  }

	  function deleteSelectedShape() {
	    if (selectedShape) {

	    	/*for (var i =0; i<zones.length; i++){
	    		if (zones[i].id == selectedShape.id){
	    			console.log("deleting " + selectedShape.id);
	    			toDelete(selectedShape.id);
	    			

	    		}
	    	}*/
	    	var toBeDeleted = selectedShape;
				clearSelection();
	      toBeDeleted.setMap(null);
	    }
	  }

    function toggleDrawable() {
	if (drawingManager.getMap()) {
  	// turn map off
    drawingManager.setMap(null);
	  } else {
	  	// turn map on
	    drawingManager.setMap(map);
	  }
	}

	var zoneList =[];
	function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 30.2672,lng:-97.7431},
      zoom: 9
    });

    bounds= new google.maps.LatLngBounds();
    
    map.setOptions({draggableCursor: 'default'});
	  google.maps.event.addListener(map, 'click', function() {
	  	clearSelection();
	  });
	  priceInput = document.getElementById('price-input');
	  nameInput = document.getElementById('name-input');
	  priceInput.disabled = true;

	  drawingManager = new google.maps.drawing.DrawingManager({
	    drawingMode: google.maps.drawing.OverlayType.POLYGON,
	    drawingControl: true,
	    drawingControlOptions: {
	      position: google.maps.ControlPosition.TOP_CENTER,
	      drawingModes: [null, 'polygon']
	    }
	  });
	  drawingManager.setMap(map);

	  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
	    if (e.type != google.maps.drawing.OverlayType.MARKER) {
	      // Switch back to non-drawing mode after drawing a shape.
	      drawingManager.setDrawingMode(null);

	      // Add an event listener that selects the newly-drawn shape when the user
	      // mouses down on it.
	      var newShape = e.overlay;
	      newShape.type = e.type;
	      newShape.id = id;
	      id++;
	      newShape.clickable = true;
				newShape.price = 1;
				newShape.name ="";
	      google.maps.event.addListener(newShape, 'click', function() {
	        setSelection(newShape);
	      });
	      setSelection(newShape);

	    }
	  });
	  
	   google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
		 google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);

	  google.maps.event.addDomListener(priceInput, 'input', function(e, v) {
	  if (selectedShape) {
	  	selectedShape.price = parseInt(e.srcElement.value);
	    adjustShapeColor(selectedShape);
	   
	  }
	  });
	  google.maps.event.addDomListener(nameInput, 'input', function(e, v) {
	  if (selectedShape) {
	  	selectedShape.name = e.srcElement.value;
	  
	  }
	  });
	}

	var rebalancerNames=[{name:'Nick', num:"773-202-8735", status:"Busy"},{name:'Max', num:"773-324-9836", status:"Busy"},
	{name:'Greg', num:"512-442-333", status:"Busy"},{name:'Jason', num:"773-123-4125", status:"Busy"},{name:'Steve', num:"773-333-4124", status:"Available"},
	{name:'Mike', num:"512-357-4536", status:"Busy"},{name:'Karen', num:"512-202-6423", status:"Available"},{name:'Otter', num:"512-953-3124", status:"Busy"},
	{name:'Josh', num:"512-556-3121", status:"Busy"},{name:'Tom', num:"512-331-3134", status:"Busy"}]
	var rebalancers = [];
	function getRandomArbitrary(min, max) {
		  return (Math.random() * (max - min)) + min;
		}
	for (var i =0; i < 10; i++){
		var randomLat = getRandomArbitrary(30.244047, 30.308205)
		var randomLon = getRandomArbitrary(-97.773020, -97.712193)
		rebalancers.push({lat:randomLat, lng:randomLon, content:"<p><b>"+ rebalancerNames[i].name + "</b></p><p><i class='fa fa-phone' aria-hidden='true'></i> "+
			rebalancerNames[i].num + "</p><p>" + rebalancerNames[i].status + "</p>"})
	}

	var vehicles;

	$(document).on('click', '.rebalancer', function(){
		var id = $(this).attr('id');
		id = id.split('-')[1];
		plotRebalancer(id);
	})

	$(document).on("click", '#seeAllRebalancers', function(){
		plotAllRebalancers();
	})

	function plotAllRebalancers(){
		for (var i = 0; i < rebalancerMarkers.length; i++){
			rebalancerMarkers[i].setVisible(false);
			infoWindowList[i].close();
		}
		for (var i = 0; i < rebalancers.length; i++){
			var marker = new google.maps.Marker({
	            position: {lat:rebalancers[i].lat,lng:rebalancers[i].lng},
	            icon:'/male.png'
	          });
			var infowindow = new google.maps.InfoWindow({
		    content: rebalancers[i].content
		  	});
			infoWindowList.push(infowindow)
			marker.setMap(map);
			rebalancerMarkers.push(marker);
		}
		for (var key in rebalancerMarkers){
			 google.maps.event.addListener(rebalancerMarkers[key], 'click', function(innerKey) {
		      return function() {
		      	infoWindowList.forEach(function(item){
			 		item.close();
			 	})
		          infoWindowList[innerKey].open(map, rebalancerMarkers[innerKey]);
		      }
		    }(key));
		}
		for (var i = 0; i < rebalancerMarkers.length; i++){
	        	bounds.extend(rebalancerMarkers[i].position);
	        }

	     map.fitBounds(bounds)
	     map.setZoom(12);
	}
	var rebalancerMarkers =[];
	var infoWindowList = []
	function plotRebalancer(id){
		for (var i = 0; i < rebalancerMarkers.length; i++){
			rebalancerMarkers[i].setVisible(false);
			infoWindowList[i].close();
		}
		var marker = new google.maps.Marker({
	            position: {lat:rebalancers[id].lat,lng:rebalancers[id].lng},
	            icon:'/male.png'
	          });
		var infowindow = new google.maps.InfoWindow({
	    content: rebalancers[id].content
	  });
		infoWindowList.push(infowindow)
		marker.setMap(map);
		 marker.addListener('click', function() {
		    infowindow.open(map, marker);
		  });

		map.setCenter(rebalancers[id]);
		map.setZoom(14);
		rebalancerMarkers.push(marker);
	}

	function getVehicles(){
		$.ajax({url:"/vehicles"})
		.done(function(response){
			vehicles = response; 
			var vehicleLatLons =[]
			var vehicleDetails = []
			for (var i =0; i < vehicles.placemarks.length; i++){
				vehicleLatLons.push({lat:vehicles.placemarks[i].coordinates[1], lng:vehicles.placemarks[i].coordinates[0]})
				vehicleDetails.push({fuel:vehicles.placemarks[i].fuel, name: vehicles.placemarks[i].name, address:vehicles.placemarks[i].address})
			}
		
			var markers = [];
			var infowindows = []
			for (var i = 0; i < vehicleLatLons.length; i++){
				var position = {lat:vehicleLatLons[i].lat, lng:vehicleLatLons[i].lng}
				var marker = new google.maps.Marker({
	            position: position,
	            icon: "./sportscar.png"
	          });
				var infowindow = new google.maps.InfoWindow({
				    content: "<p><b>" + vehicleDetails[i].name + "</b></p><p>Location: "+ vehicleDetails[i].address + "</p><p>Fuel level: " + vehicleDetails[i].fuel+ "</p>"
				  });
				infowindows.push(infowindow)
				marker.setMap(map);
				markers.push(marker);

			}
			for (var key in markers){
			 google.maps.event.addListener(markers[key], 'click', function(innerKey) {
		      return function() {
		      	infowindows.forEach(function(item){
			 		item.close();
			 	})
		          infowindows[innerKey].open(map, markers[innerKey]);
		      }
		    }(key));
			}
			
	        for (var i = 0; i < markers.length; i++){
	        	bounds.extend(markers[i].position);
	        }

	              map.fitBounds(bounds)


		        var markerCluster = new MarkerClusterer(map, markers,
	            {imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'});

		})
	}

	function adjustShapeColor(shape) {
	var color = null;
	switch(shape.price) {
  case 1:
  	color = 'rgb(248,255,26)';
  	break;
  case 2:
  	color = 'rgb(255,225,26)';
  	break;
  case 3:
  	color = 'rgb(255,195,26)';
  	break;
  case 4:
  	color = 'rgb(255,156,26)';
  	break;
  case 5:
  	color = 'rgb(255,125,26)';
  	break;
  case 6:
  	color = 'rgb(255,95,26)';
  	break;
  case 7:
  	color = 'rgb(255,79,26)';
  	break;
  case 8:
  	color = 'rgb(255,64,26)';
  	break;
  case 9:
  	color = 'rgb(255,49,26)';
  	break;
  case 10:
  	color = 'rgb(255,26,26)';
  	break;
  }

	if (color) {
    shape.setOptions({
      fillColor: color
    });
  }
}





	

})