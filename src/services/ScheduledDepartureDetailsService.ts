import { Http, URLSearchParams } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable, interval } from "rxjs";
import { map, startWith, switchMap } from "rxjs/operators";

declare var X2JS: any;

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
    let params: URLSearchParams = new URLSearchParams();
    params.set("cmd", cmd);
    params.set("a", a);
    params.set("b", b);
    params.set("orig", origin);
    params.set("dest", destination);
    params.set("time", time);
    params.set("key", "ZMVD-UB67-IYVQ-DT35");
    return interval(10000)
      .pipe(startWith(0))
      .pipe(
        switchMap(() =>
          this.http
            .get("http://api.bart.gov/api/sched.aspx", {
              search: params
            })
            .pipe(
              map(res => {
                var x2js = new X2JS();
                return x2js.xml_str2json(res.text());
              })
            )
        )
      );
  }

  getTrainHeadStations(scheduledDepartureDetails) {
    var trainHeadStations = [];
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
