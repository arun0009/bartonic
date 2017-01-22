import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";
import {NativeStorage} from "ionic-native";

@Injectable()
export class BartHelperService {
  platform:any;
  favRoutes:any[];

  constructor(platform:Platform) {
    this.platform = platform;
  }

  loadFavoriteRoutes():Promise<boolean> {
    //NativeStorage.clear();
    return new Promise<boolean>((resolve, reject) => {
      console.log("exec custom promise");
      NativeStorage.getItem("favoriteRoutes").then(
        favoriteRoutes => {
          this.favRoutes = JSON.parse(favoriteRoutes);
          resolve(true);
        }).catch(error => {
        if (error.code == 2) {
          //favRoutes not found, set it to empty
          this.favRoutes = [];
          resolve(true);
        } else {
          reject(true);
          console.log("native storage exception ", JSON.stringify(error));
        }
      });
    });
  }

  getFavoriteRoutes():any[] {
    return this.favRoutes;
  }

  addToFavoriteRoutes(favoriteRoutes):void {
    this.favRoutes = favoriteRoutes;
    console.log(JSON.stringify(favoriteRoutes));
    NativeStorage.setItem('favoriteRoutes', JSON.stringify(favoriteRoutes))
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
    return;
  }
}
