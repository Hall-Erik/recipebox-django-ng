import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public username: string = '';
  public password: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  login() {
    this.userService.login(this.username, this.password)
      .subscribe((resp) => {
        console.log('Sucessfully logged in.');
        this.router.navigate(['index']);
      }, (err) => {
        console.log('Something went wrong');
      });
  }

}
