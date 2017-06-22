"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Logout = (function () {
    function Logout(trackLoginService, logoutService, router) {
        var _this = this;
        this.trackLoginService = trackLoginService;
        this.logoutService = logoutService;
        this.router = router;
        this.loginStateSubscription = this.trackLoginService.isLoggedIn$.subscribe(function (state) {
            _this.isLoggedIn = state;
        });
    }
    Logout.prototype.logout = function () {
        this.logoutService.logout();
    };
    Logout.prototype.ngOnDestroy = function () {
        this.loginStateSubscription.unsubscribe();
    };
    return Logout;
}());
Logout = __decorate([
    core_1.Injectable()
], Logout);
exports.Logout = Logout;
