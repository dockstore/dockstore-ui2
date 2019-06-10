/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EntryFileTabComponent } from './entry-file-tab.component';

describe('EntryFileTabComponent', () => {
  let component: EntryFileTabComponent;
  let fixture: ComponentFixture<EntryFileTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryFileTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryFileTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
