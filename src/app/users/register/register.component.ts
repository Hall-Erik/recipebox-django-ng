import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public username: string = '';
  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  register() {
    this.userService.register(this.username, this.email, this.password)
      .subscribe(() => {
        this.router.navigate(['login']);
      });
  }
}
