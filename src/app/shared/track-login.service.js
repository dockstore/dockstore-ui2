"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var TrackLoginService = (function () {
    function TrackLoginService(authService) {
        this.authService = authService;
        this.isLoggedIn = new BehaviorSubject_1.BehaviorSubject(this.authService.isAuthenticated());
        this.isLoggedIn$ = this.isLoggedIn.asObservable();
    }
    TrackLoginService.prototype.switchState = function (state) {
        this.isLoggedIn.next(state);
        if (state) {
            this.dockstoreToken = this.authService.getToken();
        }
    };
    return TrackLoginService;
}());
TrackLoginService = __decorate([
    core_1.Injectable()
], TrackLoginService);
exports.TrackLoginService = TrackLoginService;
