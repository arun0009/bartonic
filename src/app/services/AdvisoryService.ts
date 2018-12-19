import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AdvisoryService {
  httpclient: HttpClient;

  constructor(httpclient: HttpClient) {
    this.httpclient = httpclient;
  }

  advisoryResponse(): Observable<any> {
    return this.httpclient.get(
      "http://api.bart.gov/api/bsa.aspx?cmd=bsa&date=today&key=ZMVD-UB67-IYVQ-DT35&json=y"
    );
  }
}
