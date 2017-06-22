"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListContainersService = (function () {
    function ListContainersService() {
    }
    ListContainersService.prototype.getDockerPullCmd = function (path, tagName) {
        if (tagName === void 0) { tagName = ''; }
        var dockerPullCmd = 'docker pull ';
        var prefix = 'registry.hub.docker.com/';
        if (path.indexOf(prefix) !== -1) {
            path = path.replace(prefix, '');
        }
        if (path.indexOf('_/') !== -1) {
            path = path.replace('_/', '');
        }
        dockerPullCmd += path;
        if (tagName) {
            dockerPullCmd += ':' + tagName;
        }
        return dockerPullCmd;
    };
    return ListContainersService;
}());
exports.ListContainersService = ListContainersService;
