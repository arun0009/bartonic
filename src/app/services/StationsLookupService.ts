import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class StationsLookupService {
  httpclient: HttpClient;

  constructor(httpclient: HttpClient) {
    this.httpclient = httpclient;
  }

  getStations(): Observable<any> {
    return this.httpclient.get(
      "http://api.bart.gov/api/stn.aspx?cmd=stns&key=ZMVD-UB67-IYVQ-DT35&json=y"
    );
  }
}
