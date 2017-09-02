import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AddRoutePage } from '../pages/addroute/addroute';
import { InfoPage } from '../pages/info/info';
import { MapPage } from '../pages/map/map';
import { MyRoutesPage } from '../pages/myroutes/myroutes';
import { QuickLookupPage } from '../pages/quicklookup/quicklookup'
import { TabsPage } from '../pages/tabs/tabs'
import { TimerComponent } from "../components/TimerComponent";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

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
    BrowserModule, 
    HttpModule,   
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()    
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
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule { }
