/*
 *     Copyright 2026 OICR and UCSC
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

let nextId = 0;

/**
 * Lets a group of controls that label themselves, such as checkboxes or slide toggles, be placed inside a
 * mat-form-field, so that they can have the same outlined appearance and floating label as neighboring form fields:
 *
 * <mat-form-field>
 *   <mat-label>Show</mat-label>
 *   <div appFormFieldControlGroup aria-label="Show">
 *     <mat-checkbox>A</mat-checkbox>
 *     <mat-checkbox>B</mat-checkbox>
 *   </div>
 * </mat-form-field>
 *
 * The mat-label can't be linked to the group's element, so give the group an accessible name with aria-label.
 */
@Directive({
  selector: '[appFormFieldControlGroup]',
  standalone: true,
  providers: [{ provide: MatFormFieldControl, useExisting: FormFieldControlGroupDirective }],
  host: {
    role: 'group',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy || null',
  },
})
export class FormFieldControlGroupDirective implements MatFormFieldControl<void>, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly focusMonitor = inject(FocusMonitor);

  readonly stateChanges = new Subject<void>();
  readonly id = `app-form-field-control-group-${nextId++}`;
  readonly value = null;
  readonly placeholder = '';
  readonly ngControl = null;
  readonly empty = false;
  readonly shouldLabelFloat = true;
  readonly required = false;
  readonly disabled = false;
  readonly errorState = false;
  readonly controlType = 'app-form-field-control-group';
  // A <label> can't label a group, so don't point the mat-label at it
  readonly disableAutomaticLabeling = true;
  focused = false;
  describedBy = '';

  constructor() {
    // Track focus on any of the group's controls, so the form field shows its focused outline
    this.focusMonitor.monitor(this.elementRef, true).subscribe((origin) => {
      this.focused = origin !== null;
      this.stateChanges.next();
    });
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    // Clicks on the group's controls are handled by the controls; elsewhere in the field, focus the first control
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.elementRef.nativeElement.querySelector<HTMLElement>('input, button, [tabindex]:not([tabindex="-1"])')?.focus();
    }
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.stateChanges.complete();
  }
}
