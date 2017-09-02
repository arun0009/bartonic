webpackJsonp([0],{

/***/ 140:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 140;

/***/ }),

/***/ 183:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 183;

/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__myroutes_myroutes__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__addroute_addroute__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__quicklookup_quicklookup__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__map_map__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__info_info__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_BartHelperService__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ionic_angular__ = __webpack_require__(41);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var TabsPage = (function () {
    function TabsPage(bartHelperService) {
        this.myroutes = __WEBPACK_IMPORTED_MODULE_0__myroutes_myroutes__["a" /* MyRoutesPage */];
        this.addroute = __WEBPACK_IMPORTED_MODULE_1__addroute_addroute__["a" /* AddRoutePage */];
        this.quicklookup = __WEBPACK_IMPORTED_MODULE_2__quicklookup_quicklookup__["a" /* QuickLookupPage */];
        this.map = __WEBPACK_IMPORTED_MODULE_3__map_map__["a" /* MapPage */];
        this.info = __WEBPACK_IMPORTED_MODULE_4__info_info__["a" /* InfoPage */];
        this.bartHelperService = bartHelperService;
        this.favRoutes = this.bartHelperService.getFavoriteRoutes();
    }
    TabsPage.prototype.ionViewDidEnter = function () {
        if (this.favRoutes.length > 0) {
            this.tabRef.select(0);
        }
        else {
            this.tabRef.select(1);
        }
    };
    return TabsPage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["_13" /* ViewChild */])('bartonicTabs'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_7_ionic_angular__["f" /* Tabs */])
], TabsPage.prototype, "tabRef", void 0);
TabsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/development/misc/ionic2/bartonic/src/pages/tabs/tabs.html"*/'<ion-tabs #bartonicTabs>\n  <ion-tab [root]="myroutes" tabTitle="My Routes" tabIcon="flag"></ion-tab>\n  <ion-tab [root]="addroute" tabTitle="Add a Route" tabIcon="add-circle"></ion-tab>\n  <!--<ion-tab [root]="quicklookup" tabTitle="Quick Lookup" tabIcon="search"></ion-tab>-->\n  <ion-tab [root]="map" tabTitle="Bart Map" tabIcon="map"></ion-tab>\n  <ion-tab [root]="info" tabTitle="Info" tabIcon="information-circle"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"/development/misc/ionic2/bartonic/src/pages/tabs/tabs.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__services_BartHelperService__["a" /* BartHelperService */]])
], TabsPage);

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 230:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyRoutesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_MyRouteInfo__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_ScheduledDepartureDetailsService__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_EstTimeDepartureService__ = __webpack_require__(574);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_BartHelperService__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular__ = __webpack_require__(41);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MyRoutesPage = (function () {
    function MyRoutesPage(platform, bartHelperService, scheduledDepartureDetailsService, estTimeDepartureService) {
        this.myFavRoutes = [];
        this.originNames = [];
        this.destinationNames = [];
        this.platform = platform;
        this.scheduledDepartureDetailsService = scheduledDepartureDetailsService;
        this.estTimeDepartureService = estTimeDepartureService;
        this.bartHelperService = bartHelperService;
        this.favRoutes = bartHelperService.getFavoriteRoutes();
    }
    MyRoutesPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.myFavRoutes = [];
        this.getMyFavoriteRoutes(this.favRoutes).subscribe(function (favRoute) {
            var myFavRoute = _this.myFavRoutes.filter(function (myFavRoute) { return myFavRoute.id === favRoute.id; })[0];
            if (myFavRoute) {
                var idx = _this.myFavRoutes.indexOf(myFavRoute);
                _this.myFavRoutes[idx] = favRoute;
            }
            else {
                _this.myFavRoutes.push(favRoute);
            }
            _this.myFavRoutes.sort(function (a, b) {
                return (a.id < b.id) ? -1 : (a.id > b.id) ? 1 : 0;
            });
        }, function (err) {
            console.error("error occurred calling favorite routes ", err);
        }, function () {
            console.log("my routes : ", _this.myFavRoutes);
        });
    };
    MyRoutesPage.prototype.getMyFavoriteRoutes = function (favoriteRoutes) {
        var _this = this;
        return this.getScheduleDepuartureDetailsSource(favoriteRoutes).flatMap(function (scheduleDepartureDetailsSource) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__["Observable"].range(0, scheduleDepartureDetailsSource.length).flatMap(function (key) {
                var trainHeadStations = [];
                return scheduleDepartureDetailsSource[key].map(function (scheduledDepartureDetails) {
                    trainHeadStations = _this.scheduledDepartureDetailsService.getTrainHeadStations(scheduledDepartureDetails);
                    //$log.debug("train head stations are : " + angular.toJson(trainHeadStations));
                    var myRouteInfo = new __WEBPACK_IMPORTED_MODULE_1__models_MyRouteInfo__["a" /* MyRouteInfo */]();
                    myRouteInfo.index = favoriteRoutes[key].index;
                    myRouteInfo.id = key;
                    myRouteInfo.routeFare = scheduledDepartureDetails.root.schedule.request.trip[0]._fare;
                    myRouteInfo.destTimeMin = scheduledDepartureDetails.root.schedule.request.trip[0]._destTimeMin;
                    myRouteInfo.hasLink = false;
                    if (scheduledDepartureDetails.root.schedule.request.trip[0].leg === Array) {
                        myRouteInfo.hasLink = true;
                        myRouteInfo.trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg[0]._trainHeadStation;
                    }
                    else {
                        myRouteInfo.trainHeadStation = scheduledDepartureDetails.root.schedule.request.trip[0].leg._trainHeadStation;
                    }
                    return myRouteInfo;
                }).flatMap(function (myRouteInfo) {
                    return _this.setEstimatedDepartureDetails(myRouteInfo, favoriteRoutes[myRouteInfo.id].originAbbr, trainHeadStations);
                });
            });
        });
    };
    MyRoutesPage.prototype.getScheduleDepuartureDetailsSource = function (favoriteRoutes) {
        var scheduleDepartureDetailsObservables = [];
        for (var i = 0; i < favoriteRoutes.length; i++) {
            var originAbbr = favoriteRoutes[i].originAbbr;
            var destinationAbbr = favoriteRoutes[i].destinationAbbr;
            this.originNames.push(favoriteRoutes[i].originName);
            this.destinationNames.push(favoriteRoutes[i].destinationName);
            //$log.debug("pushing in " + originAbbr + " destination is : " + destinationAbbr);
            scheduleDepartureDetailsObservables.push(this.scheduledDepartureDetailsService.getScheduledDepartureDetailsObservable(originAbbr, destinationAbbr, 'depart', 'now', 'now'));
        }
        return __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__["Observable"].of(scheduleDepartureDetailsObservables);
    };
    MyRoutesPage.prototype.setEstimatedDepartureDetails = function (myRouteInfo, originAbbr, trainHeadStations) {
        var _this = this;
        return this.estTimeDepartureService.getEstTimeDeparture(originAbbr).map(function (response) {
            var estTimeDeparture = response;
            myRouteInfo.originName = _this.originNames[myRouteInfo.id];
            myRouteInfo.destinationName = _this.destinationNames[myRouteInfo.id];
            var estDepartureDetails = _this.estTimeDepartureService.getEstimatedDeparturesForHeadStations(estTimeDeparture, trainHeadStations);
            //$log.debug("before sort --> " + angular.toJson(estDepartureDetails));
            estDepartureDetails = estDepartureDetails.sort(_this.estTimeDepartureService.compareDepartureTimes);
            //$log.debug("after sort --> " + angular.toJson(estDepartureDetails));
            if (estDepartureDetails != null) {
                //should be a way to filter and return first object?
                if (estDepartureDetails instanceof Array) {
                    estDepartureDetails = estDepartureDetails[0];
                }
                if (estDepartureDetails !== null) {
                    if (estDepartureDetails["estimate"].length > 1) {
                        myRouteInfo.estDeparture = isNaN(estDepartureDetails["estimate"][0].minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails["estimate"][0].minutes) * 60;
                        myRouteInfo.carLength = estDepartureDetails["estimate"][0].length;
                    }
                    else {
                        myRouteInfo.estDeparture = isNaN(estDepartureDetails["estimate"].minutes) ? 'LEAVING_NOW' : parseInt(estDepartureDetails["estimate"].minutes) * 60;
                        myRouteInfo.carLength = estDepartureDetails["estimate"].length;
                    }
                }
                else {
                    myRouteInfo.estDeparture = 'No Service';
                }
            }
            return myRouteInfo;
        });
    };
    return MyRoutesPage;
}());
MyRoutesPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'myroutes',template:/*ion-inline-start:"/development/misc/ionic2/bartonic/src/pages/myroutes/myroutes.html"*/'<ion-navbar *navbar>\n  <ion-title>My Routes</ion-title>\n</ion-navbar>\n<ion-content padding="false" has-bouncing="false">\n  <ion-row>Arun</ion-row>\n  <ion-list show-delete="data.showDelete" show-reorder="data.showReorder">\n    <ion-item *ngFor="let myRoute of myFavRoutes" (click)="myroutes.getRouteSchedules(myRoute)">\n      <ion-row>\n        <ion-col width-67>\n          <small> {{myRoute.originName}}</small>\n        </ion-col>\n        <ion-col text-right>\n                        <span *ngIf="myRoute.estDeparture === \'LEAVING_NOW\'">\n                            <small>Leaving ({{myRoute.carLength}} car)</small>\n                        </span>\n                      <span *ngIf="myRoute.estDeparture === \'No Service\'">\n                            <small>No Service</small>\n                        </span>\n                        <span *ngIf="myRoute.estDeparture > 0">\n                            <small>\n                              <bart-timer departureTime="{{myRoute.estDeparture}}"></bart-timer>\n                              ({{myRoute.carLength}} car)\n                            </small>\n                        </span>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col width-67>\n          <small><span *ngIf="myRoute.hasLink"><i icon ion-link></i></span> to {{myRoute.destinationName}}</small>\n        </ion-col>\n        <ion-col text-right *ngIf="myRoute.estDeparture !== \'No Service\'">\n          <small>${{myRoute.routeFare}}, Arr {{myRoute.destTimeMin}}</small>\n        </ion-col>\n      </ion-row>\n\n      <!--<ion-delete-button ion-minus-circled (click)="myroutes.deleteRoute(myRoute)"></ion-delete-button>-->\n      <!--<ion-reorder-button ion-navicon on-reorder="myroutes.reorderRoutes(myRoute, $fromIndex, $toIndex)"></ion-reorder-button>-->\n    </ion-item>\n  </ion-list>\n</ion-content>\n\n\n\n'/*ion-inline-end:"/development/misc/ionic2/bartonic/src/pages/myroutes/myroutes.html"*/,
        providers: [__WEBPACK_IMPORTED_MODULE_3__services_EstTimeDepartureService__["a" /* EstTimeDepartureService */], __WEBPACK_IMPORTED_MODULE_2__services_ScheduledDepartureDetailsService__["a" /* ScheduledDepartureDetailsService */]]
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6_ionic_angular__["e" /* Platform */], __WEBPACK_IMPORTED_MODULE_4__services_BartHelperService__["a" /* BartHelperService */], __WEBPACK_IMPORTED_MODULE_2__services_ScheduledDepartureDetailsService__["a" /* ScheduledDepartureDetailsService */], __WEBPACK_IMPORTED_MODULE_3__services_EstTimeDepartureService__["a" /* EstTimeDepartureService */]])
], MyRoutesPage);

