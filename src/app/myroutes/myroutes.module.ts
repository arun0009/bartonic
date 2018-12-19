import { IonicModule } from "@ionic/angular";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MyRoutesPage } from "./myroutes";
import { ComponentsModule } from "../components/component.module";
import { MyRouteSchedulePage } from "../myrouteschedule/myrouteschedule";

const routes: Routes = [
  { path: "myrouteschedule", component: MyRouteSchedulePage },
  { path: "", component: MyRoutesPage }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyRoutesPage]
})
export class MyRoutesModule {}
