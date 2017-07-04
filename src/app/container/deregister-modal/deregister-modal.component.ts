import { RegisterToolService } from './../register-tool/register-tool.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deregister-modal',
  templateUrl: './deregister-modal.component.html',
  styleUrls: ['./deregister-modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(private registerToolService: RegisterToolService) { }

  ngOnInit() {
  }
  deregister() {
    this.registerToolService.deregisterTool();
  }
}