//# sourceMappingURL=myroutes.js.map

/***/ }),

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddRoutePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_BartHelperService__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_StationsLookupService__ = __webpack_require__(578);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(41);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AddRoutePage = (function () {
    function AddRoutePage(nav, bartHelperService, stationsLookupService) {
        var _this = this;
        this.stations = [];
        this.reverseDirection = false;
        this.nav = nav;
        this.bartHelperService = bartHelperService;
        stationsLookupService.getStations().subscribe(function (response) {
            _this.stations = response.root.stations.station;
        });
    }
    AddRoutePage.prototype.addRouteToFavorites = function () {
        var favoriteRoutes = this.bartHelperService.getFavoriteRoutes();
        console.log("favoriteRoutes are ", favoriteRoutes);
        var index = favoriteRoutes.length;
        favoriteRoutes.push({
            index: ++index,
            originAbbr: this.origin.abbr,
            originName: this.origin.name,
            destinationAbbr: this.destination.abbr,
            destinationName: this.destination.name
        });
        if (this.reverseDirection) {
            favoriteRoutes.push({
                index: ++index,
                originAbbr: this.destination.abbr,
                originName: this.destination.name,
                destinationAbbr: this.origin.abbr,
                destinationName: this.origin.name
            });
        }
        this.bartHelperService.addToFavoriteRoutes(favoriteRoutes);
        var t = this.nav.parent;
        t.select(0);
    };
    return AddRoutePage;
}());
AddRoutePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'addroute',template:/*ion-inline-start:"/development/misc/ionic2/bartonic/src/pages/addroute/addroute.html"*/'<ion-navbar *navbar>\n  <ion-title>Add Route</ion-title>\n</ion-navbar>\n<ion-content has-bouncing="false">\n  <div padding>\n    <ion-item>\n      <ion-label>Select Origin</ion-label>\n      <ion-select [(ngModel)]="origin">\n        <ion-option *ngFor="let station of stations" [value]="station">{{station.name}}</ion-option>\n      </ion-select>\n    </ion-item>\n  </div>\n  <div padding>\n    <ion-item>\n      <ion-label>Select Destination</ion-label>\n      <ion-select [(ngModel)]="destination">\n        <ion-option *ngFor="let station of stations" [value]="station">{{station.name}}</ion-option>\n      </ion-select>\n    </ion-item>\n  </div>\n  <ion-row>\n    <ion-col>\n      <ion-item>\n        <ion-label>Add Return Route</ion-label>\n        <ion-checkbox [(ngModel)]="reverseDirection"></ion-checkbox>\n      </ion-item>\n    </ion-col>\n  </ion-row>\n  <ion-segment>\n    <ion-segment-button value="Cancel" segment-button-ios-background-color (click)="cancelAddRoute()">Cancel</ion-segment-button>\n    <ion-segment-button value="AddRoute" (click)="addRouteToFavorites()">Add to My Routes</ion-segment-button>\n  </ion-segment>\n</ion-content>\n'/*ion-inline-end:"/development/misc/ionic2/bartonic/src/pages/addroute/addroute.html"*/,
        providers: [__WEBPACK_IMPORTED_MODULE_2__services_StationsLookupService__["a" /* StationsLookupService */]]
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1__services_BartHelperService__["a" /* BartHelperService */], __WEBPACK_IMPORTED_MODULE_2__services_StationsLookupService__["a" /* StationsLookupService */]])
], AddRoutePage);

