import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnChanges {

  @Input() items: Array<any>;
  @Input() field?;
  @Input() default?: any;

  @Output() select: EventEmitter<any> = new EventEmitter();

  obj: any;

  ngOnChanges() {
    this.obj = this.default;
  }

  changedSelect(obj) {
    this.select.emit(obj);
  }

}
