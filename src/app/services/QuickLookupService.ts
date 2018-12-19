import { Injectable } from "@angular/core";
import { StationsLookupService } from "./StationsLookupService";
import { EstTimeDepartureService } from "./EstTimeDepartureService";
import { ScheduledDepartureDetailsService } from "./ScheduledDepartureDetailsService";
import { QuickLookup } from "../models/QuickLookup";
import { of, range } from "rxjs";

@Injectable()
export class QuickLookupService {
  constructor(
    private stationsLookupService: StationsLookupService,
    private estTimeDepartureService: EstTimeDepartureService,
    private scheduledDepartureDetailsService: ScheduledDepartureDetailsService
  ) {}

  getEstimatedDeparture(origin, destination, cmd, date, time) {
    var estTimeDeparture: any;
    var stations = [];
    var headStations = [];
    return this.stationsLookupService
      .getStations()
      .map(function(response) {
        stations = response.root.stations.station;
        return stations;
      })
      .flatMap(_ => {
        return this.estTimeDepartureService
          .getEstTimeDeparture(origin)
          .map(function(response) {
            estTimeDeparture = response.root;
            return estTimeDeparture;
          });
      })
      .flatMap(_ => {
        return this.scheduledDepartureDetailsService
          .getScheduledDepartureDetailsObservable(
            origin,
            destination,
            cmd,
            date,
            time
          )
          .flatMap(response => {
            var scheduledDepartureDetails = response;
            return of(scheduledDepartureDetails.root.schedule.request.trip);
          });
      })
      .flatMap(trips => {
        return range(0, trips.length).map(function(indx) {
          var trip = trips[indx];
          var quickLookup = quickLookupFunction(
            indx,
            destination,
            trip,
            stations
          );
          headStations.push(quickLookup.trainHeadStation);
          var headStationCounter = headStations.filter(
            h => h === quickLookup.trainHeadStation
          ).length;
          var estDepartureDetails =
            estTimeDeparture.station.etd instanceof Array
              ? estTimeDeparture.station.etd.filter(
                  e => e.abbreviation === quickLookup.trainHeadStation
                )
              : estTimeDeparture.station.etd;
          if (estDepartureDetails != null && estDepartureDetails.length > 0) {
            if (estDepartureDetails instanceof Array) {
              estDepartureDetails = estDepartureDetails[0];
            }
            if (
              estDepartureDetails.estimate instanceof Array &&
              estDepartureDetails.estimate[headStationCounter - 1] !== undefined
            ) {
              //$log.debug(angular.toJson(quickLookup) +  ":::::: " + angular.toJson(estDepartureDetails));
              quickLookup.carLength =
                estDepartureDetails.estimate[headStationCounter - 1].length;
              quickLookup.estDepartureFlag = isNaN(
                estDepartureDetails.estimate[headStationCounter - 1].minutes
              )
                ? 0
                : parseInt(
                    estDepartureDetails.estimate[headStationCounter - 1].minutes
                  ) * 60;
              quickLookup.estDeparture = isNaN(
                estDepartureDetails.estimate[headStationCounter - 1].minutes
              )
                ? "LEAVING_NOW"
                : parseInt(
                    estDepartureDetails.estimate[headStationCounter - 1].minutes
                  ) * 60;
            }
          }
          return quickLookup;
        });
      });
  }
}

function quickLookupFunction(indx, destination, trip, stations) {
  var quickLookup: QuickLookup = {};
  quickLookup.destination = destination;
  quickLookup.hasLink = false;
  quickLookup.hasMoreLinks = false;
  quickLookup.id = indx;
  quickLookup.routeFare = trip._fare;
  quickLookup.origTimeMin = trip._origTimeMin;
  quickLookup.destTimeMin = trip._destTimeMin;
  if (trip.leg instanceof Array) {
    quickLookup.hasLink = true;
    quickLookup.trainHeadStation = trip.leg[0]._trainHeadStation;
    quickLookup.firstStationName = stations.filter(
      station => station.abbr === quickLookup.trainHeadStation
    )[0].name;
    quickLookup.connectingStationName = stations.filter(
      station => station.abbr === trip.leg[0]._destination
    )[0].name;
    quickLookup.destinationStationName = stations.filter(
      station => station.abbr === trip.leg[1]._trainHeadStation
    )[0].name;
    if (trip.leg[2] != null) {
      quickLookup.hasMoreLinks = true;
      quickLookup.finalConnectingStationName = stations.filter(
        station => station.abbr === trip.leg[1]._destination
      )[0].name;
      quickLookup.finalDestinationStationName = stations.filter(
        station => station.abbr === trip.leg[2]._trainHeadStation
      )[0].name;
    }
  } else {
    quickLookup.trainHeadStation = trip.leg._trainHeadStation;
    quickLookup.firstStationName = stations.filter(
      station => station.abbr === quickLookup.trainHeadStation
    )[0].name;
  }
  return quickLookup;
}
