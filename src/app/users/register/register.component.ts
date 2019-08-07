import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {validator: this.passwords_match});

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  public username_err = "";
  public email_err = "";
  public password_err = "";
  public confirm_err = "";

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  passwords_match(c: AbstractControl) {
    if (c.get('password').value !== c.get('confirmPassword').value) {
      return {invalid: true};
    }
  }

  register() {
    this.userService.register(
      this.username.value, this.email.value, this.password.value, this.confirmPassword.value)
      .subscribe(() => {
        this.router.navigate(['login']);
        this.alertService.success('Account created. You can now log in.');
      }, (err) => {
        this.alertService.error("Could not register with the information provided.");
        if (err.error.username) {
          this.username_err = err.error.username;
          this.username.setErrors({"api": true});
        }
        if (err.error.email) {
          this.email_err = err.error.email;
          this.email.setErrors({"api": true});
        }
        if (err.error.password1) {
          this.password_err = err.error.password1;
          this.password.setErrors({"api": true});
        }
        if (err.error.password2) {
          this.confirm_err = err.error.password2;
          this.confirmPassword.setErrors({"api": true});
        }
      });
  }
}
