import { Component } from '@angular/core';

import { AccountService } from './services/account.service';
import { TranslationService } from './services/translation.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  user?: User | null;
  language: string = 'French';

  constructor(
    private accountService: AccountService,
    private translationService: TranslationService
  ) {
    this.accountService.user.subscribe((x) => (this.user = x));
  }

  translate(): void {
    const buttonState = this.translationService.getButtonState();
    this.translationService.setButtonState(!buttonState);
    this.language = buttonState ? 'French' : 'English';
    console.log('state after click', buttonState);
  }

  logout() {
    this.accountService.logout();
  }
}
