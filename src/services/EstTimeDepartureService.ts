import {Http, URLSearchParams} from "@angular/http";
import {Injectable} from "@angular/core";
import "rxjs/Rx";
import {Observable} from 'rxjs/Rx';

declare var X2JS:any;

@Injectable()
export class EstTimeDepartureService {
  http:Http;

  constructor(http:Http) {
    this.http = http;
  }

  getEstTimeDeparture(origin:string) : Observable<any> {
    let params:URLSearchParams = new URLSearchParams();
    params.set('cmd', 'etd');
    params.set('orig', origin);
    params.set('key', "ZMVD-UB67-IYVQ-DT35")
    return this.http.get('http://api.bart.gov/api/etd.aspx', {
      search: params
    }).map(res => {
      var x2js = new X2JS();
      return x2js.xml_str2json(res.text());
    });
  }

  getEstimatedDeparturesForHeadStations(estTimeDeparture, trainHeadStations) {
    var estDepartureDetails = [];
    if (Array.isArray(estTimeDeparture.root.station.etd)) {
      estTimeDeparture.root.station.etd.forEach((estTimeDepature) => {
        if (trainHeadStations.indexOf(estTimeDepature.abbreviation) != -1) {
          estDepartureDetails.push(estTimeDepature)
        }
      })
    } else {
      estDepartureDetails.push(estTimeDeparture.root.station.etd);
    }
    return estDepartureDetails;
  }

  compareDepartureTimes(a, b) {
    var a_departureTime = (Array.isArray(a.estimate)) ? a.estimate[0].minutes : a.estimate.minutes;
    a_departureTime = isNaN(a_departureTime) ? 0 : a_departureTime;
    var b_departureTime = (Array.isArray(b.estimate)) ? b.estimate[0].minutes : b.estimate.minutes;
    b_departureTime = isNaN(b_departureTime) ? 0 : b_departureTime;
    if (a_departureTime < b_departureTime)
      return -1;
    else if (a_departureTime > b_departureTime)
      return 1;
    else
      return 0;
  }
}

