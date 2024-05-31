import { NgModule } from '@angular/core';
import { ImgFallbackDirective } from '../img-fallback.directive';

@NgModule({
  imports: [ImgFallbackDirective],
  exports: [ImgFallbackDirective],
})
export class ImgFallbackModule {}
