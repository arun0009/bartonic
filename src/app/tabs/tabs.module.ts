import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TabsPageRoutingModule } from "./tabs.router.module";

import { TabsPage } from "./tabs.page";
import { AddRouteModule } from "../addroute/addroute.module";
import { InfoModule } from "../info/info.module";
import { MapModule } from "../map/map.module";
import { MyRoutesModule } from "../myroutes/myroutes.module";
import { QuickLookupModule } from "../quicklookup/quicklookup.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    AddRouteModule,
    InfoModule,
    MapModule,
    MyRoutesModule,
    QuickLookupModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
