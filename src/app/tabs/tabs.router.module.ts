import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TabsPage } from "./tabs.page";
import { AddRoutePage } from "../addroute/addroute";
import { InfoPage } from "../info/info";
import { MapPage } from "../map/map";
import { MyRoutesPage } from "../myroutes/myroutes";
import { QuickLookupPage } from "../quicklookup/quicklookup";
import { MyRouteSchedulePage } from "../myrouteschedule/myrouteschedule";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "addroute",
        outlet: "addroute",
        component: AddRoutePage
      },
      {
        path: "info",
        outlet: "info",
        component: InfoPage
      },
      {
        path: "map",
        outlet: "map",
        component: MapPage
      },
      {
        path: "myroutes",
        outlet: "myroutes",
        component: MyRoutesPage
      },
      {
        path: "quicklookup",
        outlet: "quicklookup",
        component: QuickLookupPage
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/(addroute:addroute)",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
