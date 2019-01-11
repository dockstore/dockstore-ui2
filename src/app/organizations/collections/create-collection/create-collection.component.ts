import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';

import { TagEditorMode } from '../../../shared/enum/tagEditorMode.enum';
import { CreateCollectionQuery } from '../state/create-collection.query';
import { CreateCollectionService } from '../state/create-collection.service';

export interface FormsState {
  createCollection: {
    name: string;
    description: string;
  };
}

@Component({
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.scss']
})
export class CreateCollectionComponent implements OnInit, OnDestroy {
  createCollectionForm: FormGroup;
  public title: string;
  constructor(private createCollectionQuery: CreateCollectionQuery,
              private createCollectionService: CreateCollectionService, @Inject(MAT_DIALOG_DATA) public data: any,
              private builder: FormBuilder, private formsManager: AkitaNgFormsManager<FormsState>
  ) { }

  ngOnInit() {
    this.createCollectionService.clearState();
    let name = null;
    let description = null;
    this.formsManager.remove('createCollection');
    if (this.data.mode === TagEditorMode.Add) {
      this.title = 'Create Collection';
    } else {
      this.title = 'Edit Collection';
      name = this.data.collection.name;
      description = this.data.collection.description;
    }
    this.createCollectionForm = this.builder.group({
      name: [name, [Validators.required, Validators.maxLength(39), Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z\d]*$/)]],
      description: [description]
    });
    this.formsManager.upsert('createCollection', this.createCollectionForm);
    this.extractData();

  }

  createCollection() {
    this.createCollectionService.createCollection(this.createCollectionForm.value);
  }

  get name(): AbstractControl {
    return this.createCollectionForm.get('name');
  }

   get description(): AbstractControl {
    return this.createCollectionForm.get('description');
  }

  ngOnDestroy(): void {
    this.formsManager.unsubscribe();
  }

  extractData(): void {

  }
}
