import { Component } from '@angular/core';
import { SignalR_HUB } from './definitions/models/SignalR.model';
import { environment } from 'src/environments/environment';
import { BaseService } from './services/base.service';
import { StorageService } from './services/storage.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public ChatHUB: SignalR_HUB = new SignalR_HUB(environment.chatHubUrl, environment.chatApiUrl, this.storageService, this.baseService);

  constructor(
    public baseService: BaseService,
    public storageService: StorageService,
  ) {

    if (baseService.authenticated) {
      this.ChatHUB.Connect();
    }
    
  }

}
