import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLinkWithHref } from '@angular/router';
import { RegisterGithubAppComponent } from '../register-github-app/register-github-app.component';
import { GithubLandingPageComponent } from '../../github-landing-page/github-landing-page.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RegisterGithubAppComponent, GithubLandingPageComponent],
  exports: [RegisterGithubAppComponent],
  imports: [
    CommonModule,
    FlexModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLinkWithHref,
    MatAutocompleteModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
})
export class RegisterGithubAppModule {}
