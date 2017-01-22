import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AddRoutePage } from '../pages/addroute/addroute';
import { InfoPage } from '../pages/info/info';
import { MapPage } from '../pages/map/map';
import { MyRoutesPage } from '../pages/myroutes/myroutes';
import { QuickLookupPage } from '../pages/quicklookup/quicklookup'
import { TabsPage } from '../pages/tabs/tabs'
import { TimerComponent } from "../components/TimerComponent";

@NgModule({
  declarations: [
    MyApp,
    AddRoutePage,
    InfoPage,
    MapPage,
    MyRoutesPage,
    QuickLookupPage,
    TabsPage,
    TimerComponent,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddRoutePage,
    InfoPage,
    MapPage,
    MyRoutesPage,
    QuickLookupPage,
    TabsPage,
    TimerComponent
  ],
  providers: []
})
export class AppModule { }
