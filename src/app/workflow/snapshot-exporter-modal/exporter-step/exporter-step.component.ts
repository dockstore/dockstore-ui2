import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';

import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { StepState } from '../step.state';

@Component({
  selector: 'app-exporter-step',
  templateUrl: './exporter-step.component.html',
  styleUrls: ['./exporter-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlexModule, MatIconModule, FontAwesomeModule, MatProgressSpinnerModule],
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
