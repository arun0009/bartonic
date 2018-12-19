import { Component, NgModule } from "@angular/core";
import { RouteInfo } from "../models/RouteInfo";
import { ScheduledDepartureDetailsService } from "../services/ScheduledDepartureDetailsService";
import { EstTimeDepartureService } from "../services/EstTimeDepartureService";
import { BartHelperService } from "../services/BartHelperService";
import { range, of } from "rxjs";
import { map, flatMap } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "myroutes",
  templateUrl: "myroutes.html",
  providers: [EstTimeDepartureService, ScheduledDepartureDetailsService]
})
export class MyRoutesPage {
  favRoutes: RouteInfo[];
  myFavRoutes: RouteInfo[] = [];
  originNames: string[] = [];
  destinationNames: string[] = [];

  constructor(
    private bartHelperService: BartHelperService,
    private scheduledDepartureDetailsService: ScheduledDepartureDetailsService,
    private estTimeDepartureService: EstTimeDepartureService,
    private router: Router
  ) {
    this.scheduledDepartureDetailsService = scheduledDepartureDetailsService;
    this.estTimeDepartureService = estTimeDepartureService;
    this.bartHelperService = bartHelperService;
    this.favRoutes = bartHelperService.getFavoriteRoutes();
  }

  ionViewWillEnter() {
    console.log("configured routes: ", this.router.config);
    this.myFavRoutes = [];
    this.getMyFavoriteRoutes(this.favRoutes).subscribe(
      (favRoute: RouteInfo) => {
        var myFavRoute = this.myFavRoutes.filter(
          myFavRoute => myFavRoute.id === favRoute.id
        )[0];
        if (myFavRoute) {
          var idx = this.myFavRoutes.indexOf(myFavRoute);
          this.myFavRoutes[idx] = favRoute;
        } else {
          this.myFavRoutes.push(favRoute);
        }
        this.myFavRoutes.sort((a: any, b: any) => {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        });
      },
      err => {
        console.error("error occurred calling favorite routes ", err);
      },
      () => {
        console.log("my routes : ", this.myFavRoutes);
      }
    );
  }

  getMyFavoriteRoutes(favoriteRoutes) {
    return this.getScheduleDepuartureDetailsSource(favoriteRoutes).pipe(
      flatMap(scheduleDepartureDetailsSource => {
        return range(0, scheduleDepartureDetailsSource.length).pipe(
          flatMap(key => {
            var trainHeadStations = [];
            return scheduleDepartureDetailsSource[key]
              .map(scheduledDepartureDetails => {
                trainHeadStations = this.scheduledDepartureDetailsService.getTrainHeadStations(
                  scheduledDepartureDetails
                );
                //$log.debug("train head stations are : " + angular.toJson(trainHeadStations));
                var myRouteInfo = new RouteInfo();
                myRouteInfo.index = favoriteRoutes[key].index;
                myRouteInfo.id = key;
                myRouteInfo.routeFare =
                  scheduledDepartureDetails.root.schedule.request.trip[0]._fare;
                myRouteInfo.destTimeMin =
                  scheduledDepartureDetails.root.schedule.request.trip[0]._destTimeMin;
                myRouteInfo.hasLink = false;
                if (
                  scheduledDepartureDetails.root.schedule.request.trip[0]
                    .leg === Array
                ) {
                  myRouteInfo.hasLink = true;
                  myRouteInfo.trainHeadStation =
                    scheduledDepartureDetails.root.schedule.request.trip[0].leg[0]._trainHeadStation;
                } else {
                  myRouteInfo.trainHeadStation =
                    scheduledDepartureDetails.root.schedule.request.trip[0].leg._trainHeadStation;
                }
                return myRouteInfo;
              })
              .flatMap(myRouteInfo => {
                return this.setEstimatedDepartureDetails(
                  myRouteInfo,
                  favoriteRoutes[myRouteInfo.id].originAbbr,
                  trainHeadStations
                );
              });
          })
        );
      })
    );
  }

  getScheduleDepuartureDetailsSource(favoriteRoutes) {
    var scheduleDepartureDetailsObservables = [];
    for (var i = 0; i < favoriteRoutes.length; i++) {
      var originAbbr = favoriteRoutes[i].originAbbr;
      var destinationAbbr = favoriteRoutes[i].destinationAbbr;
      this.originNames.push(favoriteRoutes[i].originName);
      this.destinationNames.push(favoriteRoutes[i].destinationName);
      //$log.debug("pushing in " + originAbbr + " destination is : " + destinationAbbr);
      scheduleDepartureDetailsObservables.push(
        this.scheduledDepartureDetailsService.getScheduledDepartureDetailsObservable(
          originAbbr,
          destinationAbbr,
          "depart",
          "now",
          "now"
        )
      );
    }
    return of(scheduleDepartureDetailsObservables);
  }

