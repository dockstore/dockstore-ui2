import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { Base } from '../../../shared/base';
import { CloudInstance, Language, User, UsersService } from '../../../shared/openapi';

@Component({
  selector: 'app-multi-cloud-launch',
  templateUrl: './multi-cloud-launch.component.html',
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

  @Output() closed: EventEmitter<void>;

  customLaunchWithOption: string;

  presetLaunchWithOption: string;

  launchWith = { url: '' };

  defaultLaunchWith: string;

  customDefaultLaunchWith: string;

  partner: string;

  expanded = false;

  constructor(private usersService: UsersService, private alertService: AlertService) {
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

    // Create and save a user's custom launch entry to the db
    if (this.presetLaunchWithOption === 'other' && this.user) {
      let url: URL;
      try {
        this.alertService.start('Constructing URL');
        url = new URL(this.launchWith.url);
        this.alertService.simpleSuccess();
      } catch (error) {
        this.alertService.customDetailedError(
          'Invalid URL',
          this.launchWith.url +
            ' is is not a valid URL. ' +
            'Make sure your URL starts with "https://" and ends with a top-level domain like ".com" or ".eu".'
        );
      }

      const newCustomInstance: CloudInstance = {
        url: this.launchWith.url,
        partner: this.languagePartner,
        supportsFileImports: null,
        supportsHttpImports: null,
        supportedLanguages: new Array<Language>(),
        displayName: url.hostname,
      };

      this.usersService.postUserCloudInstance(this.user.id, newCustomInstance).subscribe(
        (usersCloudInstances: Array<CloudInstance>) => {
          this.usersCloudInstances = usersCloudInstances;
        },
        (error: HttpErrorResponse) => {
          // It's okay for the save to the db to fail for now. At this step, we only care about what URL's users
          // are trying to use. Probably most of these failures will be the for violating the uniqueness constraint
          console.log(error.message);
        }
      );
    }
  }

  private updateLaunchWithUrl(): void {
    this.launchWith.url = this.presetLaunchWithOption === 'other' ? this.customLaunchWithOption : this.presetLaunchWithOption;
  }

  closeMatMenu() {
    this.trigger.closeMenu();
  }
}
