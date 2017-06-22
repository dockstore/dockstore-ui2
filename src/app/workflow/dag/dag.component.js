"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dag_service_1 = require("./dag.service");
var core_1 = require("@angular/core");
var DagComponent = (function () {
    function DagComponent(dagService, workflowService) {
        this.dagService = dagService;
        this.workflowService = workflowService;
        this.expanded = false;
    }
    DagComponent.prototype.refreshDocument = function () {
        var self = this;
        if (this.dagResult !== null) {
            this.element = document.getElementById('cy');
            console.log(typeof (this.element));
            console.log(typeof (this.el));
            this.cy = cytoscape({
                container: this.element,
                boxSelectionEnabled: false,
                autounselectify: true,
                layout: {
                    name: 'dagre'
                },
                style: this.style,
                elements: this.dagPromise
            });
        }
        self.cy.on('mouseover', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function () {
            var node = this;
            var name = this.data('name');
            var tool = this.data('tool');
            var type = this.data('type');
            var docker = this.data('docker');
            var run = this.data('run');
            var runText = self.dagService.getTooltipText(name, tool, type, docker, run);
            var tooltip = node.qtip({
                content: {
                    text: runText,
                    title: node.data('name')
                },
                show: {
                    solo: true
                },
                style: {
                    classes: 'qtip-bootstrap',
                }
            });
            var api = tooltip.qtip('api');
            api.toggle(true);
        });
        self.cy.on('mouseout mousedown', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function () {
            var node = this;
            var api = node.qtip('api');
            api.destroy();
        });
        self.cy.on('mouseout', 'node', function () {
            var node = this;
            self.cy.elements().removeClass('notselected');
            node.connectedEdges().animate({
                style: {
                    'line-color': '#9dbaea',
                    'target-arrow-color': '#9dbaea',
                    'width': 3
                }
            }, {
                duration: 150
            });
        });
        self.cy.on('mouseover', 'node', function () {
            var node = this;
            self.cy.elements().difference(node.connectedEdges()).not(node).addClass('notselected');
            node.outgoers('edge').animate({
                style: {
                    'line-color': '#e57373',
                    'target-arrow-color': '#e57373',
                    'width': 5
                }
            }, {
                duration: 150
            });
            node.incomers('edge').animate({
                style: {
                    'line-color': '#81c784',
                    'target-arrow-color': '#81c784',
                    'width': 5
                }
            }, {
                duration: 150
            });
        });
        $(document).on('keyup', function (e) {
            // Keycode 27 is the ESC key
            if (e.keyCode === 27) {
                self.expanded = false;
                self.refreshDocument();
            }
        });
        self.cy.on('tap', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function () {
            try {
                if (this.data('tool') !== 'https://hub.docker.com/_/' && this.data('tool') !== '' && this.data('tool') !== undefined) {
                    window.open(this.data('tool'));
                }
            }
            catch (e) {
                if (this.data('tool') !== 'https://hub.docker.com/_/' && this.data('tool') !== '' && this.data('tool') !== undefined) {
                    window.location.href = this.data('tool');
                }
            }
        });
    };
    DagComponent.prototype.toggleExpand = function () {
        this.expanded = !this.expanded;
        this.refreshDocument(); // This will set the DAG after the view has been checked
    };
    DagComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dagPromise = this.dagService.getCurrentDAG(this.id, this.defaultVersion.id).toPromise();
        this.dagService.getCurrentDAG(this.id, this.defaultVersion.id).subscribe(function (result) {
            _this.dagResult = result;
            _this.updateMissingTool();
        });
        this.workflowService.workflow$.subscribe(function (workflow) { return _this.workflow = workflow; });
        this.selectVersion = this.defaultVersion;
        this.style = this.dagService.style;
        this.missingTool = false;
    };
    DagComponent.prototype.updateMissingTool = function () {
        if (this.dagResult.edges.length < 1 && this.dagResult.nodes.length < 1) {
            this.missingTool = true;
        }
        else {
            this.missingTool = false;
        }
    };
    DagComponent.prototype.download = function () {
        var pngDAG = this.cy.png({ full: true, scale: 2 });
        var name = this.workflow.repository + '_' + this.selectVersion.name + '.png';
        $('#exportLink').attr('href', pngDAG).attr('download', name);
    };
    DagComponent.prototype.ngAfterViewInit = function () {
        this.refreshDocument();
    };
    DagComponent.prototype.onChange = function (version) {
        var _this = this;
        this.dagService.getCurrentDAG(this.id, version.id).subscribe(function (result) {
            _this.dagResult = result;
            _this.updateMissingTool();
        });
    };
    return DagComponent;
}());
__decorate([
    core_1.Input()
], DagComponent.prototype, "validVersions", void 0);
__decorate([
    core_1.Input()
], DagComponent.prototype, "defaultVersion", void 0);
__decorate([
    core_1.Input()
], DagComponent.prototype, "id", void 0);
__decorate([
    core_1.ViewChild('cy')
], DagComponent.prototype, "el", void 0);
DagComponent = __decorate([
    core_1.Component({
        selector: 'app-dag',
        templateUrl: './dag.component.html',
        styleUrls: ['./dag.component.scss'],
        providers: [dag_service_1.DagService]
    })
], DagComponent);
exports.DagComponent = DagComponent;
