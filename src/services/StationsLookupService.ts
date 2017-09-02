import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import "rxjs/Rx";

declare var X2JS:any;

@Injectable()
export class StationsLookupService {
  http:Http;

  constructor(http:Http) {
    this.http = http;
  }

  getStations():Observable<any> {
    return this.http.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=ZMVD-UB67-IYVQ-DT35')
      .map(res => {
        var x2js = new X2JS();
        return x2js.xml_str2json(res.text());
      });
  }
}
