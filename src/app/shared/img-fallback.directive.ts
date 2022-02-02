import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[fallback]'
})
export class ImgFallbackDirective {
  @Input() fallback: string;
  changed: boolean;
  img: any;
  constructor(elementRef: ElementRef) {
    this.changed = false;
    this.img = elementRef.nativeElement;
  }
  @HostListener('error') onError() {
    if (!this.changed) {
      this.changed = true;
      this.img.src = this.fallback;
    }
  }
}
