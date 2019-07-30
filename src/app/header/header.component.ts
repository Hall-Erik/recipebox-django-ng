import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public logged_in: boolean = false;
    
  constructor(
    public userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.isLoggedIn().subscribe(
      (val) => {
        this.logged_in = val});
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.alertService.clear();
      this.router.navigate(['index']);
      this.alertService.success('You are now logged out.');
    });    
  }
}