  setEstimatedDepartureDetails(myRouteInfo, originAbbr, trainHeadStations) {
    return this.estTimeDepartureService.getEstTimeDeparture(originAbbr).pipe(
      map(response => {
        var estTimeDeparture = response;
        myRouteInfo.originName = this.originNames[myRouteInfo.id];
        myRouteInfo.destinationName = this.destinationNames[myRouteInfo.id];
        var estDepartureDetails = this.estTimeDepartureService.getEstimatedDeparturesForHeadStations(
          estTimeDeparture,
          trainHeadStations
        );

        //$log.debug("before sort --> " + angular.toJson(estDepartureDetails));
        estDepartureDetails = estDepartureDetails.sort(
          this.estTimeDepartureService.compareDepartureTimes
        );
        //$log.debug("after sort --> " + angular.toJson(estDepartureDetails));
        if (estDepartureDetails != null) {
          //should be a way to filter and return first object?
          if (estDepartureDetails instanceof Array) {
            estDepartureDetails = estDepartureDetails[0];
          }
          if (estDepartureDetails !== null) {
            if (estDepartureDetails["estimate"].length > 1) {
              myRouteInfo.estDeparture = isNaN(
                estDepartureDetails["estimate"][0].minutes
              )
                ? "LEAVING_NOW"
                : parseInt(estDepartureDetails["estimate"][0].minutes) * 60;
              myRouteInfo.carLength = estDepartureDetails["estimate"][0].length;
            } else {
              myRouteInfo.estDeparture = isNaN(
                estDepartureDetails["estimate"].minutes
              )
                ? "LEAVING_NOW"
                : parseInt(estDepartureDetails["estimate"].minutes) * 60;
              myRouteInfo.carLength = estDepartureDetails["estimate"].length;
            }
          } else {
            myRouteInfo.estDeparture = "No Service";
          }
        }
        return myRouteInfo;
      })
    );
  }

  deleteRoute(route) {
    var favoriteRoutes =
      JSON.parse(window.localStorage.getItem("favoriteRoutes")) || [];
    for (var i = 0; i < favoriteRoutes.length; i++) {
      if (
        favoriteRoutes[i].originName === route.originName &&
        favoriteRoutes[i].destinationName === route.destinationName
      ) {
        favoriteRoutes.splice(i, 1);
        for (i = route.index; i < route.length; i++) {
          var favoriteRoute = favoriteRoutes[i];
          favoriteRoute.index = parseInt(favoriteRoute.index) - 1;
          favoriteRoutes.splice(i, 1);
          favoriteRoutes.splice(i, 0, favoriteRoute);
        }
      }
    }
    window.localStorage.setItem(
      "favoriteRoutes",
      JSON.stringify(favoriteRoutes)
    );
    window.location.reload();
  }

  reorderRoutes(indexes) {
    console.log("reordering routes");
    if (indexes.from != indexes.to) {
      var favoriteRoutes: Array<RouteInfo> = this.favRoutes;
      var routeReordered: RouteInfo = favoriteRoutes[indexes.from];
      routeReordered.index = favoriteRoutes[indexes.to].index;
      favoriteRoutes.splice(indexes.from, 1);
      favoriteRoutes.splice(indexes.to, 0, routeReordered);
      if (indexes.to < indexes.from) {
        for (var i = indexes.to + 1; i <= indexes.from; i++) {
          var favoriteRoute: RouteInfo = favoriteRoutes[i];
          favoriteRoute.index = favoriteRoute.index + 1;
          favoriteRoutes.splice(i, 1);
          favoriteRoutes.splice(i, 0, favoriteRoute);
        }
      } else {
        for (var i = indexes.from; i < indexes.to; i++) {
          var favoriteRoute = favoriteRoutes[i];
          favoriteRoute.index = favoriteRoute.index - 1;
          favoriteRoutes.splice(i, 1);
          favoriteRoutes.splice(i, 0, favoriteRoute);
        }
      }
      this.bartHelperService.addToFavoriteRoutes(favoriteRoutes);
      window.location.reload();
    }
  }
}
