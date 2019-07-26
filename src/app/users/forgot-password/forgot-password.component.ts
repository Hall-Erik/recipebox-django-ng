import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  private sent: boolean = false;
  private email: FormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(private userService: UserService) { }

  send_request() {
    this.userService.request_reset(this.email.value)
      .subscribe((resp) => {
        if (resp['detail'] === 'Password reset e-mail has been sent.') {
          this.sent = true;
        }
      });
  }
}
