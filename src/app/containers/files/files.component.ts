import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-files-container',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesContainerComponent implements OnInit {
  @Input() toolId: number;
  @Input() validTags;
  @Input() validTagsNames;
  @Input() defaultTag;

  constructor() { }

  ngOnInit() { }

}
