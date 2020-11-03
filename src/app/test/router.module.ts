import { NgModule } from '@angular/core';
import { AppModule } from '../app.module';
import { RouterLinkStubDirective, RouterOutletStubComponent } from './router-stubs';

/**
 * This module is to appease angular AOT, it is not actually used.
 */
@NgModule({
  imports: [AppModule],
  declarations: [RouterLinkStubDirective, RouterOutletStubComponent],
})
export class RouterModule {}
