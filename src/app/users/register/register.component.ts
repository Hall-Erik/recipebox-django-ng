import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../services/user.service';

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

  constructor(
    private userService: UserService,
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
      this.username.value, this.email.value, this.password.value)
      .subscribe((resp) => {
        this.router.navigate(['login']);
      }, (err) => {
        if (err.error.username) {
          // do something (a user with that name exists.)
        }
      });
  }
}
