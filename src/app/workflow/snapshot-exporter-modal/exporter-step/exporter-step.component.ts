import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { StepState } from '../step.state';

@Component({
  selector: 'app-exporter-step',
  templateUrl: './exporter-step.component.html',
  styleUrls: ['./exporter-step.component.scss'],
  standalone: true,
  imports: [FlexModule, NgIf, MatIconModule, FontAwesomeModule, MatLegacyProgressSpinnerModule, NgSwitch, NgSwitchCase, NgSwitchDefault],
})
export class ExporterStepComponent {
  @Input() stepState: StepState;
  @Input() matIcon: string;
  @Input() aiIcon: string;
  @Input() faIcon: IconDefinition;
  @Input() successText: string;
  @Input() errorText: string;
  @Input() defaultText: string;

  public readonly StepState = StepState;
}
