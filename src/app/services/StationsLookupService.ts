import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class StationsLookupService {
  http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  getStations(): Observable<any> {
    return this.http.get(
      "http://api.bart.gov/api/stn.aspx?cmd=stns&key=ZMVD-UB67-IYVQ-DT35&json=y"
    );
  }
}
