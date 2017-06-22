"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Versions = (function () {
    function Versions(dockstoreService, dateService) {
        this.dockstoreService = dockstoreService;
        this.dateService = dateService;
        this.sortColumn = 'name';
        this.sortReverse = false;
    }
    Versions.prototype.ngOnInit = function () {
        this.dtOptions = {
            bFilter: false,
            bPaginate: false,
            columnDefs: [
                {
                    orderable: false,
                    targets: this.setNoOrderCols()
                }
            ]
        };
    };
    Versions.prototype.clickSortColumn = function (columnName) {
        if (this.sortColumn === columnName) {
            this.sortReverse = !this.sortReverse;
        }
        else {
            this.sortColumn = columnName;
            this.sortReverse = false;
        }
    };
    Versions.prototype.getIconClass = function (columnName) {
        return this.dockstoreService.getIconClass(columnName, this.sortColumn, this.sortReverse);
    };
    Versions.prototype.convertSorting = function () {
        return this.sortReverse ? '-' + this.sortColumn : this.sortColumn;
    };
    Versions.prototype.getDateTimeString = function (timestamp) {
        if (timestamp) {
            return this.dateService.getDateTimeMessage(timestamp);
        }
        else {
            return 'n/a';
        }
    };
    return Versions;
}());
__decorate([
    core_1.Input()
], Versions.prototype, "versions", void 0);
exports.Versions = Versions;
