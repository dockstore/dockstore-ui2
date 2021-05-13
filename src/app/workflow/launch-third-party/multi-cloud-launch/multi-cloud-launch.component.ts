import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Base } from '../../../shared/base';
import { CloudInstance, CloudInstancesService, Language, User, UsersService } from '../../../shared/openapi';
import { UserQuery } from '../../../shared/user/user.query';

@Component({
  selector: 'app-multi-cloud-launch',
  templateUrl: './multi-cloud-launch.component.html',
  styleUrls: ['../launch-third-party.component.scss'],
})
export class MultiCloudLaunchComponent extends Base implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  @Input()
  cloudInstances: Array<CloudInstance>;

  @Input()
  usersCloudInstances: Array<CloudInstance>;

  @Input()
  languagePartner: CloudInstance.PartnerEnum;

  @Input()
  launchUrlAppend: string;

  @Input()
  user: User;
  _customLaunchWithOption: string;

  _launchWithOption: string;

  launchWith = { url: '' };

  defaultLaunchWith: string;

  customDefaultLaunchWith: string;

  partner: string;

  constructor(private usersService: UsersService) {
    super();
  }

  ngOnInit(): void {
    this.defaultLaunchWith = localStorage.getItem('defaultLaunchWith');
    if (this.defaultLaunchWith) {
      this.launchWith.url = this.defaultLaunchWith;
    }

    // Set the text of the custom launch with field if it's ever been used previously
    if (localStorage.getItem('customDefaultLaunchWith')) {
      this._customLaunchWithOption = this.defaultLaunchWith;
    }
    // Select the custom option by default if it was used the time before
    if (localStorage.getItem('useCustomLaunch') === 'true') {
      this._launchWithOption = 'other';
    }

    switch (this.languagePartner) {
      case 'GALAXY':
        this.partner = 'Galaxy';
        break;
      case 'DNA_NEXUS':
        this.partner = 'DNAnexus';
        break;
      default:
        this.partner = null;
    }
  }

  get launchWithOption(): string {
    return this._launchWithOption;
  }
  set launchWithOption(value: string) {
    this._launchWithOption = value;
    this.updateLaunchWithUrl();
  }

  get customLaunchWithOption(): string {
    return this._customLaunchWithOption;
  }

  set customLaunchWithOption(value: string) {
    this._customLaunchWithOption = value;
    this.updateLaunchWithUrl();
  }

  selectDefault(): void {
    localStorage.setItem('defaultLaunchWith', this.launchWith.url);
    this.defaultLaunchWith = localStorage.getItem('defaultLaunchWith');
    console.log('Custom Launch Option: ' + this._customLaunchWithOption);

    // If the user launches with the custom launch option, then save the url to local storage and mark to use it at the default.
    if (this._launchWithOption === 'other') {
      localStorage.setItem('useCustomLaunch', 'true');
      localStorage.setItem('customDefaultLaunchWith', this.launchWith.url);
    } else {
      localStorage.setItem('useCustomLaunch', 'false');
    }

    // Uncomment when we want to create and save a user's custom launch entry
    // if (this._launchWithOption === 'other' && this.user) {
    //   const url: URL = new URL(this.launchWith.url);
    //   const newCustomInstance: CloudInstance = {
    //     url: this.launchWith.url,
    //     partner: this.languagePartner,
    //     supportsFileImports: null,
    //     supportsHttpImports: null,
    //     supportedLanguages: new Array<Language>(),
    //     displayName: url.hostname,
    //   };
    //
    //   this.usersService.postUserCloudInstance(this.user.id, newCustomInstance).subscribe(
    //     (usersCloudInstances: Array<CloudInstance>) => {
    //       this.usersCloudInstances = usersCloudInstances;
    //     },
    //     (error: HttpErrorResponse) => {
    //       console.log(error.message);
    //     }
    //   );
    // }
  }

  private updateLaunchWithUrl(): void {
    this.launchWith.url = this._launchWithOption === 'other' ? this._customLaunchWithOption : this._launchWithOption;
  }

  closeMatMenu() {
    this.trigger.closeMenu();
  }
}
