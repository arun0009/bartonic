import { Http, URLSearchParams } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable, interval } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";

@Injectable()
export class ScheduledDepartureDetailsService {
  http: Http;

  constructor(http: Http) {
    this.http = http;
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
    const params = new URLSearchParams();
    params.set("cmd", cmd);
    params.set("a", a);
    params.set("b", b);
    params.set("orig", origin);
    params.set("dest", destination);
    params.set("time", time);
    params.set("json", "y");
    params.set("key", "ZMVD-UB67-IYVQ-DT35");
    console.log(params.toString());

    return interval(10000)
      .pipe(startWith(0))
      .pipe(
        switchMap(() =>
          this.http.get("http://api.bart.gov/api/sched.aspx", {
            search: params
          })
        )
      );
  }

  getTrainHeadStations(scheduledDepartureDetails) {
    var trainHeadStations = [];
    console.log("scheduledDepartureDetails is ??? ", scheduledDepartureDetails);
    scheduledDepartureDetails._body.root.schedule.request.trip.forEach(
      trips => {
        var trainHeadStation =
          trips.leg === Array
            ? trips.leg[0]._trainHeadStation
            : trips.leg._trainHeadStation;
        if (trainHeadStations.indexOf(trainHeadStation) === -1) {
          trainHeadStations.push(trainHeadStation);
        }
      }
    );
    return trainHeadStations;
  }
}
