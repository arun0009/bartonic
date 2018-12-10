import { Component } from "@angular/core";
import { BartHelperService } from "../services/BartHelperService";
import { StationsLookupService } from "../services/StationsLookupService";
import { NavController, Tabs } from "@ionic/angular";

@Component({
  selector: "addroute",
  templateUrl: "addroute.html",
  providers: [StationsLookupService]
})
export class AddRoutePage {
  stations: any[] = [];
  bartHelperService: BartHelperService;
  origin: any;
  destination: any;
  reverseDirection: boolean = false;
  cancelAddRoute: any;

  constructor(
    private nav: NavController,
    bartHelperService: BartHelperService,
    stationsLookupService: StationsLookupService
  ) {
    this.nav = nav;
    this.bartHelperService = bartHelperService;
    stationsLookupService.getStations().subscribe(response => {
      this.stations = response.root.stations.station;
    });
  }

  addRouteToFavorites() {
    var favoriteRoutes = this.bartHelperService.getFavoriteRoutes();
    console.log("favoriteRoutes are ", favoriteRoutes);
    var index = favoriteRoutes.length;
    favoriteRoutes.push({
      index: ++index,
      originAbbr: this.origin.abbr,
      originName: this.origin.name,
      destinationAbbr: this.destination.abbr,
      destinationName: this.destination.name
    });
    if (this.reverseDirection) {
      favoriteRoutes.push({
        index: ++index,
        originAbbr: this.destination.abbr,
        originName: this.destination.name,
        destinationAbbr: this.origin.abbr,
        destinationName: this.origin.name
      });
    }
    this.bartHelperService.addToFavoriteRoutes(favoriteRoutes);
  }
}
