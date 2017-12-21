let locations = [
  {title: 'Nabezo Shinjuku Sanchome Store', address: '日本〒160-0022 Tokyo, Shinjuku, 3 Chome−30−11, 新宿 高野 第 二 ビル 8F', location:{"lat":35.6911434,"lng":139.70362239999997}, foursquare_id:"4b5ec803f964a520829829e3"},
  {title: 'Rokkasen BBQ', address: '日本〒160-0023 Tokyo, Shinjuku, Nishishinjuku, 1 Chome−3−1, 新宿サンフラワービル', location:{"lat":35.6938401,"lng":139.70354940000004},foursquare_id:"4b76ac08f964a520a4572ee3"},
  {title: 'Teppan Baby', address: '1 Chome-17-4 Pocket Bldg. B1F,, Kabukicho, Shinjuku, Tokyo 160-0021日本', location:{"lat":35.6960834,"lng":139.70262509999998},foursquare_id:"588f32124988da5852e97d93"},
  {title: 'Ichiran Ramen', address: '日本〒160-0022 Tokyo, Shinjuku, 3 Chome−34−11, ピースビル', location:{"lat":35.69053,"lng":139.7027647}, foursquare_id:"4b5a5bc9f964a520cbbf28e3"},
  {title: 'Tsukiji Kiyomura Sushi Zanmai Higashi Shinjuku', address: '日本〒169-0072 Tokyo, 新宿区Okubo, 1 Chome−1−13, ベルバウム', location:{"lat":35.6938401,"lng":139.70354940000004},foursquare_id:"4b64158af964a5204a9e2ae3"},
];
let selectedLocation;
let markers = [];
let map;
function initMap() {
  let largeInfowindow = new google.maps.InfoWindow();
  let shinjuku = {lat: 35.6915, lng: 139.7081};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: shinjuku
  });

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.

    var position = locations[i].location;
    //console.log(JSON.stringify(position));
    var title = locations[i].title;
    var foursquare_id = locations[i].foursquare_id;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    // Push the marker to our array of markers.
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', (function(foursquare_id_copy) {
      return function() {
        populateInfoWindow(this, largeInfowindow);
        getStoreInfo(foursquare_id_copy);
      };
    })(foursquare_id));



    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
    markers.push(marker);
  }
}
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}

function highlightMarker(place){
  if (selectedLocation)
  {
  let resetMarker = markers.filter(item => item.title.search(selectedLocation.title)>-1)[0];
  resetMarker.setAnimation(null);
  }
  let highlightedMarker = markers.filter(item => item.title.search(place.title)>-1)[0];
  //console.log("highlightedMarker" + highlightedMarker);
  highlightedMarker.setAnimation(google.maps.Animation.BOUNCE);
  google.maps.event.trigger(highlightedMarker, 'click');
  setTimeout(function(){ highlightedMarker.setAnimation(null); }, 1400);
  //this.filteredArray(locations.filter(item => item.title.search(value) >-1));
  selectedLocation = place;
}
function applyFilter(placeArray){
  markers.forEach(function(marker) {
    marker.setMap(null);
  });

  placeArray.forEach(function(placeItem) {
    //console.log(placeItem.title);
    let xMarker = markers.filter(item => item.title.search(placeItem.title)>-1)[0];
    xMarker.setMap(map);
  });
}
  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }


  function getStoreInfo(v_id)
  {
    MyViewModelObj.shouldShowAlert(false);
    //****** replace with your foursquare id & secret here
    let fs_client_id ="4L1OFQIJQWWS51YFQEZIKZDLCRNOTQ0QJOIUONHS3A0X5ZDZ";
    let fs_client_secret ="NVXVPQZ3LFPUQ5LRVZNTG5TMY10T12BKBKHVQPON5VJKIPTX";
    //******
    let url ="https://api.foursquare.com/v2/venues/"+ v_id +"?client_id="+ fs_client_id +"&client_secret="+ fs_client_secret +"&v=20170801";




    $.getJSON(url, function(data) {
      //console.log('getStoreInfo' + JSON.stringify(data));
      if (data.meta.code === 200)
      {
        MyViewModelObj.venue_name(data.response.venue.name);
        MyViewModelObj.venue_url(data.response.venue.canonicalUrl);
        MyViewModelObj.img_url(data.response.venue.photos.groups[0].items[0].prefix +"200x200"+ data.response.venue.photos.groups[0].items[0].suffix);
        MyViewModelObj.venue_rate(data.response.venue.rating);
        MyViewModelObj.venue_category(data.response.venue.categories[0].name);

        MyViewModelObj.shouldShowCard(true);

        // console.log(data.response.venue.name);
        // console.log(data.response.venue.categories[0].name);
        // console.log(data.response.venue.rating);
        // console.log(data.response.venue.canonicalUrl);
        // console.log(data.response.venue.photos.groups[0].items[0].prefix);
        // console.log(data.response.venue.photos.groups[0].items[0].suffix);
      }
      else {
        MyViewModelObj.shouldShowAlert(true);
        console.log("error occured while loading data");
      }
        // Now use this data to update your view models,
        // and Knockout will update your UI automatically
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      //console.log('getStoreInfo' + JSON.stringify(jqXHR));
      //console.log('getStoreInfo' + JSON.stringify(textStatus));
      MyViewModelObj.shouldShowAlert(true);
      console.log('getStoreInfo' + JSON.stringify(errorThrown));
    });
  }
