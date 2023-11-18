import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLinkWithHref } from '@angular/router';
import { RegisterGithubAppComponent } from '../register-github-app/register-github-app.component';

@NgModule({
  declarations: [RegisterGithubAppComponent],
  exports: [RegisterGithubAppComponent],
  imports: [CommonModule, FlexModule, MatButtonModule, MatIconModule, MatTooltipModule, RouterLinkWithHref],
})
export class RegisterGithubAppModule {}
