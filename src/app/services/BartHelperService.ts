import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { NativeStorage } from "@ionic-native/native-storage/ngx";

@Injectable()
export class BartHelperService {
  favRoutes: any[];

  constructor(
    private platform: Platform,
    private nativeStorage: NativeStorage
  ) {
    this.platform = platform;
    this.nativeStorage = nativeStorage;
  }

  loadFavoriteRoutes(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      console.log("exec custom promise");
      this.nativeStorage
        .getItem("favoriteRoutes")
        .then(favoriteRoutes => {
          this.favRoutes = JSON.parse(favoriteRoutes);
          resolve(true);
        })
        .catch(error => {
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

  getFavoriteRoutes(): any[] {
    return this.favRoutes;
  }

  addToFavoriteRoutes(favoriteRoutes): void {
    this.favRoutes = favoriteRoutes;
    console.log(JSON.stringify(favoriteRoutes));
    this.nativeStorage
      .setItem("favoriteRoutes", JSON.stringify(favoriteRoutes))
      .then(
        () => console.log("Stored item!"),
        error => console.error("Error storing item", error)
      );
    return;
  }
}
