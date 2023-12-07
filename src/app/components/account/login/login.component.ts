import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService } from '../../../services/alert.service';
import { AccountService } from '../../../services/account.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  translate: boolean;
  translatedContentFr: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.translationService
      .getTranslationObservable()
      .subscribe(async (state) => {
        this.translate = state;
        this.translatedContentFr = await this.translatedContentMaker();
      });
  }

  translatedContent: any = {
    login: 'Login',
    username: 'Username',
    usernameRequired: 'Username is required',
    password: 'Password',
    passwordRequired: 'Password is required',
    register: 'Register',
  };

  async translatedContentMaker() {
    const translated: { [key: string]: string } = {};

    for (const key in this.translatedContent) {
      if (Object.prototype.hasOwnProperty.call(this.translatedContent, key)) {
        const value = this.translatedContent[key];
        const translatedValue = this.translate
          ? await this.translationService.translateText(value)
          : value;

        // Remove surrounding quotes from translatedValue, if present
        translated[key] = translatedValue.replace(/^"(.*)"$/, '$1');
      }
    }

    return translated;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  async onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    const userDetailsForm = {
      username: this.f.username.value,
      password: this.f.password.value,
    };
    this.accountService.login(userDetailsForm).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: async (error: any) => {
        if (this.translate) {
          error = await this.translationService.translateText(error);
          console.log(error);
        }
        this.alertService.error(error);
        this.loading = false;
      },
    });
  }
}
