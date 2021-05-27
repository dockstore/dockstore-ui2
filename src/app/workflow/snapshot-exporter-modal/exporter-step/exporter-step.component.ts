import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { StepState } from '../snaphot-exporter-modal.component';

@Component({
  selector: 'app-exporter-step',
  templateUrl: './exporter-step.component.html',
  styleUrls: ['./exporter-step.component.scss'],
})
export class ExporterStepComponent implements OnInit {
  @Input() stepState: StepState;
  @Input() matIcon: string;
  @Input() aiIcon: string;
  @Input() faIcon: IconDefinition;
  @Input() successText: string;
  @Input() errorText: string;

  public readonly StepState = StepState;

  constructor() {}

  ngOnInit(): void {}
}
