import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})
export class SelectComponent {
  @Input() items;
  @Input() default?;
  @Output() select: EventEmitter<any> = new EventEmitter();

  changedSelect(selectedVal) {
    this.select.emit(selectedVal);
  }
}
