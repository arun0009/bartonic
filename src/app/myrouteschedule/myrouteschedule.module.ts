import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MyRouteSchedulePage } from "./myrouteschedule";
import { ComponentsModule } from "../components/component.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild([{ path: "", component: MyRouteSchedulePage }])
  ],
  declarations: [MyRouteSchedulePage]
})
export class MyRouteScheduleModule {}
