"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var dockstore_model_1 = require("../shared/dockstore.model");
var md5_1 = require("ts-md5/dist/md5");
var UserService = (function () {
    function UserService(httpService) {
        this.httpService = httpService;
        this.userSource = new Subject_1.Subject();
        this.user$ = this.userSource.asObservable();
    }
    UserService.prototype.setUser = function (user) {
        this.userSource.next(user);
    };
    UserService.prototype.updateUser = function () {
        var updateUserUrl = dockstore_model_1.Dockstore.API_URI + "/users/user/updateUserMetadata";
        return this.httpService.getAuthResponse(updateUserUrl);
    };
    UserService.prototype.getUser = function () {
        var getUserUrl = dockstore_model_1.Dockstore.API_URI + "/users/user";
        return this.httpService.getAuthResponse(getUserUrl);
    };
    UserService.prototype.getTokens = function (userId) {
        var getUserTokensUrl = dockstore_model_1.Dockstore.API_URI + "/users/" + userId + "/tokens";
        return this.httpService.getAuthResponse(getUserTokensUrl);
    };
    UserService.prototype.getUserTools = function (userId) {
        var getUserToolsUrl = dockstore_model_1.Dockstore.API_URI + "/users/" + userId + "/containers";
        return this.httpService.getAuthResponse(getUserToolsUrl);
    };
    UserService.prototype.getUserWorkflowList = function (userId) {
        var getUserWorkflowUrl = dockstore_model_1.Dockstore.API_URI + "/users/" + userId + "/workflows";
        return this.httpService.getAuthResponse(getUserWorkflowUrl);
    };
    UserService.prototype.gravatarUrl = function (email, defaultImg) {
        if (email) {
            return 'https://www.gravatar.com/avatar/' + md5_1.Md5.hashStr(email) + '?d=' + defaultImg + '&s=500';
        }
        else {
            if (defaultImg) {
                return defaultImg;
            }
            else {
                return 'http://www.imcslc.ca/imc/includes/themes/imc/images/layout/img_placeholder_avatar.jpg';
            }
        }
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable()
], UserService);
exports.UserService = UserService;
