"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var logout_1 = require("../logout");
var TokensComponent = (function (_super) {
    __extends(TokensComponent, _super);
    function TokensComponent(dockstoreService, tokenService, userService, trackLoginService, logoutService, router) {
        var _this = _super.call(this, trackLoginService, logoutService, router) || this;
        _this.dockstoreService = dockstoreService;
        _this.tokenService = tokenService;
        _this.userService = userService;
        return _this;
    }
    TokensComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getUser()
            .map(function (user) { return user.id; }, function (user) { return alert(user.id); })
            .flatMap(function (id) { return _this.userService.getTokens(id); })
            .subscribe(function (tokens) {
            _this.tokens = tokens;
            _this.setProperty();
        });
    };
    // Delete a token and unlink service in the UI
    TokensComponent.prototype.deleteToken = function (id) {
        var _this = this;
        this.tokenService.deleteToken(id).subscribe(function () {
            var dockstoreToken = _this.tokens.find(function (token) { return token.tokenSource === 'dockstore'; });
            _this.tokens = _this.tokens.filter(function (token) { return token.id !== id; });
            _this.setProperty();
            if (dockstoreToken.id === id) {
                _this.logout();
            }
        });
    };
    TokensComponent.prototype.setProperty = function () {
        var tokensRef = this.tokens;
        for (var _i = 0, tokensRef_1 = tokensRef; _i < tokensRef_1.length; _i++) {
            var token = tokensRef_1[_i];
            token.copyClass = false;
        }
    };
    TokensComponent.prototype.tokenCopyClassSwitch = function (id) {
        var tokensRef = this.tokens;
        for (var _i = 0, tokensRef_2 = tokensRef; _i < tokensRef_2.length; _i++) {
            var token = tokensRef_2[_i];
            if (token.id !== id) {
                token.copyClass = false;
            }
        }
    };
    TokensComponent.prototype.clickSortColumn = function (columnName) {
        if (this.sortColumn === columnName) {
            this.sortReverse = !this.sortReverse;
        }
        else {
            this.sortColumn = columnName;
            this.sortReverse = false;
        }
    };
    TokensComponent.prototype.convertSorting = function () {
        return this.sortReverse ? '-' + this.sortColumn : this.sortColumn;
    };
    TokensComponent.prototype.getIconClass = function (columnName) {
        return this.dockstoreService.getIconClass(columnName, this.sortColumn, this.sortReverse);
    };
    return TokensComponent;
}(logout_1.Logout));
TokensComponent = __decorate([
    core_1.Component({
        selector: 'app-tokens',
        templateUrl: './tokens.component.html'
    })
], TokensComponent);
exports.TokensComponent = TokensComponent;
