import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { EntryBoxesComponent } from './entry-boxes.component';

describe('EntryBoxesComponent', () => {
  let component: EntryBoxesComponent;
  let fixture: ComponentFixture<EntryBoxesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EntryBoxesComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [RouterTestingModule, MatButtonModule, MatIconModule, MatDialogModule],
        providers: [RegisterToolService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