//# sourceMappingURL=addroute.js.map

/***/ }),

/***/ 255:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuickLookupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var QuickLookupPage = (function () {
    function QuickLookupPage() {
    }
    return QuickLookupPage;
}());
QuickLookupPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/development/misc/ionic2/bartonic/src/pages/quicklookup/quicklookup.html"*/'<ion-navbar *navbar>\n  <ion-title>Quick Lookup</ion-title>\n</ion-navbar>\n\n<ion-content padding class="quicklookup">\n  <h2>Quick Lookup</h2>\n\n</ion-content>\n'/*ion-inline-end:"/development/misc/ionic2/bartonic/src/pages/quicklookup/quicklookup.html"*/
    }),
    __metadata("design:paramtypes", [])
], QuickLookupPage);

//# sourceMappingURL=quicklookup.js.map

/***/ }),

/***/ 256:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MapPage = (function () {
    function MapPage() {
    }
    return MapPage;
}());
MapPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'map',template:/*ion-inline-start:"/development/misc/ionic2/bartonic/src/pages/map/map.html"*/'<ion-navbar *navbar>\n  <ion-title>BART Map</ion-title>\n</ion-navbar>\n\n<ion-content has-bouncing="false">\n  <img src="img/bart_map.jpg" height="100%" width="100%"/>\n</ion-content>\n'/*ion-inline-end:"/development/misc/ionic2/bartonic/src/pages/map/map.html"*/
    }),
    __metadata("design:paramtypes", [])
], MapPage);

