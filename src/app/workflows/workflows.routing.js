"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var workflows_component_1 = require("./workflows.component");
var search_component_1 = require("./search/search.component");
var workflow_component_1 = require("../workflow/workflow.component");
var WORKFLOWS_ROUTES = [
    {
        path: '', component: workflows_component_1.WorkflowsComponent, children: [
            { path: '', component: search_component_1.SearchWorkflowsComponent },
            { path: '**', component: workflow_component_1.WorkflowComponent }
        ]
    }
];
exports.workflowsRouting = router_1.RouterModule.forChild(WORKFLOWS_ROUTES);
