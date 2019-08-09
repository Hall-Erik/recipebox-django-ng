import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public resetForm = this.fb.group({
    token: '',
    password1: ['', Validators.required],
    password2: ['', Validators.required]
  }, {validator: this.passwords_match});
  
  get token() { return this.resetForm.get('token'); }
  get password1() { return this.resetForm.get('password1'); }
  get password2() { return this.resetForm.get('password2'); }

  public tokenStatus: Status = Status.LOADING;

  constructor(private userService: UserService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    let token = this.route.snapshot.paramMap.get('token');
    this.token.setValue(token);
    this.userService.validate_token(token)
      .subscribe(() => {
        this.tokenStatus = Status.VALID;
      }, (err) => {
        if (err.error.status === "notfound") {
          this.tokenStatus = Status.NOT_FOUND;
        }
        if (err.error.status === "expired") {
          this.tokenStatus = Status.EXPIRED;
        }
        console.log(err.error);
      });
  }

  token_loading() { return this.tokenStatus == Status.LOADING; }
  token_valid() { return this.tokenStatus == Status.VALID; }
  token_notfound() { return this.tokenStatus == Status.NOT_FOUND; }
  token_expired() { return this.tokenStatus == Status.EXPIRED; }

  passwords_match(c: AbstractControl) {
    if (c.get('password1').value !== c.get('password2').value) {
      return {invalid: true};
    }
  }

  reset_password() {
    this.userService.reset_password(
      this.token.value, this.password1.value)
      .subscribe(() => {
          this.router.navigate(['login']);
          this.alertService.success('Password update. You can now log in.');
      });
  }
}

export enum Status {
  LOADING,
  NOT_FOUND,
  EXPIRED,
  VALID
}