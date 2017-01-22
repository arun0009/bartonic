import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {TabsPage} from "../pages/tabs/tabs";
import {BartHelperService} from "../services/BartHelperService";

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [BartHelperService]
})
export class MyApp {

  rootPage:any;
  bartHelperService:any;

  constructor(platform:Platform, bartHelperService:BartHelperService) {
    this.bartHelperService = bartHelperService;
    platform.ready().then(() => {
      this.bartHelperService.loadFavoriteRoutes().then(() => {
        console.log("loaded fav routes");
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
        Splashscreen.hide();

        this.rootPage = TabsPage;
      });
    });
  }
}
