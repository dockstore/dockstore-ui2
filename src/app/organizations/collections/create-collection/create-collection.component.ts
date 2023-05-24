import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgFormsManager } from '@ngneat/forms-manager';
import { Observable } from 'rxjs';

import { CreateCollectionQuery } from '../state/create-collection.query';
import { CreateCollectionService, FormsState } from '../state/create-collection.service';

/**
 * This is actually both create and update collection dialog
 *
 * @export
 * @class CreateCollectionComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  templateUrl: './create-collection.component.html',
})
export class CreateCollectionComponent implements OnInit, OnDestroy {
  createCollectionForm: UntypedFormGroup;
  public loading$: Observable<boolean>;
  public title$: Observable<string>;
  public saveLabel$: Observable<string>;
  constructor(
    private createCollectionQuery: CreateCollectionQuery,
    private createCollectionService: CreateCollectionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formsManager: NgFormsManager<FormsState>
  ) {}

  ngOnInit() {
    this.loading$ = this.createCollectionQuery.loading$;
    this.title$ = this.createCollectionQuery.title$;
    this.saveLabel$ = this.createCollectionQuery.saveLabel$;
    this.createCollectionService.clearState();
    this.createCollectionForm = this.createCollectionService.createForm(this.formsManager, this.data);
    this.createCollectionService.setValues(this.data);
  }

  createCollection() {
    this.createCollectionService.createOrUpdateCollection(this.data, this.createCollectionForm);
  }

  get name(): AbstractControl {
    return this.createCollectionForm.get('name');
  }

  get topic(): AbstractControl {
    return this.createCollectionForm.get('topic');
  }

  get displayName(): AbstractControl {
    return this.createCollectionForm.get('displayName');
  }

  get description(): AbstractControl {
    return this.createCollectionForm.get('description');
  }

  ngOnDestroy(): void {
    this.formsManager.unsubscribe();
  }
}
