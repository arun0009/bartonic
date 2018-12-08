webpackJsonp([0],{

/***/ 148:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BartHelperService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_native__ = __webpack_require__(377);
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
    function BartHelperService(platform) {
        this.platform = platform;
    }
    BartHelperService.prototype.loadFavoriteRoutes = function () {
        var _this = this;
        //NativeStorage.clear();
        return new Promise(function (resolve, reject) {
            console.log("exec custom promise");
            __WEBPACK_IMPORTED_MODULE_2_ionic_native__["a" /* NativeStorage */].getItem("favoriteRoutes").then(function (favoriteRoutes) {
                _this.favRoutes = JSON.parse(favoriteRoutes);
                resolve(true);
            }).catch(function (error) {
                if (error.code == 2) {
                    //favRoutes not found, set it to empty
                    _this.favRoutes = [];
                    resolve(true);
                }
                else {
                    reject(true);
                    console.log("native storage exception ", JSON.stringify(error));
                }
            });
        });
    };
    BartHelperService.prototype.getFavoriteRoutes = function () {
        return this.favRoutes;
    };
    BartHelperService.prototype.addToFavoriteRoutes = function (favoriteRoutes) {
        this.favRoutes = favoriteRoutes;
        console.log(JSON.stringify(favoriteRoutes));
        __WEBPACK_IMPORTED_MODULE_2_ionic_native__["a" /* NativeStorage */].setItem('favoriteRoutes', JSON.stringify(favoriteRoutes))
            .then(function () { return console.log('Stored item!'); }, function (error) { return console.error('Error storing item', error); });
        return;
    };
    BartHelperService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* Injectable */])(), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* Platform */]])
    ], BartHelperService);
    return BartHelperService;
}());
//# sourceMappingURL=BartHelperService.js.map

/***/ }),

/***/ 253:
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
webpackEmptyAsyncContext.id = 253;

/***/ }),

