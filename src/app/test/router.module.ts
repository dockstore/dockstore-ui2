import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './router-stubs';
import { AppModule } from '../app.module';

/**
 * This module is to appease angular AOT, it is not actually used.
 */
@NgModule({
    imports: [
        AppModule
    ],
    declarations: [
        RouterLinkStubDirective,
        RouterOutletStubComponent
    ]
})
export class RouterModule {}
