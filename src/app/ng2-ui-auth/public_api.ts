import { Ng2UiAuthModule } from './lib/ng2-ui-auth.module';
import { LocalService } from './lib/local.service';
import { Oauth2Service } from './lib/oauth2.service';
import { Oauth1Service } from './lib/oauth1.service';
import { PopupService } from './lib/popup.service';
import { OauthService } from './lib/oauth.service';
import { SharedService } from './lib/shared.service';
import { StorageService } from './lib/storage-service';
import { BrowserStorageService } from './lib/browser-storage.service';
import { AuthService } from './lib/auth.service';
import { ConfigService, CONFIG_OPTIONS } from './lib/config.service';
import { JwtInterceptor } from './lib/interceptor.service';
import { IProviders } from './lib/config-interfaces';
import { StorageType } from './lib/storage-type.enum';

/*
 * Public API Surface of ng2-ui-auth
 */
export {
  Ng2UiAuthModule,
  LocalService,
  Oauth2Service,
  Oauth1Service,
  PopupService,
  OauthService,
  SharedService,
  StorageService,
  BrowserStorageService,
  AuthService,
  ConfigService,
  JwtInterceptor,
  CONFIG_OPTIONS,
  IProviders,
  StorageType,
};
