import { Component } from "@angular/core";
import { BartHelperService } from "../services/BartHelperService";
import { QuickLookupService } from "../services/QuickLookupService";
import { StationsLookupService } from "../services/StationsLookupService";
import { ScheduledDepartureDetailsService } from "../services/ScheduledDepartureDetailsService";
import { EstTimeDepartureService } from "../services/EstTimeDepartureService";
import { QuickLookup } from "../models/QuickLookup";

@Component({
  selector: "myrouteschedule",
  templateUrl: "myrouteschedule.html",
  styleUrls: ["myrouteschedule.scss"],
  providers: [
    QuickLookupService,
    StationsLookupService,
    EstTimeDepartureService,
    ScheduledDepartureDetailsService
  ]
})
export class MyRouteSchedulePage {
  quickLookups: QuickLookup[] = [];

  constructor(
    private bartHelperService: BartHelperService,
    private quickLookupService: QuickLookupService
  ) {
    this.bartHelperService = bartHelperService;
    this.quickLookupService = quickLookupService;
  }

  ngOnInit() {
    var favoriteRoutes = this.bartHelperService.loadFavoriteRoutes();
    favoriteRoutes.then(() => {
      var favRoutes = this.bartHelperService.getFavoriteRoutes();
      var route = favRoutes.filter(
        favoriteRoute => favoriteRoute.index === 1
      )[0];
      var origin = route.originAbbr;
      var destination = route.destinationAbbr;
      this.quickLookUp(origin, destination);
    });
  }

  quickLookUp(origin, destination) {
    this.quickLookupService
      .getEstimatedDeparture(origin, destination, "depart", "now", "now")
      .subscribe(
        quickLookup => {
          this.quickLookups.push(quickLookup);
        },
        err => {
          console.error("error occurred calling estimate departure ", err);
        },
        () => {
          console.log("completed quickLookUp call");
          this.quickLookups.sort((a, b) =>
            a.estDeparture.compare(b.estDeparture)
          );
        }
      );
  }
}
