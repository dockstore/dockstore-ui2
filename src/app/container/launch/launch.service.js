"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LaunchService = (function () {
    function LaunchService() {
    }
    LaunchService.prototype.getParamsString = function (toolPath, versionName, currentDescriptor) {
        var descriptor = '';
        if (currentDescriptor === 'wdl') {
            descriptor = LaunchService.descriptorWdl;
        }
        return '$ dockstore tool convert entry2json' + descriptor + (" --entry " + toolPath + ":" + versionName + " > Dockstore.json\n            \n$ vim Dockstore.json");
    };
    LaunchService.prototype.getCliString = function (toolPath, versionName, currentDescriptor) {
        var descriptor = '';
        if (currentDescriptor === 'wdl') {
            descriptor = LaunchService.descriptorWdl;
        }
        return "$ dockstore tool launch --entry " + toolPath + ":" + versionName + " --json Dockstore.json" + descriptor;
    };
    LaunchService.prototype.getCwlString = function (toolPath, versionName) {
        return '$ cwltool --non-strict ' +
            ("https://www.dockstore.org:8443/api/ga4gh/v1/tools/" + encodeURIComponent(toolPath)) +
            ("/versions/" + encodeURIComponent(versionName) + "/plain-CWL/descriptor Dockstore.json");
    };
    LaunchService.prototype.getConsonanceString = function (toolPath, versionName) {
        return "$ consonance run --tool-dockstore-id " + toolPath + ":" + versionName + " " +
            '--run-descriptor Dockstore.json --flavour \<AWS instance-type\>';
    };
    return LaunchService;
}());
LaunchService.descriptorWdl = ' --descriptor wdl';
exports.LaunchService = LaunchService;
