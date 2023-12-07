import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bcrypt from 'bcryptjs';

import { AlertService } from '../../../services/alert.service';
import { AccountService } from '../../..//services/account.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  hashedPassword: string;
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
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
    confirmPassword: 'Confirm your password',
    pleaseConfirmPassword: 'Please confirm your password',
    register: 'Register',
    passwordLength: 'Password must be at least 6 characters',
    cancel: 'Cancel',
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
    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    const password = this.form.get('password')!.value;
    const confirmPassword = this.form.get('confirmPassword')!.value;

    if (password !== confirmPassword) {
      // Passwords don't match, set error and return
      this.form.get('confirmPassword')!.setErrors({ passwordMismatch: true });
      this.alertService.error('Passwords do not match');
      return;
    }

    this.hashedPassword = await bcrypt.hashSync(this.f.password.value, 10);
    // Construct FormData and register user
    const formData = new FormData();
    formData.append('username', this.f.username.value);
    formData.append('password', this.hashedPassword);
    formData.append('confirmPassword', this.f.confirmPassword.value);

    this.loading = true;
    this.accountService.registerUser(formData).subscribe({
      next: () => {
        this.alertService.success('Registration successful', {
          keepAfterRouteChange: true,
        });
        this.router.navigate(['../login'], { relativeTo: this.route });
      },
      error: (error) => {
        this.alertService.error(error);
        this.loading = false;
      },
    });
  }
}
