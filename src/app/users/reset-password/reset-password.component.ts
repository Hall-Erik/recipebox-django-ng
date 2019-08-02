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

  constructor(private userService: UserService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.token.setValue(this.route.snapshot.paramMap.get('token'));
  }

  passwords_match(c: AbstractControl) {
    if (c.get('password1').value !== c.get('password2').value) {
      return {invalid: true};
    }
  }

  reset_password() {
    this.userService.reset_password(
      this.token.value, this.password1.value)
      .subscribe((resp) => {
        // if(resp['detail'] === 'Pas/sword has been reset with the new password.') {
          this.router.navigate(['login']);
          this.alertService.success('Password update. You can now log in.');
        // }
      });
  }
}
