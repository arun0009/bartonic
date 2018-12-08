import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MyRoutesPage } from "./myroutes";
import { ComponentsModule } from "../../components/component.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule.forChild([{ path: "", component: MyRoutesPage }])
  ],
  declarations: [MyRoutesPage]
})
export class MyRoutesModule {}
