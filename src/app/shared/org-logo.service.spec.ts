import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OrgLogoService } from './org-logo.service';

@Component({
  template: '<img>'
})
class TestComponent {
}

describe('OrgLogoService', () => {
  let img: any;
  let orgLogoService: OrgLogoService;
   
  beforeEach(() => {
    img = TestBed.createComponent(TestComponent).debugElement.query(By.css('img')).nativeElement;
    orgLogoService = new OrgLogoService();
  });

  it('sets the default logo on the first failure but not subsequent failures', () => {
    img.src = 'bad.jpg';
    expect(img.src).toContain('bad.jpg');
    orgLogoService.setDefault(img);
    expect(img.src).toContain('default');

    for (let i = 0; i < 10; i++) {
      const badUrl = 'bad' + i + '.jpg';
      img.src = badUrl;
      expect(img.src).toContain(badUrl);
      orgLogoService.setDefault(img);
      expect(img.src).toContain(badUrl);
    }
  });
});
