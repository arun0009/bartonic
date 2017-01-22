import {Component} from "@angular/core";
import {Observable} from "rxjs/Rx";

@Component({
  selector: 'bart-timer',
  inputs: ['departureTime'],
  template: '{{departureTimer}}'
})
export class TimerComponent {
  public departureTime:number;
  public departureTimer:string;

  constructor() {
    let timer = Observable.timer(1000, 1000);
    timer.subscribe(t=>this.departureTimer = this.secondsToHms(this.departureTime - t));
  }

  secondsToHms(timeInSeconds) {
    var h = Math.floor(timeInSeconds / 3600);
    var m = Math.floor(timeInSeconds % 3600 / 60);
    var s = Math.floor(timeInSeconds % 3600 % 60);
    return ((h > 0 ? h + "h:" + (m < 10 ? "0" : "") : "") + m + "m:" + (s < 10 ? "0" : "") + s + "s");
  }
}
