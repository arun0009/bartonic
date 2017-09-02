import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { Storage } from '@ionic/storage';

@Injectable()
export class BartHelperService {
  platform: any;
  storage: any;
  favRoutes: any[];

  constructor(platform: Platform, storage: Storage) {
    this.platform = platform;
    this.storage = storage;
  }

  loadFavoriteRoutes(): Promise<boolean> {
    //NativeStorage.clear();
    return new Promise<boolean>((resolve, reject) => {
      this.favRoutes = [];
      console.log("exec custom promise");
      this.storage.ready().then(() => {
        this.storage.get("favoriteRoutes").then(
          favoriteRoutes => {
            if (favoriteRoutes != null){
              this.favRoutes = JSON.parse(favoriteRoutes);
            } else {
              this.favRoutes = [];
            }
            resolve(true);
          });
      });
    });

  }

  getFavoriteRoutes(): any[] {
    return this.favRoutes;
  }

  addToFavoriteRoutes(favoriteRoutes): void {
    this.favRoutes = favoriteRoutes;
    console.log(JSON.stringify(favoriteRoutes));
    this.storage.set('favoriteRoutes', JSON.stringify(favoriteRoutes));
    return;
  }
}
