import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateCollectionService } from '../state/create-collection.service';
import { CreateCollectionQuery } from '../state/create-collection.query';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';

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

  constructor(private createCollectionQuery: CreateCollectionQuery,
              private createCollectionService: CreateCollectionService,
              private builder: FormBuilder, private formsManager: AkitaNgFormsManager<FormsState>
  ) { }

  ngOnInit() {
    this.createCollectionService.clearState();
    this.createCollectionForm = this.builder.group({
      name: [null, [Validators.required, Validators.maxLength(39), Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z\d]*$/)]],
      description: [null]
    });
    this.formsManager.upsert('createCollection', this.createCollectionForm);
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
}