/***/ 486:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__myroutes_myroutes__ = __webpack_require__(487);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__addroute_addroute__ = __webpack_require__(512);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__quicklookup_quicklookup__ = __webpack_require__(513);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__map_map__ = __webpack_require__(514);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__info_info__ = __webpack_require__(515);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_BartHelperService__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ionic_angular__ = __webpack_require__(73);
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
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["_15" /* ViewChild */])('bartonicTabs'), 
        __metadata('design:type', __WEBPACK_IMPORTED_MODULE_7_ionic_angular__["e" /* Tabs */])
    ], TabsPage.prototype, "tabRef", void 0);
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["u" /* Component */])({template:/*ion-inline-start:"/development/github.com/bartonic/src/pages/tabs/tabs.html"*/'<ion-tabs #bartonicTabs>\n  <ion-tab [root]="myroutes" tabTitle="My Routes" tabIcon="flag"></ion-tab>\n  <ion-tab [root]="addroute" tabTitle="Add a Route" tabIcon="add-circle"></ion-tab>\n  <!--<ion-tab [root]="quicklookup" tabTitle="Quick Lookup" tabIcon="search"></ion-tab>-->\n  <ion-tab [root]="map" tabTitle="Bart Map" tabIcon="map"></ion-tab>\n  <ion-tab [root]="info" tabTitle="Info" tabIcon="information-circle"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"/development/github.com/bartonic/src/pages/tabs/tabs.html"*/
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_6__services_BartHelperService__["a" /* BartHelperService */]])
    ], TabsPage);
    return TabsPage;
}());
//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 487:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyRoutesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_MyRouteInfo__ = __webpack_require__(648);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_ScheduledDepartureDetailsService__ = __webpack_require__(649);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_EstTimeDepartureService__ = __webpack_require__(925);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_BartHelperService__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular__ = __webpack_require__(73);
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
    MyRoutesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Component */])({
            selector: 'myroutes',template:/*ion-inline-start:"/development/github.com/bartonic/src/pages/myroutes/myroutes.html"*/'<ion-navbar *navbar>\n  <ion-title>My Routes</ion-title>\n</ion-navbar>\n<ion-content padding="false" has-bouncing="false">\n  <ion-list show-delete="data.showDelete" show-reorder="data.showReorder">\n    <ion-item *ngFor="let myRoute of myFavRoutes" (click)="myroutes.getRouteSchedules(myRoute)">\n      <ion-row>\n        <ion-col width-67>\n          <small> {{myRoute.originName}}</small>\n        </ion-col>\n        <ion-col text-right>\n                        <span *ngIf="myRoute.estDeparture === \'LEAVING_NOW\'">\n                            <small>Leaving ({{myRoute.carLength}} car)</small>\n                        </span>\n                      <span *ngIf="myRoute.estDeparture === \'No Service\'">\n                            <small>No Service</small>\n                        </span>\n                        <span *ngIf="myRoute.estDeparture > 0">\n                            <small>\n                              <bart-timer departureTime="{{myRoute.estDeparture}}"></bart-timer>\n                              ({{myRoute.carLength}} car)\n                            </small>\n                        </span>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col width-67>\n          <small><span *ngIf="myRoute.hasLink"><i icon ion-link></i></span> to {{myRoute.destinationName}}</small>\n        </ion-col>\n        <ion-col text-right *ngIf="myRoute.estDeparture !== \'No Service\'">\n          <small>${{myRoute.routeFare}}, Arr {{myRoute.destTimeMin}}</small>\n        </ion-col>\n      </ion-row>\n\n      <!--<ion-delete-button ion-minus-circled (click)="myroutes.deleteRoute(myRoute)"></ion-delete-button>-->\n      <!--<ion-reorder-button ion-navicon on-reorder="myroutes.reorderRoutes(myRoute, $fromIndex, $toIndex)"></ion-reorder-button>-->\n    </ion-item>\n  </ion-list>\n</ion-content>\n\n\n\n'/*ion-inline-end:"/development/github.com/bartonic/src/pages/myroutes/myroutes.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_3__services_EstTimeDepartureService__["a" /* EstTimeDepartureService */], __WEBPACK_IMPORTED_MODULE_2__services_ScheduledDepartureDetailsService__["a" /* ScheduledDepartureDetailsService */]]
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_6_ionic_angular__["d" /* Platform */], __WEBPACK_IMPORTED_MODULE_4__services_BartHelperService__["a" /* BartHelperService */], __WEBPACK_IMPORTED_MODULE_2__services_ScheduledDepartureDetailsService__["a" /* ScheduledDepartureDetailsService */], __WEBPACK_IMPORTED_MODULE_3__services_EstTimeDepartureService__["a" /* EstTimeDepartureService */]])
    ], MyRoutesPage);
    return MyRoutesPage;
}());
//# sourceMappingURL=myroutes.js.map

/***/ }),

