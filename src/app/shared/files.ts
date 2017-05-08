import { Input } from '@angular/core';

export class Files {
  @Input() id: number;
  @Input() versions: Array<any>;
  @Input() default: any;
}
