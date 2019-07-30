import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  login() {
    this.userService.login(this.username.value, this.password.value)
      .subscribe(() => {
        this.router.navigate(['index']);
      }, () => {
        // do something couldn't log in
      });
  }
}
