"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SelectComponent = (function () {
    function SelectComponent() {
        this.select = new core_1.EventEmitter();
    }
    SelectComponent.prototype.ngOnChanges = function () {
        this.obj = this.default;
    };
    SelectComponent.prototype.changedSelect = function (obj) {
        this.select.emit(obj);
    };
    return SelectComponent;
}());
__decorate([
    core_1.Input()
], SelectComponent.prototype, "items", void 0);
__decorate([
    core_1.Input()
], SelectComponent.prototype, "field", void 0);
__decorate([
    core_1.Input()
], SelectComponent.prototype, "default", void 0);
__decorate([
    core_1.Output()
], SelectComponent.prototype, "select", void 0);
SelectComponent = __decorate([
    core_1.Component({
        selector: 'app-select',
        templateUrl: './select.component.html'
    })
], SelectComponent);
exports.SelectComponent = SelectComponent;
