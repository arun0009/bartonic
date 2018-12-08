import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { BartHelperService } from "../services/BartHelperService";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  providers: [BartHelperService],
  styleUrls: ["app.scss"]
})
export class BARTonic {
  constructor(
    platform: Platform,
    router: Router,
    splashScreen: SplashScreen,
    statusBar: StatusBar,
    private bartHelperService: BartHelperService
  ) {
    splashScreen.show();
    this.bartHelperService = bartHelperService;
    platform.ready().then(() => {
      this.bartHelperService.loadFavoriteRoutes().then(() => {
        console.log("loaded fav routes");
        this.bartHelperService = bartHelperService;
        var favRoutes = this.bartHelperService.getFavoriteRoutes();
        console.log("favRoutes length is : ", favRoutes.length);
        if (favRoutes.length > 0) {
          router.navigateByUrl("/tabs/(myroutes:myroutes)");
        } else {
          router.navigateByUrl("/tabs/(addroute:addroute)");
        }
        statusBar.styleDefault();
        splashScreen.hide();
      });
    });
  }
}
