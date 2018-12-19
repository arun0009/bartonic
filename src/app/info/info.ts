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
    this.advisoryService.advisoryResponse().subscribe(advisoryInfo => {
      console.log(
        "advisoryInfo root is ",
        advisoryInfo.root.bsa[0].description
      );
      this.advisoryInfo =
        advisoryInfo.root.bsa[0].description["#cdata-section"];
    });
  }
}
