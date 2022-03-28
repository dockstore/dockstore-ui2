import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ImgFallbackDirective } from './img-fallback.directive';

@Component({
  template: '<img src="original.jpg" appFallback="fallback.jpg">'
})
class TestComponent {
}

describe('ImgFallbackDirective', () => {
  let img: any;

  beforeEach(() => {
    const component = TestBed.configureTestingModule({declarations: [ImgFallbackDirective, TestComponent]}).createComponent(TestComponent);
    img = component.debugElement.query(By.css('img')).nativeElement;
  });

  it('sets the fallback image url on the first load error but not subsequent errors', () => {

    expect(img.src).toContain('original.jpg');
    img.dispatchEvent(new ErrorEvent('error'));
    expect(img.src).toContain('fallback.jpg');

    for (let i = 0; i < 10; i++) {
      const badUrl = 'fallback' + i + '.jpg';
      img.src = badUrl;
      img.dispatchEvent(new ErrorEvent('error'));
      expect(img.src).toContain(badUrl);
    }
  });
});
