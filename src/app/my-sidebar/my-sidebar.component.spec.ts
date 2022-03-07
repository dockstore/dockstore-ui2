import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MySidebarComponent } from './my-sidebar.component';

describe('MySidebarComponent', () => {
  let component: MySidebarComponent;
  let fixture: ComponentFixture<MySidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MySidebarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
