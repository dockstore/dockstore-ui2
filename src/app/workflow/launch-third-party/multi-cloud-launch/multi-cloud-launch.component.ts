import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Base } from '../../../shared/base';
import { CloudInstance, User } from '../../../shared/openapi';

@Component({
  selector: 'app-multi-cloud-launch',
  templateUrl: './multi-cloud-launch.component.html',
  styleUrls: ['./multi-cloud-launch.component.scss'],
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
  appendToLaunchUrl: string;

  @Input()
  user: User;

  @Input()
  imagePath: string;

  @Input()
  className: string;

  @Input()
  disabled: boolean;

  @Input()
  tooltip: string;

  @Output() closed: EventEmitter<void>;

  customLaunchWithOption: string;

  presetLaunchWithOption: string;

  launchWith = { url: '' };

  defaultLaunchWith: string;

  customDefaultLaunchWith: string;

  partner: string;

  expanded = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.defaultLaunchWith = localStorage.getItem('defaultLaunchWith');
    if (this.defaultLaunchWith) {
      this.launchWith.url = this.defaultLaunchWith;
    }

    // Set the text of the custom launch with field if it's ever been used previously
    const localCustomLaunchWith: string = localStorage.getItem('customDefaultLaunchWith');
    if (localCustomLaunchWith) {
      this.customLaunchWithOption = localCustomLaunchWith;
    }
    // Select the custom option by default if it was used the time before
    if (localStorage.getItem('useCustomLaunch') === 'true') {
      this.presetLaunchWithOption = 'other';
    }

    switch (this.languagePartner) {
      case CloudInstance.PartnerEnum.GALAXY:
        this.partner = 'Galaxy';
        break;
      case CloudInstance.PartnerEnum.DNASTACK:
        this.partner = 'DNAstack';
        break;
      default:
        this.partner = null;
    }
  }

  get presetLaunchWith(): string {
    return this.presetLaunchWithOption;
  }
  set presetLaunchWith(value: string) {
    this.presetLaunchWithOption = value;
    this.updateLaunchWithUrl();
  }

  get customLaunchWith(): string {
    return this.customLaunchWithOption;
  }

  set customLaunchWith(value: string) {
    this.customLaunchWithOption = value;
    this.updateLaunchWithUrl();
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  menuClosed() {
    this.expanded = !this.expanded;
  }

  selectDefault(): void {
    localStorage.setItem('defaultLaunchWith', this.launchWith.url);
    this.defaultLaunchWith = localStorage.getItem('defaultLaunchWith');

    // If the user launches with the custom launch option, then save the url to local storage and mark to use it at the default.
    if (this.presetLaunchWithOption === 'other') {
      localStorage.setItem('useCustomLaunch', 'true');
      localStorage.setItem('customDefaultLaunchWith', this.launchWith.url);
    } else {
      localStorage.setItem('useCustomLaunch', 'false');
    }

    // Uncomment when we want to create and save a user's custom launch entry
    // if (this.presetLaunchWithOption === 'other' && this.user) {
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
    this.launchWith.url = this.presetLaunchWithOption === 'other' ? this.customLaunchWithOption : this.presetLaunchWithOption;
  }

  closeMatMenu() {
    this.trigger.closeMenu();
  }
}
