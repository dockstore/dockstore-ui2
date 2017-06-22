"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var HttpService = (function () {
    function HttpService(http, authService) {
        this.http = http;
        this.authService = authService;
    }
    HttpService.prototype.getDockstoreToken = function () {
        return this.authService.getToken();
    };
    HttpService.prototype.addOptions = function (dockstoreToken) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        if (dockstoreToken) {
            headers.append('Authorization', "Bearer " + dockstoreToken);
        }
        return new http_1.RequestOptions({ headers: headers });
    };
    HttpService.prototype.getHeader = function (dockstoreToken) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        if (dockstoreToken) {
            headers.append('Authorization', "Bearer " + dockstoreToken);
        }
        return headers;
    };
    HttpService.prototype.getAuthResponse = function (url) {
        return this.getResponse(url, this.getDockstoreToken());
    };
    HttpService.prototype.getResponse = function (url, dockstoreToken) {
        return this.http.get(url, this.addOptions(dockstoreToken))
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Rx_1.Observable.throw(error || "Server error " + url); });
    };
    HttpService.prototype.postResponse = function (url, body, dockstoreToken) {
        return this.http.post(url, { body: body }, this.addOptions(dockstoreToken))
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Rx_1.Observable.throw(error || "Server error " + url); });
    };
    HttpService.prototype.putResponse = function (url, body, dockstoreToken) {
        return this.http.put(url, body, this.addOptions(this.authService.getToken()))
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Rx_1.Observable.throw(error || "Server error " + url); });
    };
    HttpService.prototype.deleteResponse = function (url, body, dockstoreToken) {
        return this.http.delete(url, new http_1.RequestOptions({ headers: this.getHeader(dockstoreToken), body: body }))
            .map(function (res) { return res.text(); })
            .catch(function (error) { return Rx_1.Observable.throw(error || "Server error " + url); });
    };
    HttpService.prototype.deleteAuth = function (url) {
        return this.delete(url, this.getDockstoreToken());
    };
    HttpService.prototype.delete = function (url, dockstoreToken) {
        return this.http.delete(url, this.addOptions(dockstoreToken))
            .map(function (res) { return res.text(); })
            .catch(function (error) { return Rx_1.Observable.throw(error || "Server error " + url); });
    };
    HttpService.prototype.request = function (url, myParams, method, dockstoreToken) {
        var options = new http_1.RequestOptions({
            url: url,
            headers: this.getHeader(this.authService.getToken()),
            method: method,
            params: myParams
        });
        return this.http.request(new http_1.Request(options))
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Rx_1.Observable.throw(error || "Server error " + url); });
    };
    return HttpService;
}());
HttpService = __decorate([
    core_1.Injectable()
], HttpService);
exports.HttpService = HttpService;