//# sourceMappingURL=map.js.map

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_AdvisoryService__ = __webpack_require__(579);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var InfoPage = (function () {
    function InfoPage(advisoryService) {
        this.advisoryService = advisoryService;
    }
    InfoPage.prototype.ngOnInit = function () {
        var _this = this;
        this.advisoryService.advisoryResponse().subscribe(function (advisoryInfo) { return _this.advisoryInfo = advisoryInfo.root.bsa.description; });
    };
    return InfoPage;
}());
InfoPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'info',template:/*ion-inline-start:"/development/misc/ionic2/bartonic/src/pages/info/info.html"*/'<ion-navbar *navbar>\n  <ion-title>Advisory Information</ion-title>\n</ion-navbar>\n<ion-content padding class="info">\n  <ion-item>\n    <div>\n      <h2>Advisory Info!</h2>\n    </div>\n  </ion-item>\n  <ion-item text-wrap>  \n    <div>\n      {{advisoryInfo}}\n    </div>\n  </ion-item>\n</ion-content>\n'/*ion-inline-end:"/development/misc/ionic2/bartonic/src/pages/info/info.html"*/,
        providers: [__WEBPACK_IMPORTED_MODULE_1__services_AdvisoryService__["a" /* AdvisoryService */]]
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_AdvisoryService__["a" /* AdvisoryService */]])
], InfoPage);

