"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dockstore_model_1 = require("./dockstore.model");
var ImageProviderService = (function () {
    function ImageProviderService(httpService) {
        var _this = this;
        this.httpService = httpService;
        this.dockerRegistryList = JSON.parse(localStorage.getItem('dockerRegistryList'));
        if (!this.dockerRegistryList) {
            this.getDockerRegistryList()
                .subscribe(function (registryList) {
                _this.dockerRegistryList = registryList;
                localStorage.setItem('dockerRegistryList', JSON.stringify(_this.dockerRegistryList));
            });
        }
    }
    ImageProviderService.prototype.getDockerRegistryList = function () {
        return this.httpService.getResponse(dockstore_model_1.Dockstore.API_URI + "/containers/dockerRegistryList");
    };
    ImageProviderService.prototype.setUpImageProvider = function (tool) {
        var registry = this.getImageProvider(tool.registry);
        tool.imgProvider = registry.friendlyName;
        tool.imgProviderUrl = this.getImageProviderUrl(tool.path, registry);
        return tool;
    };
    ImageProviderService.prototype.getImageProvider = function (imageProvider) {
        for (var _i = 0, _a = this.dockerRegistryList; _i < _a.length; _i++) {
            var registry = _a[_i];
            if (imageProvider === registry.enum) {
                return registry;
            }
        }
        return null;
    };
    ImageProviderService.prototype.getImageProviderUrl = function (path, registry) {
        if (path) {
            var imageRegExp = /^(.*)\/(.*)\/(.*)\/?$/i;
            var match = imageRegExp.exec(path);
            if (match) {
                var url = registry.url;
                var suffix = '';
                var containerRegistry = registry.enum;
                if (containerRegistry === 'DOCKER_HUB') {
                    url += ((match[2] !== '_') ? 'r/' : '');
                }
                else if (containerRegistry === 'GITLAB') {
                    suffix = '/container_registry';
                }
                url += match[2] + '/' + match[3] + suffix;
                return url;
            }
        }
        return null;
    };
    ImageProviderService.prototype.checkPrivateOnlyRegistry = function (tool) {
        console.log(tool.registry);
        for (var _i = 0, _a = this.dockerRegistryList; _i < _a.length; _i++) {
            var dockerReg = _a[_i];
            if (tool.registry === dockerReg.enum) {
                return dockerReg.privateOnly === 'true';
            }
        }
        return false;
    };
    return ImageProviderService;
}());
ImageProviderService = __decorate([
    core_1.Injectable()
], ImageProviderService);
exports.ImageProviderService = ImageProviderService;
