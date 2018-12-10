import { Component } from "@angular/core";
import { AdvisoryService } from "../services/AdvisoryService";

@Component({
  selector: "info",
  templateUrl: "info.html",
  providers: [AdvisoryService]
})
export class InfoPage {
  advisoryService: AdvisoryService;
  advisoryInfo: any;

  constructor(advisoryService: AdvisoryService) {
    this.advisoryService = advisoryService;
  }

  ngOnInit() {
    this.advisoryService
      .advisoryResponse()
      .subscribe(
        advisoryInfo => (this.advisoryInfo = advisoryInfo.root.bsa.description)
      );
  }
}
