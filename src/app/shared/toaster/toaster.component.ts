import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {

  constructor() { }
  public options: any = {timeOut: 3000, showProgressBar: false};

  ngOnInit() {
  }

}
