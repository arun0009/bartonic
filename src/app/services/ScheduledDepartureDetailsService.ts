import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, interval } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";

@Injectable()
export class ScheduledDepartureDetailsService {
  httpclient: HttpClient;

  constructor(httpclient: HttpClient) {
    this.httpclient = httpclient;
  }

  getScheduledDepartureDetailsObservable(
    origin,
    destination,
    cmd,
    date,
    time
  ): Observable<any> {
    var b = cmd === "depart" ? "0" : "3";
    var a = cmd === "depart" ? "3" : "0";
    const params = new HttpParams()
      .set("cmd", cmd)
      .set("a", a)
      .set("b", b)
      .set("orig", origin)
      .set("dest", destination)
      .set("time", time)
      .set("json", "y")
      .set("key", "ZMVD-UB67-IYVQ-DT35");
    console.log(params.toString());

    return interval(10000)
      .pipe(startWith(0))
      .pipe(
        switchMap(() =>
          this.httpclient.get("http://api.bart.gov/api/sched.aspx", {
            params
          })
        )
      );
  }

  getTrainHeadStations(scheduledDepartureDetails) {
    var trainHeadStations = [];
    console.log("scheduledDepartureDetails is ??? ", scheduledDepartureDetails);
    scheduledDepartureDetails.root.schedule.request.trip.forEach(trips => {
      var trainHeadStation =
        trips.leg === Array
          ? trips.leg[0]._trainHeadStation
          : trips.leg._trainHeadStation;
      if (trainHeadStations.indexOf(trainHeadStation) === -1) {
        trainHeadStations.push(trainHeadStation);
      }
    });
    return trainHeadStations;
  }
}
