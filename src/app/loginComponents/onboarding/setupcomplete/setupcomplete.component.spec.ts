import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { SetupCompleteComponent } from './setupcomplete.component';

describe('SetupCompleteComponent', () => {
  let component: SetupCompleteComponent;
  let fixture: ComponentFixture<SetupCompleteComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupCompleteComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should say "Setup Complete"', () => {
    de = fixture.debugElement.query(By.css('h3'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Setup Complete');
  });
});
