import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public logged_in: boolean = false;
    
  constructor(
    public userService: UserService
  ) { }

  ngOnInit() {
    this.userService.isLoggedIn().subscribe(
      (val) => {
        this.logged_in = val});
  }

  logout() {
    this.userService.logout();
  }
}