/***/ 512:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddRoutePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_BartHelperService__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_StationsLookupService__ = __webpack_require__(926);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(73);
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
    AddRoutePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Component */])({
            selector: 'addroute',template:/*ion-inline-start:"/development/github.com/bartonic/src/pages/addroute/addroute.html"*/'<ion-navbar *navbar>\n  <ion-title>Add Route</ion-title>\n</ion-navbar>\n<ion-content has-bouncing="false">\n  <div padding>\n    <ion-item>\n      <ion-label>Select Origin</ion-label>\n      <ion-select [(ngModel)]="origin">\n        <ion-option *ngFor="let station of stations" [value]="station">{{station.name}}</ion-option>\n      </ion-select>\n    </ion-item>\n  </div>\n  <div padding>\n    <ion-item>\n      <ion-label>Select Destination</ion-label>\n      <ion-select [(ngModel)]="destination">\n        <ion-option *ngFor="let station of stations" [value]="station">{{station.name}}</ion-option>\n      </ion-select>\n    </ion-item>\n  </div>\n  <ion-row>\n    <ion-col>\n      <ion-item>\n        <ion-label>Add Return Route</ion-label>\n        <ion-checkbox [(ngModel)]="reverseDirection"></ion-checkbox>\n      </ion-item>\n    </ion-col>\n  </ion-row>\n  <ion-segment>\n    <ion-segment-button value="Cancel" segment-button-ios-background-color (click)="cancelAddRoute()">Cancel</ion-segment-button>\n    <ion-segment-button value="AddRoute" (click)="addRouteToFavorites()">Add to My Routes</ion-segment-button>\n  </ion-segment>\n</ion-content>\n'/*ion-inline-end:"/development/github.com/bartonic/src/pages/addroute/addroute.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__services_StationsLookupService__["a" /* StationsLookupService */]]
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["c" /* NavController */], __WEBPACK_IMPORTED_MODULE_1__services_BartHelperService__["a" /* BartHelperService */], __WEBPACK_IMPORTED_MODULE_2__services_StationsLookupService__["a" /* StationsLookupService */]])
    ], AddRoutePage);
    return AddRoutePage;
}());
//# sourceMappingURL=addroute.js.map

/***/ }),

/***/ 513:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuickLookupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
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
    QuickLookupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Component */])({template:/*ion-inline-start:"/development/github.com/bartonic/src/pages/quicklookup/quicklookup.html"*/'<ion-navbar *navbar>\n  <ion-title>Quick Lookup</ion-title>\n</ion-navbar>\n\n<ion-content padding class="quicklookup">\n  <h2>Quick Lookup</h2>\n\n</ion-content>\n'/*ion-inline-end:"/development/github.com/bartonic/src/pages/quicklookup/quicklookup.html"*/
        }), 
        __metadata('design:paramtypes', [])
    ], QuickLookupPage);
    return QuickLookupPage;
}());
//# sourceMappingURL=quicklookup.js.map

/***/ }),

/***/ 514:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
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
    MapPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Component */])({
            selector: 'map',template:/*ion-inline-start:"/development/github.com/bartonic/src/pages/map/map.html"*/'<ion-navbar *navbar>\n  <ion-title>BART Map</ion-title>\n</ion-navbar>\n\n<ion-content has-bouncing="false">\n  <img src="img/bart_map.jpg" height="100%" width="100%"/>\n</ion-content>\n'/*ion-inline-end:"/development/github.com/bartonic/src/pages/map/map.html"*/
        }), 
        __metadata('design:paramtypes', [])
    ], MapPage);
    return MapPage;
}());
//# sourceMappingURL=map.js.map

/***/ }),

/***/ 515:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_AdvisoryService__ = __webpack_require__(927);
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
    InfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Component */])({
            selector: 'info',template:/*ion-inline-start:"/development/github.com/bartonic/src/pages/info/info.html"*/'<ion-navbar *navbar>\n  <ion-title>Advisory Information</ion-title>\n</ion-navbar>\n<ion-content padding class="info">\n  <ion-item>\n    <div>\n      <h2>Advisory Info!</h2>\n    </div>\n  </ion-item>\n  <ion-item text-wrap>  \n    <div>\n      {{advisoryInfo}}\n    </div>\n  </ion-item>\n</ion-content>\n'/*ion-inline-end:"/development/github.com/bartonic/src/pages/info/info.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_1__services_AdvisoryService__["a" /* AdvisoryService */]]
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_1__services_AdvisoryService__["a" /* AdvisoryService */]])
    ], InfoPage);
    return InfoPage;
}());
//# sourceMappingURL=info.js.map

/***/ }),