//# sourceMappingURL=info.js.map

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(263);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 263:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_addroute_addroute__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_info_info__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_map_map__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_myroutes_myroutes__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_quicklookup_quicklookup__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_TimerComponent__ = __webpack_require__(580);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_status_bar__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_splash_screen__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_storage__ = __webpack_require__(253);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_5__pages_addroute_addroute__["a" /* AddRoutePage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_info_info__["a" /* InfoPage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_map_map__["a" /* MapPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_myroutes_myroutes__["a" /* MyRoutesPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_quicklookup_quicklookup__["a" /* QuickLookupPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_11__components_TimerComponent__["a" /* TimerComponent */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */]),
            __WEBPACK_IMPORTED_MODULE_14__ionic_storage__["a" /* IonicStorageModule */].forRoot()
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["a" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_5__pages_addroute_addroute__["a" /* AddRoutePage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_info_info__["a" /* InfoPage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_map_map__["a" /* MapPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_myroutes_myroutes__["a" /* MyRoutesPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_quicklookup_quicklookup__["a" /* QuickLookupPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_11__components_TimerComponent__["a" /* TimerComponent */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_12__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_13__ionic_native_splash_screen__["a" /* SplashScreen */],
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["b" /* IonicErrorHandler */] }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 300:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_BartHelperService__ = __webpack_require__(78);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, bartHelperService) {
        var _this = this;
        this.bartHelperService = bartHelperService;
        platform.ready().then(function () {
            _this.bartHelperService.loadFavoriteRoutes().then(function () {
                console.log("loaded fav routes");
                // Okay, so the platform is ready and our plugins are available.
                // Here you can do any higher level native things you might need.
                statusBar.styleDefault();
                splashScreen.hide();
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__["a" /* TabsPage */];
            });
        });
    }
    return MyApp;
}());
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        template: "<ion-nav [root]=\"rootPage\"></ion-nav>",
        providers: [__WEBPACK_IMPORTED_MODULE_5__services_BartHelperService__["a" /* BartHelperService */]]
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_5__services_BartHelperService__["a" /* BartHelperService */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyRouteInfo; });
var MyRouteInfo = (function () {
    function MyRouteInfo() {
    }
    return MyRouteInfo;
}());

