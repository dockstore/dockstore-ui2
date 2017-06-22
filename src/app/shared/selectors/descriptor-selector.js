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
Object.defineProperty(exports, "__esModule", { value: true });
var version_selector_1 = require("./version-selector");
var DescriptorSelector = (function (_super) {
    __extends(DescriptorSelector, _super);
    function DescriptorSelector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DescriptorSelector.prototype.reactToVersion = function () {
        this.descriptors = this.getDescriptors(this.currentVersion);
        if (this.descriptors) {
            this.nullDescriptors = false;
            if (this.descriptors.length) {
                this.onDescriptorChange(this.descriptors[0]);
            }
        }
        else {
            this.nullDescriptors = true;
        }
    };
    DescriptorSelector.prototype.onDescriptorChange = function (descriptor) {
        this.currentDescriptor = descriptor;
        this.reactToDescriptor();
    };
    return DescriptorSelector;
}(version_selector_1.VersionSelector));
exports.DescriptorSelector = DescriptorSelector;
