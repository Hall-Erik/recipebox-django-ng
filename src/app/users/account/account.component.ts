import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { AlertService } from '../../services/alert.service';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public user: User;

  public old_pw_err = "";
  public pw1_err = "";
  public pw2_err = "";

  constructor(private alertService: AlertService,
              private userService: UserService,
              private router: Router,
              private fb: FormBuilder) { }

  public pwForm = this.fb.group({
    old_password: ['', Validators.required],
    new_password1: ['', Validators.required],
    new_password2: ['', Validators.required]
  }, {validator: this.passwords_match});

  get old_password() { return this.pwForm.get('old_password'); }
  get new_password1() { return this.pwForm.get('new_password1'); }
  get new_password2() { return this.pwForm.get('new_password2'); }

  passwords_match(c: AbstractControl) {
    if (c.get('new_password1').value !== c.get('new_password2').value) {
      return {invalid: true};
    }
  }

  ngOnInit() {
    this.userService.getUser()
      .subscribe((user) => {
        this.user = user;
      }, () => {
        this.router.navigate(['index']);
      });
  }

  change_password() {
    this.userService.change_password(this.old_password.value,
      this.new_password1.value, this.new_password2.value)
      .subscribe(() => {
        this.alertService.success('Password changed.');
        this.pwForm.reset();
      }, (err) => {
        console.log(err.error);
        if (err.error.old_password) {
          this.old_pw_err = err.error.old_password;
          this.old_password.setErrors({"api": true});
        }
        if (err.error.new_password1) {
          this.pw1_err = err.error.new_password1;
          this.new_password1.setErrors({"api": true});
        }
        if (err.error.new_password2) {
          this.pw2_err = err.error.new_password2;
          this.new_password2.setErrors({"api": true});
        }
      });
  }
}
