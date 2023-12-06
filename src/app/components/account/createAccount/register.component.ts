import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bcrypt from 'bcryptjs';

import { AlertService } from '../../../services/alert.service';
import { AccountService } from '../../..//services/account.service';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  hashedPassword: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
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
