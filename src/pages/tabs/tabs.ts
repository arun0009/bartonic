import {MyRoutesPage} from "../myroutes/myroutes";
import {AddRoutePage} from "../addroute/addroute";
import {QuickLookupPage} from "../quicklookup/quicklookup";
import {MapPage} from "../map/map";
import {InfoPage} from "../info/info";
import {Component, ViewChild} from "@angular/core";
import {BartHelperService} from "../../services/BartHelperService";
import {Tabs} from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  myroutes:any = MyRoutesPage;
  addroute:any = AddRoutePage;
  quicklookup:any = QuickLookupPage;
  map:any = MapPage;
  info:any = InfoPage;

  @ViewChild('bartonicTabs')
  tabRef:Tabs;
  favRoutes:any;
  bartHelperService:BartHelperService;

  constructor(bartHelperService:BartHelperService) {
    this.bartHelperService = bartHelperService;
    this.favRoutes = this.bartHelperService.getFavoriteRoutes();
  }

  ionViewDidEnter() {
    if (this.favRoutes.length > 0) {
      this.tabRef.select(0)
    } else {
      this.tabRef.select(1);
    }
  }
}
