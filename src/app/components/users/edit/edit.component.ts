import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { decode } from 'jsonwebtoken';

import { AlertService } from '../../../services/alert.service';
import { AccountService } from '../../../services/account.service';
import * as bcrypt from 'bcryptjs';
import { TranslationService } from '../../../services/translation.service';

@Component({
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  title!: string;
  submitting = false;
  hashedPassword: string;
  submitted = false;
  userDetails: any;
  translate: boolean;
  translatedContentFr: any = {};

  constructor(
    private formBuilder: FormBuilder,
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
    // edit mode
    this.title = 'Edit Your Details';

    this.translationService
      .getTranslationObservable()
      .subscribe(async (state) => {
        this.translate = state;
        this.translatedContentFr = await this.translatedContentMaker();
      });
  }
  get f() {
    return this.form.controls;
  }

  translatedContent: any = {
    title: 'Edit Your Details',
    username: 'Username',
    usernameRequired: 'Username is required',
    password: 'Password',
    passwordRequired: 'Password is required',
    confirmPassword: 'Confirm your password',
    register: 'Register',
    passwordLength: 'Password must be at least 6 characters',
    cancel: 'Cancel',
    save: 'Save',
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

  async onSubmit() {
    this.submitted = true;

    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    const storedToken = JSON.parse(localStorage.getItem('token')!);

    if (storedToken !== null) {
      this.userDetails = decode(storedToken);
    }

    const password = this.form.get('password')!.value;
    const confirmPassword = this.form.get('confirmPassword')!.value;

    this.hashedPassword = await bcrypt.hashSync(this.f.password.value, 10);

    if (password !== confirmPassword) {
      // Passwords don't match, set error and return
      this.form.get('confirmPassword')!.setErrors({ passwordMismatch: true });
      this.alertService.error('Passwords do not match');
      return;
    }

    this.submitting = true;
    const formData = new FormData();
    formData.append('id', this.userDetails.user_id);
    formData.append('username', this.form.get('username')!.value);
    formData.append('password', this.hashedPassword);
    this.updateUser(formData);
  }

  updateUser(formData: FormData) {
    this.accountService.updateUserDetails(formData).subscribe({
      next: () => {
        this.submitting = false;
        this.alertService.success('User details updated', {
          keepAfterRouteChange: true,
          autoClose: true,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.accountService.logout();
      },
      error: async (error) => {
        if (this.translate) {
          error = await this.translationService.translateText(error);
          error = error.replace(/^"(.*)"$/, '$1');
        }
        this.handleError(error);
      },
    });
  }

  private handleError(error: any) {
    this.alertService.error(error, { autoClose: true });
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
