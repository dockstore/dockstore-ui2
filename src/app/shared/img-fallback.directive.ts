import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appFallback]',
})
export class ImgFallbackDirective {
  @Input() appFallback: string;
  changed: boolean;
  img: any;
  constructor(elementRef: ElementRef) {
    this.changed = false;
    this.img = elementRef.nativeElement;
  }
  @HostListener('error') onError() {
    // If we're here, the image referenced by img.src was not loadable.
    // Set img.src to the fallback URL once, and once only, to avoid an infinite load loop if the fallback image is not loadable
    // IMPORTANT: BEFORE YOU CHANGE THE BELOW CODE, MAKE SURE YOU COMPLETELY UNDERSTAND IT!
    if (!this.changed) {
      this.changed = true;
      this.img.src = this.appFallback;
    }
  }
}
