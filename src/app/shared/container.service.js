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
var ContainerService = (function () {
    function ContainerService(dockstoreService) {
        this.dockstoreService = dockstoreService;
        this.toolSource = new Subject_1.Subject();
        this.tool$ = this.toolSource.asObservable();
    }
    ContainerService.prototype.setTool = function (tool) {
        this.toolSource.next(tool);
    };
    ContainerService.prototype.getDescriptors = function (versions, version) {
        if (versions.length && version) {
            var typesAvailable = new Array();
            for (var _i = 0, _a = version.sourceFiles; _i < _a.length; _i++) {
                var file = _a[_i];
                var type = file.type;
                if (type === 'DOCKSTORE_CWL' && !typesAvailable.includes('cwl')) {
                    typesAvailable.push('cwl');
                }
                else if (type === 'DOCKSTORE_WDL' && !typesAvailable.includes('wdl')) {
                    typesAvailable.push('wdl');
                }
            }
            return typesAvailable;
        }
    };
    ContainerService.prototype.getBuildMode = function (mode) {
        switch (mode) {
            case 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS':
                return 'Fully-Automated';
            case 'AUTO_DETECT_QUAY_TAGS_WITH_MIXED':
                return 'Partially-Automated';
            case 'MANUAL_IMAGE_PATH':
                return 'Manual';
            default:
                return 'Unknown';
        }
    };
    ContainerService.prototype.getBuildModeTooltip = function (mode) {
        switch (mode) {
            case 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS':
                return 'Fully-Automated: All versions are automated builds';
            case 'AUTO_DETECT_QUAY_TAGS_WITH_MIXED':
                return 'Partially-Automated: At least one version is an automated build';
            case 'MANUAL_IMAGE_PATH':
                return 'Manual: No versions are automated builds';
            default:
                return 'Unknown: Build information not known';
        }
    };
    return ContainerService;
}());
ContainerService.descriptorWdl = ' --descriptor wdl';
ContainerService = __decorate([
    core_1.Injectable()
], ContainerService);
exports.ContainerService = ContainerService;
