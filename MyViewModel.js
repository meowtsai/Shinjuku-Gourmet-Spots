function MyViewModel() {
  var self = this;
  self.moreInfo = function(place) {
        highlightMarker(place);
        w3_close();
        //getStoreInfo(place.foursquare_id);

    };
    self.closeCard = function() {
          self.shouldShowCard(false);
          //getStoreInfo(place.foursquare_id);

      };
    self.shouldShowCard = ko.observable(false), // Venue Data from foursquare
    self.shouldShowAlert = ko.observable(false), // Message when foursquare data load failed.
    self.shouldShowMapAlert = ko.observable(false), // Message when Google Map API load failed.

    self.venue_name=ko.observable();
    self.venue_url=ko.observable();
    self.venue_details=ko.observable();
    self.venue_category=ko.observable();
    self.venue_rate=ko.observable();
    self.img_url=ko.observable();
    self.img_alt=ko.observable();
    self.filteredArray = ko.observableArray(locations);
    self.filteredValue = ko.pureComputed({
        read: function () {
        },
        write: function (value) {
            if (value)
            {
              this.filteredArray(locations.filter(item => item.title.search(value) >-1));
            }
            else {
              //console.log('no value');
              this.filteredArray(locations);
            }
            applyFilter(this.filteredArray());
        },
        owner: this
    });
}
let MyViewModelObj =  new MyViewModel();
ko.applyBindings(MyViewModelObj);