//# sourceMappingURL=MyRouteInfo.js.map

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScheduledDepartureDetailsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ScheduledDepartureDetailsService = (function () {
    function ScheduledDepartureDetailsService(http) {
        this.http = http;
    }
    ScheduledDepartureDetailsService.prototype.getScheduledDepartureDetailsObservable = function (origin, destination, cmd, date, time) {
        var _this = this;
        var b = (cmd === 'depart') ? '0' : '3';
        var a = (cmd === 'depart') ? '3' : '0';
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["c" /* URLSearchParams */]();
        params.set('cmd', cmd);
        params.set('a', a);
        params.set('b', b);
        params.set('orig', origin);
        params.set('dest', destination);
        params.set('time', time);
        params.set('key', "ZMVD-UB67-IYVQ-DT35");
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].interval(10000).startWith(0)
            .switchMap(function () { return _this.http.get('http://api.bart.gov/api/sched.aspx', {
            search: params
        }).map(function (res) {
            var x2js = new X2JS();
            return x2js.xml_str2json(res.text());
        }); });
    };
    ScheduledDepartureDetailsService.prototype.getTrainHeadStations = function (scheduledDepartureDetails) {
        var trainHeadStations = [];
        scheduledDepartureDetails.root.schedule.request.trip.forEach(function (trips) {
            var trainHeadStation = (trips.leg === Array) ? trips.leg[0]._trainHeadStation : trips.leg._trainHeadStation;
            if (trainHeadStations.indexOf(trainHeadStation) === -1) {
                trainHeadStations.push(trainHeadStation);
            }
        });
        return trainHeadStations;
    };
    return ScheduledDepartureDetailsService;
}());
ScheduledDepartureDetailsService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Http */]])
], ScheduledDepartureDetailsService);

//# sourceMappingURL=ScheduledDepartureDetailsService.js.map

/***/ }),

/***/ 574:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EstTimeDepartureService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EstTimeDepartureService = (function () {
    function EstTimeDepartureService(http) {
        this.http = http;
    }
    EstTimeDepartureService.prototype.getEstTimeDeparture = function (origin) {
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["c" /* URLSearchParams */]();
        params.set('cmd', 'etd');
        params.set('orig', origin);
        params.set('key', "ZMVD-UB67-IYVQ-DT35");
        return this.http.get('http://api.bart.gov/api/etd.aspx', {
            search: params
        }).map(function (res) {
            var x2js = new X2JS();
            return x2js.xml_str2json(res.text());
        });
    };
    EstTimeDepartureService.prototype.getEstimatedDeparturesForHeadStations = function (estTimeDeparture, trainHeadStations) {
        var estDepartureDetails = [];
        if (Array.isArray(estTimeDeparture.root.station.etd)) {
            estTimeDeparture.root.station.etd.forEach(function (estTimeDepature) {
                if (trainHeadStations.indexOf(estTimeDepature.abbreviation) != -1) {
                    estDepartureDetails.push(estTimeDepature);
                }
            });
        }
        else {
            estDepartureDetails.push(estTimeDeparture.root.station.etd);
        }
        return estDepartureDetails;
    };
    EstTimeDepartureService.prototype.compareDepartureTimes = function (a, b) {
        var a_departureTime = (Array.isArray(a.estimate)) ? a.estimate[0].minutes : a.estimate.minutes;
        a_departureTime = isNaN(a_departureTime) ? 0 : a_departureTime;
        var b_departureTime = (Array.isArray(b.estimate)) ? b.estimate[0].minutes : b.estimate.minutes;
        b_departureTime = isNaN(b_departureTime) ? 0 : b_departureTime;
        if (a_departureTime < b_departureTime)
            return -1;
        else if (a_departureTime > b_departureTime)
            return 1;
        else
            return 0;
    };
    return EstTimeDepartureService;
}());
EstTimeDepartureService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Http */]])
], EstTimeDepartureService);

