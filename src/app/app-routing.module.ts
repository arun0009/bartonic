import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MyRouteSchedulePage } from "./myrouteschedule/myrouteschedule";

const routes: Routes = [
  { path: "", loadChildren: "./tabs/tabs.module#TabsPageModule" }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
