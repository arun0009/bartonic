import { HttpClient } from "@angular/common/http";
import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class EstTimeDepartureService {
  httpclient: HttpClient;

  constructor(httpclient: HttpClient) {
    this.httpclient = httpclient;
  }

  getEstTimeDeparture(origin: string): Observable<any> {
    const params = new HttpParams()
      .set("cmd", "etd")
      .set("orig", origin)
      .set("key", "ZMVD-UB67-IYVQ-DT35")
      .set("json", "y");

    return this.httpclient.get("http://api.bart.gov/api/etd.aspx", {
      params
    });
  }

  getEstimatedDeparturesForHeadStations(estTimeDeparture, trainHeadStations) {
    var estDepartureDetails = [];
    if (Array.isArray(estTimeDeparture.root.station.etd)) {
      estTimeDeparture.root.station.etd.forEach(estTimeDepature => {
        if (trainHeadStations.indexOf(estTimeDepature.abbreviation) != -1) {
          estDepartureDetails.push(estTimeDepature);
        }
      });
    } else {
      estDepartureDetails.push(estTimeDeparture.root.station.etd);
    }
    return estDepartureDetails;
  }

  compareDepartureTimes(a, b) {
    var a_departureTime = Array.isArray(a.estimate)
      ? a.estimate[0].minutes
      : a.estimate.minutes;
    a_departureTime = isNaN(a_departureTime) ? 0 : a_departureTime;
    var b_departureTime = Array.isArray(b.estimate)
      ? b.estimate[0].minutes
      : b.estimate.minutes;
    b_departureTime = isNaN(b_departureTime) ? 0 : b_departureTime;
    if (a_departureTime < b_departureTime) return -1;
    else if (a_departureTime > b_departureTime) return 1;
    else return 0;
  }
}