//# sourceMappingURL=EstTimeDepartureService.js.map

/***/ }),

/***/ 578:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StationsLookupService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var StationsLookupService = (function () {
    function StationsLookupService(http) {
        this.http = http;
    }
    StationsLookupService.prototype.getStations = function () {
        return this.http.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=ZMVD-UB67-IYVQ-DT35')
            .map(function (res) {
            var x2js = new X2JS();
            return x2js.xml_str2json(res.text());
        });
    };
    return StationsLookupService;
}());
StationsLookupService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Http */]])
], StationsLookupService);

//# sourceMappingURL=StationsLookupService.js.map

/***/ }),

/***/ 579:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdvisoryService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdvisoryService = (function () {
    function AdvisoryService(http) {
        this.http = http;
    }
    AdvisoryService.prototype.advisoryResponse = function () {
        return this.http.get('http://api.bart.gov/api/bsa.aspx?cmd=bsa&date=today&key=ZMVD-UB67-IYVQ-DT35')
            .map(function (res) {
            var x2js = new X2JS();
            return x2js.xml_str2json(res.text());
        });
    };
    return AdvisoryService;
}());
AdvisoryService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Http */]])
], AdvisoryService);

//# sourceMappingURL=AdvisoryService.js.map

/***/ }),

/***/ 580:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimerComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var TimerComponent = (function () {
    function TimerComponent() {
        var _this = this;
        var timer = __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["Observable"].timer(1000, 1000);
        timer.subscribe(function (t) { return _this.departureTimer = _this.secondsToHms(_this.departureTime - t); });
    }
    TimerComponent.prototype.secondsToHms = function (timeInSeconds) {
        var h = Math.floor(timeInSeconds / 3600);
        var m = Math.floor(timeInSeconds % 3600 / 60);
        var s = Math.floor(timeInSeconds % 3600 % 60);
        return ((h > 0 ? h + "h:" + (m < 10 ? "0" : "") : "") + m + "m:" + (s < 10 ? "0" : "") + s + "s");
    };
    return TimerComponent;
}());
TimerComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'bart-timer',
        inputs: ['departureTime'],
        template: '{{departureTimer}}'
    }),
    __metadata("design:paramtypes", [])
], TimerComponent);

//# sourceMappingURL=TimerComponent.js.map

/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BartHelperService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(253);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BartHelperService = (function () {
    function BartHelperService(platform, storage) {
        this.platform = platform;
        this.storage = storage;
    }
    BartHelperService.prototype.loadFavoriteRoutes = function () {
        var _this = this;
        //NativeStorage.clear();
        return new Promise(function (resolve, reject) {
            _this.favRoutes = [];
            console.log("exec custom promise");
            _this.storage.ready().then(function () {
                _this.storage.get("favoriteRoutes").then(function (favoriteRoutes) {
                    if (favoriteRoutes != null) {
                        _this.favRoutes = JSON.parse(favoriteRoutes);
                    }
                    else {
                        _this.favRoutes = [];
                    }
                    resolve(true);
                });
            });
        });
    };
    BartHelperService.prototype.getFavoriteRoutes = function () {
        return this.favRoutes;
    };
    BartHelperService.prototype.addToFavoriteRoutes = function (favoriteRoutes) {
        this.favRoutes = favoriteRoutes;
        console.log(JSON.stringify(favoriteRoutes));
        this.storage.set('favoriteRoutes', JSON.stringify(favoriteRoutes));
        return;
    };
    return BartHelperService;
}());
BartHelperService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
], BartHelperService);

//# sourceMappingURL=BartHelperService.js.map

/***/ })

},[258]);
//# sourceMappingURL=main.js.map