/***/ 516:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(517);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(610);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 610:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__(645);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_addroute_addroute__ = __webpack_require__(512);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_info_info__ = __webpack_require__(515);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_map_map__ = __webpack_require__(514);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_myroutes_myroutes__ = __webpack_require__(487);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_quicklookup_quicklookup__ = __webpack_require__(513);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_tabs_tabs__ = __webpack_require__(486);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_TimerComponent__ = __webpack_require__(928);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_3__pages_addroute_addroute__["a" /* AddRoutePage */],
                __WEBPACK_IMPORTED_MODULE_4__pages_info_info__["a" /* InfoPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_map_map__["a" /* MapPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_myroutes_myroutes__["a" /* MyRoutesPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_quicklookup_quicklookup__["a" /* QuickLookupPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_9__components_TimerComponent__["a" /* TimerComponent */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_3__pages_addroute_addroute__["a" /* AddRoutePage */],
                __WEBPACK_IMPORTED_MODULE_4__pages_info_info__["a" /* InfoPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_map_map__["a" /* MapPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_myroutes_myroutes__["a" /* MyRoutesPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_quicklookup_quicklookup__["a" /* QuickLookupPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_9__components_TimerComponent__["a" /* TimerComponent */]
            ],
            providers: []
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 645:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_native__ = __webpack_require__(377);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_tabs_tabs__ = __webpack_require__(486);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_BartHelperService__ = __webpack_require__(148);
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
    function MyApp(platform, bartHelperService) {
        var _this = this;
        this.bartHelperService = bartHelperService;
        platform.ready().then(function () {
            _this.bartHelperService.loadFavoriteRoutes().then(function () {
                console.log("loaded fav routes");
                // Okay, so the platform is ready and our plugins are available.
                // Here you can do any higher level native things you might need.
                __WEBPACK_IMPORTED_MODULE_2_ionic_native__["c" /* StatusBar */].styleDefault();
                __WEBPACK_IMPORTED_MODULE_2_ionic_native__["b" /* Splashscreen */].hide();
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_3__pages_tabs_tabs__["a" /* TabsPage */];
            });
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Component */])({
            template: "<ion-nav [root]=\"rootPage\"></ion-nav>",
            providers: [__WEBPACK_IMPORTED_MODULE_4__services_BartHelperService__["a" /* BartHelperService */]]
        }), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* Platform */], __WEBPACK_IMPORTED_MODULE_4__services_BartHelperService__["a" /* BartHelperService */]])
    ], MyApp);
    return MyApp;
}());
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 648:
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

/***/ 649:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScheduledDepartureDetailsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__ = __webpack_require__(79);
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
    ScheduledDepartureDetailsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* Injectable */])(), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Http */]])
    ], ScheduledDepartureDetailsService);
    return ScheduledDepartureDetailsService;
}());
//# sourceMappingURL=ScheduledDepartureDetailsService.js.map

/***/ }),

/***/ 925:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EstTimeDepartureService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(79);
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
    EstTimeDepartureService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* Injectable */])(), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Http */]])
    ], EstTimeDepartureService);
    return EstTimeDepartureService;
}());
//# sourceMappingURL=EstTimeDepartureService.js.map

/***/ }),

/***/ 926:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StationsLookupService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(79);
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
    StationsLookupService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* Injectable */])(), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Http */]])
    ], StationsLookupService);
    return StationsLookupService;
}());
//# sourceMappingURL=StationsLookupService.js.map

/***/ }),

/***/ 927:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdvisoryService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(79);
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
    AdvisoryService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* Injectable */])(), 
        __metadata('design:paramtypes', [__WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Http */]])
    ], AdvisoryService);
    return AdvisoryService;
}());
//# sourceMappingURL=AdvisoryService.js.map

/***/ }),

/***/ 928:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimerComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(79);
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
    TimerComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Component */])({
            selector: 'bart-timer',
            inputs: ['departureTime'],
            template: '{{departureTimer}}'
        }), 
        __metadata('design:paramtypes', [])
    ], TimerComponent);
    return TimerComponent;
}());
//# sourceMappingURL=TimerComponent.js.map

/***/ })

},[516]);
//# sourceMappingURL=main.js.map