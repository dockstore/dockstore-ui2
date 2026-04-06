import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';

/**
 * To use this component, wrap your original component with this component's <app-loading> tags
 * and set [loading] equal to whatever your component uses to determine whether it's loading or not.
 * Example:
 * <app-loading [loading]="true">My component</app-loading>
 * @export
 * @class LoadingComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [NgIf, MatProgressBarModule],
})
export class LoadingComponent {
  @Input() loading = true;
  @Input() retainContent = false;
}
