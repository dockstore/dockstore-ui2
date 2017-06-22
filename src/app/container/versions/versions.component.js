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
var versions_1 = require("../../shared/versions");
var VersionsContainerComponent = (function (_super) {
    __extends(VersionsContainerComponent, _super);
    function VersionsContainerComponent(dockstoreService, dateService) {
        var _this = _super.call(this, dockstoreService, dateService) || this;
        _this.verifiedLink = dateService.getVerifiedLink();
        return _this;
    }
    VersionsContainerComponent.prototype.setNoOrderCols = function () {
        return [5, 6];
    };
    return VersionsContainerComponent;
}(versions_1.Versions));
__decorate([
    core_1.Input()
], VersionsContainerComponent.prototype, "versions", void 0);
__decorate([
    core_1.Input()
], VersionsContainerComponent.prototype, "verifiedSource", void 0);
VersionsContainerComponent = __decorate([
    core_1.Component({
        selector: 'app-versions-container',
        templateUrl: './versions.component.html',
        styleUrls: ['./versions.component.css']
    })
], VersionsContainerComponent);
exports.VersionsContainerComponent = VersionsContainerComponent;
