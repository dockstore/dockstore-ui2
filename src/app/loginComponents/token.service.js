"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dockstore_model_1 = require("../shared/dockstore.model");
var TokenService = (function () {
    function TokenService(httpService) {
        this.httpService = httpService;
    }
    TokenService.prototype.registerToken = function (token, provider) {
        var registerTokenUrl = dockstore_model_1.Dockstore.API_URI + "/auth/tokens/" + provider;
        if (provider === 'quay.io') {
            registerTokenUrl += "?access_token=" + token;
        }
        else {
            registerTokenUrl += "?code=" + token;
        }
        return this.httpService.getAuthResponse(registerTokenUrl);
    };
    TokenService.prototype.deleteToken = function (tokenId) {
        var deleteTokenUrl = dockstore_model_1.Dockstore.API_URI + "/auth/tokens/" + tokenId;
        return this.httpService.deleteAuth(deleteTokenUrl);
    };
    return TokenService;
}());
TokenService = __decorate([
    core_1.Injectable()
], TokenService);
exports.TokenService = TokenService;
